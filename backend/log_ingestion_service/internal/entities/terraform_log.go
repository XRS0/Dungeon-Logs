package entities

import (
	"encoding/json"
	"time"
)

// TerraformLog represents a single log entry emitted during a Terraform run.
// The structure is flexible enough to capture most of the details that appear in
// Terraform Cloud/Enterprise streaming logs and the CLI JSON output.
type TerraformLog struct {
	ID        string             `json:"id"`
	RunID     string             `json:"run_id"`
	Workspace string             `json:"workspace"`
	Timestamp time.Time          `json:"timestamp"`
	Level     string             `json:"level"`
	Stage     string             `json:"stage"`
	Component string             `json:"component"`
	Message   string             `json:"message"`
	Resource  *TerraformResource `json:"resource,omitempty"`
	Change    *TerraformChange   `json:"change,omitempty"`
	Metadata  map[string]string  `json:"metadata,omitempty"`
	Raw       json.RawMessage    `json:"raw,omitempty"`
}

// TerraformResource describes the resource that is associated with the log entry, if any.
type TerraformResource struct {
	Address  string `json:"address"`
	Type     string `json:"type"`
	Name     string `json:"name"`
	Provider string `json:"provider"`
}

// TerraformChange holds high-level information about a change event within Terraform.
type TerraformChange struct {
	Action       string      `json:"action"`
	PriorState   interface{} `json:"prior_state,omitempty"`
	PlannedState interface{} `json:"planned_state,omitempty"`
	Completed    bool        `json:"completed"`
}
