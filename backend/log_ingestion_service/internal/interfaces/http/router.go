package http

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"time"

	"log_ingestion_service/internal/entities"
	"log_ingestion_service/internal/usecases"
)

type SummaryPublisher interface {
	PublishSummary(ctx context.Context, summary entities.TerraformSummary) error
}

type LogProcessingUseCase interface {
	Execute(ctx context.Context, r io.Reader) (usecases.ProcessResult, error)
}

type Handler struct {
	publisher SummaryPublisher
	usecase   LogProcessingUseCase
	maxBytes  int64
}

func NewHandler(usecase LogProcessingUseCase, publisher SummaryPublisher, maxUploadBytes int64) *Handler {
	if maxUploadBytes <= 0 {
		maxUploadBytes = 10 * 1024 * 1024 // 10MB default safety hatch
	}
	return &Handler{
		publisher: publisher,
		usecase:   usecase,
		maxBytes:  maxUploadBytes,
	}
}

func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/api/v1/logs/upload", h.withCORS(h.handleUpload))
}

func (h *Handler) withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Max-Age", "3600")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next(w, r)
	}
}

func (h *Handler) handleUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, h.maxBytes)
	defer r.Body.Close()

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	result, err := h.usecase.Execute(ctx, r.Body)
	if err != nil {
		http.Error(w, fmt.Sprintf("failed to process logs: %v", err), http.StatusBadRequest)
		return
	}

	if err := h.publisher.PublishSummary(ctx, result.Summary); err != nil {
		http.Error(w, fmt.Sprintf("failed to publish summary: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	_, _ = io.WriteString(w, `{"status":"accepted"}`)
}
