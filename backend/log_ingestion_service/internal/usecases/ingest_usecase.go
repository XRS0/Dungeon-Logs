package usecases

import (
	"context"
	"io"

	"log_ingestion_service/internal/entities"
	"log_ingestion_service/internal/parser"
)

// LogRepository exposes the behaviour required to persist Terraform logs.
type LogRepository interface {
	SaveLogs(ctx context.Context, logs []entities.TerraformLog) error
}

// TerraformLogProcessingUseCase orchestrates parsing raw Terraform log streams,
// persisting them, and producing higher-level summaries for downstream services.
type TerraformLogProcessingUseCase struct {
	repo    LogRepository
	builder *TerraformSummaryBuilder
}

func NewTerraformLogProcessingUseCase(repo LogRepository, builder *TerraformSummaryBuilder) *TerraformLogProcessingUseCase {
	if builder == nil {
		builder = NewTerraformSummaryBuilder()
	}
	return &TerraformLogProcessingUseCase{repo: repo, builder: builder}
}

type ProcessResult struct {
	Logs    []entities.TerraformLog
	Summary entities.TerraformSummary
}

func (uc *TerraformLogProcessingUseCase) Execute(ctx context.Context, r io.Reader) (ProcessResult, error) {
	logs, err := parser.ParseTerraformLogs(r)
	if err != nil {
		return ProcessResult{}, err
	}

	if uc.repo != nil {
		if err := uc.repo.SaveLogs(ctx, logs); err != nil {
			return ProcessResult{}, err
		}
	}

	summary := uc.builder.Build(ctx, logs)

	return ProcessResult{
		Logs:    logs,
		Summary: summary,
	}, nil
}
