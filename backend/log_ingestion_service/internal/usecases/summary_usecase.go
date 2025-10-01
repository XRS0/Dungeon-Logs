package usecases

import (
	"context"
	"sort"
	"strings"
	"time"

	"log_ingestion_service/internal/entities"
)

// TerraformSummaryBuilder ingests Terraform log entries and produces a compact
// summary highlighting notable events.
type TerraformSummaryBuilder struct {
}

func NewTerraformSummaryBuilder() *TerraformSummaryBuilder {
	return &TerraformSummaryBuilder{}
}

// Build constructs a TerraformSummary from the provided log entries. The summary
// is designed to give downstream LLM services a concise overview of the run.
func (b *TerraformSummaryBuilder) Build(ctx context.Context, logs []entities.TerraformLog) entities.TerraformSummary {
	summary := entities.TerraformSummary{}
	if len(logs) == 0 {
		return summary
	}

	levelCounts := make(map[string]int)
	stageCounts := make(map[string]int)
	componentCounts := make(map[string]int)
	metadataSamples := make(map[string]string)
	commandSet := make(map[string]struct{})

	var (
		firstTimestamp *time.Time
		lastTimestamp  *time.Time
	)

	appendNotable := func(entry entities.TerraformLog) {
		summary.NotableMessages = append(summary.NotableMessages, entities.TerraformSummaryMessage{
			Timestamp: entry.Timestamp,
			Level:     entry.Level,
			Stage:     entry.Stage,
			Component: entry.Component,
			Message:   entry.Message,
		})
	}

	for _, entry := range logs {
		select {
		case <-ctx.Done():
			return summary
		default:
		}

		if summary.RunID == "" && entry.RunID != "" {
			summary.RunID = entry.RunID
		}
		if summary.Workspace == "" && entry.Workspace != "" {
			summary.Workspace = entry.Workspace
		}

		if !entry.Timestamp.IsZero() {
			if firstTimestamp == nil || entry.Timestamp.Before(*firstTimestamp) {
				firstTimestamp = &entry.Timestamp
			}
			if lastTimestamp == nil || entry.Timestamp.After(*lastTimestamp) {
				lastTimestamp = &entry.Timestamp
			}
		}

		if entry.Level != "" {
			level := strings.ToLower(entry.Level)
			levelCounts[level]++
			if level == "error" || level == "warn" {
				appendNotable(entry)
			}
		}
		if entry.Stage != "" {
			stageCounts[strings.ToLower(entry.Stage)]++
		}
		if entry.Component != "" {
			componentCounts[strings.ToLower(entry.Component)]++
		}

		if entry.Metadata != nil {
			for key, value := range entry.Metadata {
				if _, exists := metadataSamples[key]; !exists {
					metadataSamples[key] = value
				}
				if strings.Contains(strings.ToLower(key), "command") {
					commandSet[value] = struct{}{}
				}
			}
		}

		if strings.Contains(strings.ToLower(entry.Message), "error") {
			appendNotable(entry)
		}

		summary.TotalEntries++
	}

	summary.LevelCounts = levelCounts
	summary.StageCounts = stageCounts
	summary.ComponentCounts = componentCounts

	if len(metadataSamples) > 0 {
		summary.MetadataSamples = metadataSamples
	}

	if firstTimestamp != nil {
		summary.StartedAt = firstTimestamp
	}
	if lastTimestamp != nil {
		summary.FinishedAt = lastTimestamp
	}
	if firstTimestamp != nil && lastTimestamp != nil {
		dur := lastTimestamp.Sub(*firstTimestamp).Seconds()
		summary.DurationSeconds = &dur
	}

	if len(commandSet) > 0 {
		var commands []string
		for cmd := range commandSet {
			commands = append(commands, cmd)
		}
		sort.Strings(commands)
		summary.Commands = commands
	}

	if len(summary.NotableMessages) > 0 {
		sort.Slice(summary.NotableMessages, func(i, j int) bool {
			return summary.NotableMessages[i].Timestamp.Before(summary.NotableMessages[j].Timestamp)
		})
	}

	return summary
}
