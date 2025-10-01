package postgres

import (
	"context"
	"encoding/json"
	"strings"
	"time"

	"log_ingestion_service/internal/entities"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// LogRepository persists Terraform logs into PostgreSQL.
type LogRepository struct {
	pool *pgxpool.Pool
}

func NewLogRepository(pool *pgxpool.Pool) *LogRepository {
	return &LogRepository{pool: pool}
}

func (r *LogRepository) SaveLogs(ctx context.Context, logs []entities.TerraformLog) error {
	if len(logs) == 0 {
		return nil
	}

	batch := &pgx.Batch{}

	for _, entry := range logs {
		runID := resolveUUID(entry)
		workspace := firstNonEmpty(entry.Workspace, entry.Metadata["workspace"], "unknown")
		timestamp := entry.Timestamp
		if timestamp.IsZero() {
			timestamp = time.Now().UTC()
		}

		level := strings.ToLower(firstNonEmpty(entry.Level, "info"))
		stage := nullable(entry.Stage)
		component := nullable(entry.Component)
		resourceType := nullable(resolveResourceType(entry))
		reqID := nullable(firstNonEmpty(entry.Metadata["req_id"], entry.Metadata["request_id"], entry.Metadata["@req_id"]))

		payload := entry.Raw
		if len(payload) == 0 {
			if encoded, err := json.Marshal(entry); err == nil {
				payload = encoded
			}
		}

		batch.Queue(`INSERT INTO logs (run_id, workspace, timestamp, level, stage, component, message, resource_type, req_id, data)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			runID,
			workspace,
			timestamp,
			level,
			stage,
			component,
			entry.Message,
			resourceType,
			reqID,
			payload,
		)
	}

	results := r.pool.SendBatch(ctx, batch)
	defer results.Close()

	for range logs {
		if _, err := results.Exec(); err != nil {
			return err
		}
	}

	return nil
}

func resolveUUID(entry entities.TerraformLog) uuid.UUID {
	candidates := []string{
		entry.RunID,
		entry.Metadata["run_id"],
		entry.Metadata["@run_id"],
	}

	for _, candidate := range candidates {
		if candidate == "" {
			continue
		}
		if id, err := uuid.Parse(candidate); err == nil {
			return id
		}
	}

	return uuid.Nil
}

func resolveResourceType(entry entities.TerraformLog) string {
	if entry.Resource != nil && entry.Resource.Type != "" {
		return entry.Resource.Type
	}
	if entry.Metadata != nil {
		if value, ok := entry.Metadata["resource_type"]; ok {
			return value
		}
	}
	return ""
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return ""
}

func nullable(value string) interface{} {
	if strings.TrimSpace(value) == "" {
		return nil
	}
	return value
}
