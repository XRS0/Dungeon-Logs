package entities

import "time"

// TerraformSummary captures aggregated information about a Terraform log stream
// that can be used downstream for generating concise reports.
type TerraformSummary struct {
	RunID           string                    `json:"run_id,omitempty"`
	Workspace       string                    `json:"workspace,omitempty"`
	StartedAt       *time.Time                `json:"started_at,omitempty"`
	FinishedAt      *time.Time                `json:"finished_at,omitempty"`
	DurationSeconds *float64                  `json:"duration_seconds,omitempty"`
	TotalEntries    int                       `json:"total_entries"`
	LevelCounts     map[string]int            `json:"level_counts,omitempty"`
	StageCounts     map[string]int            `json:"stage_counts,omitempty"`
	ComponentCounts map[string]int            `json:"component_counts,omitempty"`
	NotableMessages []TerraformSummaryMessage `json:"notable_messages,omitempty"`
	Commands        []string                  `json:"commands,omitempty"`
	MetadataSamples map[string]string         `json:"metadata_samples,omitempty"`
}

// TerraformSummaryMessage highlights an individual log message considered
// noteworthy for downstream summarization.
type TerraformSummaryMessage struct {
	Timestamp time.Time `json:"timestamp,omitempty"`
	Level     string    `json:"level,omitempty"`
	Stage     string    `json:"stage,omitempty"`
	Component string    `json:"component,omitempty"`
	Message   string    `json:"message"`
}
