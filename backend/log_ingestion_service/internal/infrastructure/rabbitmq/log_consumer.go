package rabbitmq

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	adapter "log_ingestion_service/internal/adapters/rabbitmq"
	"log_ingestion_service/internal/entities"
)

// LogHandlerFunc describes callback that receives a Terraform log entity and processes it.
type LogHandlerFunc func(ctx context.Context, log entities.TerraformLog) error

// LogConsumer wraps the low-level RabbitMQ client and exposes a domain-specific Consume API.
type LogConsumer struct {
	client      *adapter.Client
	queueName   string
	consumerTag string
}

// NewLogConsumer constructs a new LogConsumer. Queue declaration responsibility is left to
// the caller to keep this component focused on message consumption.
func NewLogConsumer(client *adapter.Client, queueName, consumerTag string) (*LogConsumer, error) {
	if client == nil {
		return nil, errors.New("log consumer: nil rabbitmq client")
	}
	if queueName == "" {
		return nil, errors.New("log consumer: queue name is required")
	}
	if consumerTag == "" {
		consumerTag = "log_ingestion_consumer"
	}

	return &LogConsumer{
		client:      client,
		queueName:   queueName,
		consumerTag: consumerTag,
	}, nil
}

// ConsumeTerraformLogs blocks and continuously consumes terraform log entities from RabbitMQ.
// It will stop only when the context is cancelled or an unrecoverable error occurs.
func (c *LogConsumer) ConsumeTerraformLogs(ctx context.Context, handler LogHandlerFunc) error {
	if handler == nil {
		return errors.New("log consumer: handler cannot be nil")
	}

	deliveries, err := c.client.Consume(ctx, c.queueName, c.consumerTag)
	if err != nil {
		return fmt.Errorf("log consumer: failed to start consuming: %w", err)
	}

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case delivery, ok := <-deliveries:
			if !ok {
				return errors.New("log consumer: delivery channel closed")
			}

			logEntity, err := decodeTerraformLog(delivery.Body)
			if err != nil {
				_ = c.client.Nack(delivery, false)
				continue
			}

			if err := handler(ctx, logEntity); err != nil {
				_ = c.client.Nack(delivery, true)
				continue
			}

			_ = c.client.Ack(delivery)
		}
	}
}

func decodeTerraformLog(payload []byte) (entities.TerraformLog, error) {
	var raw map[string]interface{}
	if err := json.Unmarshal(payload, &raw); err != nil {
		return entities.TerraformLog{}, fmt.Errorf("decode terraform log: %w", err)
	}

	logEntity := entities.TerraformLog{
		Raw:      append([]byte(nil), payload...),
		Metadata: make(map[string]string),
	}

	setStringField := func(target *string, keys ...string) {
		for _, key := range keys {
			if value, ok := raw[key]; ok {
				if str, ok := value.(string); ok {
					*target = str
					return
				}
			}
		}
	}

	setStringField(&logEntity.Level, "@level", "level")
	setStringField(&logEntity.Message, "@message", "message")
	setStringField(&logEntity.RunID, "run_id", "runId", "@run_id")
	setStringField(&logEntity.Workspace, "workspace", "@workspace")
	setStringField(&logEntity.Stage, "stage", "@stage")
	setStringField(&logEntity.Component, "component", "@component")

	if tsStr, ok := raw["@timestamp"].(string); ok {
		if ts, err := parseTimestamp(tsStr); err == nil {
			logEntity.Timestamp = ts
		}
	} else if tsStr, ok := raw["timestamp"].(string); ok {
		if ts, err := parseTimestamp(tsStr); err == nil {
			logEntity.Timestamp = ts
		}
	}

	collectMetadata := func(key string, value interface{}) {
		switch strings.ToLower(key) {
		case "@level", "level", "@message", "message", "@timestamp", "timestamp", "run_id", "runid", "@run_id", "workspace", "@workspace", "stage", "@stage", "component", "@component":
			return
		}
		if str, ok := value.(string); ok {
			logEntity.Metadata[key] = str
		}
	}

	for key, value := range raw {
		collectMetadata(key, value)
	}

	if len(logEntity.Metadata) == 0 {
		logEntity.Metadata = nil
	}

	return logEntity, nil
}

func parseTimestamp(value string) (time.Time, error) {
	layouts := []string{
		time.RFC3339Nano,
		time.RFC3339,
		"2006-01-02T15:04:05.000000-07:00",
	}

	for _, layout := range layouts {
		if ts, err := time.Parse(layout, value); err == nil {
			return ts, nil
		}
	}

	return time.Time{}, fmt.Errorf("unsupported timestamp format: %s", value)
}
