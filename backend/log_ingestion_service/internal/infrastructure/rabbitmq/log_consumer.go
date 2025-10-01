package rabbitmq

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	adapter "log_ingestion_service/internal/adapters/rabbitmq"
	"log_ingestion_service/internal/entities"
)

// SummaryPublisher wraps the RabbitMQ client and publishes processed summaries
// for downstream services such as the llm_summary_service.
type SummaryPublisher struct {
	client    *adapter.Client
	queueName string
}

func NewSummaryPublisher(client *adapter.Client, queueName string) (*SummaryPublisher, error) {
	if client == nil {
		return nil, errors.New("summary publisher: nil rabbitmq client")
	}
	if queueName == "" {
		return nil, errors.New("summary publisher: queue name is required")
	}

	return &SummaryPublisher{
		client:    client,
		queueName: queueName,
	}, nil
}

// PublishSummary serializes the given Terraform summary and publishes it to the
// configured queue.
func (p *SummaryPublisher) PublishSummary(ctx context.Context, summary entities.TerraformSummary) error {
	payload, err := json.Marshal(summary)
	if err != nil {
		return fmt.Errorf("summary publisher: marshal summary failed: %w", err)
	}

	if err := p.client.Publish(ctx, p.queueName, payload); err != nil {
		return fmt.Errorf("summary publisher: publish failed: %w", err)
	}

	return nil
}
