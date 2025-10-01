package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"log_ingestion_service/config"
	adapter "log_ingestion_service/internal/adapters/rabbitmq"
	"log_ingestion_service/internal/entities"
	infr "log_ingestion_service/internal/infrastructure/rabbitmq"
)

const defaultPrefetch = 5

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	cfg := config.InitConfig()
	if cfg.RMQ.Prefetch <= 0 {
		cfg.RMQ.Prefetch = defaultPrefetch
	}

	client, err := adapter.NewClient(cfg.RMQ)
	if err != nil {
		log.Fatalf("failed to init rabbitmq client: %v", err)
	}
	defer func() {
		if err := client.Close(); err != nil {
			log.Printf("close rabbitmq client: %v", err)
		}
	}()

	queueName := cfg.RMQ.Queue
	if queueName == "" {
		log.Fatal("queue name must be provided via config")
	}

	queue, err := client.DeclareQueue(queueName, true)
	if err != nil {
		log.Fatalf("declare queue %s failed: %v", queueName, err)
	}
	log.Printf("listening on queue %s with prefetch=%d", queue.Name, cfg.RMQ.Prefetch)

	consumer, err := infr.NewLogConsumer(client, queue.Name, cfg.RMQ.Consumer)
	if err != nil {
		log.Fatalf("create log consumer: %v", err)
	}

	handler := func(ctx context.Context, terraformLog entities.TerraformLog) error {
		timestamp := terraformLog.Timestamp
		if timestamp.IsZero() {
			timestamp = time.Now().UTC()
		}

		fmt.Printf("[%s] level=%s message=%s\n", timestamp.Format(time.RFC3339Nano), terraformLog.Level, terraformLog.Message)
		return nil
	}

	if err := consumer.ConsumeTerraformLogs(ctx, handler); err != nil && !errors.Is(err, context.Canceled) {
		log.Fatalf("log consumer stopped with error: %v", err)
	}

	log.Println("log consumer stopped")
}
