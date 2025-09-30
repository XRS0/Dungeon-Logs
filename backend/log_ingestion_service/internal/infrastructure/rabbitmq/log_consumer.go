package rabbitmq

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

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
	var logEntity entities.TerraformLog
	if err := json.Unmarshal(payload, &logEntity); err != nil {
		return entities.TerraformLog{}, fmt.Errorf("decode terraform log: %w", err)
	}

	if len(logEntity.Raw) == 0 {
		logEntity.Raw = append(logEntity.Raw, payload...)
	}

	return logEntity, nil
}
