package elasticsearch

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"log_ingestion_service/internal/entities"
)

type LogRepository struct {
	client *Client
	index  string
}

func NewLogRepository(client *Client, index string) *LogRepository {
	cleaned := strings.TrimSpace(index)
	if cleaned == "" {
		cleaned = "terraform_logs"
	}

	return &LogRepository{
		client: client,
		index:  cleaned,
	}
}

func (r *LogRepository) SaveLogs(ctx context.Context, logs []entities.TerraformLog) error {
	if len(logs) == 0 {
		return nil
	}

	buf := bytes.Buffer{}

	for _, entry := range logs {
		meta := map[string]map[string]string{
			"index": {
				"_index": r.index,
			},
		}
		if strings.TrimSpace(entry.ID) != "" {
			meta["index"]["_id"] = entry.ID
		}

		metaBytes, err := json.Marshal(meta)
		if err != nil {
			return fmt.Errorf("elasticsearch: marshal bulk metadata: %w", err)
		}
		buf.Write(metaBytes)
		buf.WriteByte('\n')

		docBytes, err := json.Marshal(r.buildDocument(entry))
		if err != nil {
			return fmt.Errorf("elasticsearch: marshal log document: %w", err)
		}
		buf.Write(docBytes)
		buf.WriteByte('\n')
	}

	res, err := r.client.Native().Bulk(bytes.NewReader(buf.Bytes()), r.client.Native().Bulk.WithContext(ctx))
	if err != nil {
		return fmt.Errorf("elasticsearch: bulk request failed: %w", err)
	}
	defer res.Body.Close()

	if res.IsError() {
		return fmt.Errorf("elasticsearch: bulk request error: %s", res.String())
	}

	var bulkResp struct {
		Errors bool `json:"errors"`
		Items  []map[string]struct {
			Status int `json:"status"`
			Error  struct {
				Type   string `json:"type"`
				Reason string `json:"reason"`
			} `json:"error,omitempty"`
		} `json:"items"`
	}

	if err := json.NewDecoder(res.Body).Decode(&bulkResp); err != nil {
		return fmt.Errorf("elasticsearch: decode bulk response: %w", err)
	}

	if !bulkResp.Errors {
		return nil
	}

	var firstError string
	for _, item := range bulkResp.Items {
		for _, result := range item {
			if result.Status >= 300 && result.Error.Reason != "" {
				firstError = fmt.Sprintf("status=%d type=%s reason=%s", result.Status, result.Error.Type, result.Error.Reason)
				break
			}
		}
		if firstError != "" {
			break
		}
	}

	if firstError == "" {
		firstError = "unknown bulk indexing error"
	}

	return fmt.Errorf("elasticsearch: bulk response contains errors: %s", firstError)
}

type logDocument struct {
	ID           string                      `json:"id,omitempty"`
	RunID        string                      `json:"run_id,omitempty"`
	Workspace    string                      `json:"workspace,omitempty"`
	Timestamp    time.Time                   `json:"timestamp"`
	Level        string                      `json:"level,omitempty"`
	Stage        string                      `json:"stage,omitempty"`
	Component    string                      `json:"component,omitempty"`
	Message      string                      `json:"message,omitempty"`
	ResourceType string                      `json:"resource_type,omitempty"`
	Resource     *entities.TerraformResource `json:"resource,omitempty"`
	Change       *entities.TerraformChange   `json:"change,omitempty"`
	Metadata     map[string]string           `json:"metadata,omitempty"`
	Raw          json.RawMessage             `json:"raw,omitempty"`
}

func (r *LogRepository) buildDocument(entry entities.TerraformLog) logDocument {
	timestamp := entry.Timestamp
	if timestamp.IsZero() {
		timestamp = time.Now().UTC()
	}

	metadata := entry.Metadata
	if len(metadata) == 0 {
		metadata = nil
	}

	var raw json.RawMessage
	if len(entry.Raw) > 0 {
		raw = append(json.RawMessage(nil), entry.Raw...)
	}

	return logDocument{
		ID:           entry.ID,
		RunID:        entry.RunID,
		Workspace:    entry.Workspace,
		Timestamp:    timestamp,
		Level:        strings.ToLower(entry.Level),
		Stage:        entry.Stage,
		Component:    entry.Component,
		Message:      entry.Message,
		ResourceType: resolveResourceType(entry),
		Resource:     entry.Resource,
		Change:       entry.Change,
		Metadata:     metadata,
		Raw:          raw,
	}
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
