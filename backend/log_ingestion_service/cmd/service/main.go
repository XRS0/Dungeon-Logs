package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"log_ingestion_service/config"
	adapter "log_ingestion_service/internal/adapters/rabbitmq"
	esstore "log_ingestion_service/internal/infrastructure/persistance/elasticsearch"
	pg "log_ingestion_service/internal/infrastructure/persistance/postgres"
	infr "log_ingestion_service/internal/infrastructure/rabbitmq"
	iface "log_ingestion_service/internal/interfaces/http"
	"log_ingestion_service/internal/usecases"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	cfg := config.InitConfig()

	client, err := adapter.NewClient(cfg.RMQ)
	if err != nil {
		log.Fatalf("failed to init rabbitmq client: %v", err)
	}
	defer func() {
		if err := client.Close(); err != nil {
			log.Printf("close rabbitmq client: %v", err)
		}
	}()

	dbClient, err := pg.NewClient(ctx, cfg.DB)
	if err != nil {
		log.Fatalf("failed to init postgres client: %v", err)
	}
	defer dbClient.Close()

	esClient, err := esstore.NewClient(cfg.ES)
	if err != nil {
		log.Fatalf("failed to init elasticsearch client: %v", err)
	}

	queueName := cfg.RMQ.SummaryQueue
	queue, err := client.DeclareQueue(queueName, true)
	if err != nil {
		log.Fatalf("declare queue %s failed: %v", queueName, err)
	}
	log.Printf("summary queue ready: %s", queue.Name)

	publisher, err := infr.NewSummaryPublisher(client, queue.Name)
	if err != nil {
		log.Fatalf("create summary publisher: %v", err)
	}

	builder := usecases.NewTerraformSummaryBuilder()
	repo := usecases.CombineLogRepositories(
		pg.NewLogRepository(dbClient.Pool()),
		esstore.NewLogRepository(esClient, cfg.ES.Index),
	)
	usecase := usecases.NewTerraformLogProcessingUseCase(repo, builder)
	handler := iface.NewHandler(usecase, publisher, cfg.HTTP.MaxUploadBytes)
	mux := http.NewServeMux()
	handler.RegisterRoutes(mux)

	server := &http.Server{
		Addr:              cfg.HTTP.Address,
		Handler:           http.TimeoutHandler(mux, 30*time.Second, "request timed out"),
		ReadHeaderTimeout: 10 * time.Second,
	}

	serverErrors := make(chan error, 1)
	go func() {
		log.Printf("http server listening on %s", cfg.HTTP.Address)
		serverErrors <- server.ListenAndServe()
	}()

	select {
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()
		if err := server.Shutdown(shutdownCtx); err != nil {
			log.Printf("http server shutdown error: %v", err)
		}
	case err := <-serverErrors:
		if err != nil && err != http.ErrServerClosed {
			log.Fatalf("http server error: %v", err)
		}
	}
}
