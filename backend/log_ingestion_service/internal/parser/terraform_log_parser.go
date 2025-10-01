package parser

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"strings"
	"time"

	"log_ingestion_service/internal/entities"
)

// ParseTerraformLogs reads newline-delimited JSON log entries from the provided reader
// and converts them into TerraformLog entities.
func ParseTerraformLogs(r io.Reader) ([]entities.TerraformLog, error) {
	scanner := bufio.NewScanner(r)
	scanner.Buffer(make([]byte, 0, 64*1024), 2*1024*1024) // allow up to 2MB lines

	var logs []entities.TerraformLog
	lineNumber := 0

	for scanner.Scan() {
		lineNumber++
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}

		logEntry, err := decodeTerraformLog([]byte(line))
		if err != nil {
			return nil, fmt.Errorf("parse terraform logs: line %d: %w", lineNumber, err)
		}

		logs = append(logs, logEntry)
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("parse terraform logs: scan failed: %w", err)
	}

	return logs, nil
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
