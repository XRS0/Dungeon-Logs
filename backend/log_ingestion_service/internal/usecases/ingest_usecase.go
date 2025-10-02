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

// CombineLogRepositories returns a LogRepository that fan-outs calls to all
// provided repositories. Nil repositories are ignored. If no repositories are
// supplied the function returns nil.
func CombineLogRepositories(repos ...LogRepository) LogRepository {
	var filtered []LogRepository
	for _, repo := range repos {
		if repo != nil {
			filtered = append(filtered, repo)
		}
	}

	if len(filtered) == 0 {
		return nil
	}

	return multiLogRepository(filtered)
}

type multiLogRepository []LogRepository

func (m multiLogRepository) SaveLogs(ctx context.Context, logs []entities.TerraformLog) error {
	for _, repo := range m {
		if err := repo.SaveLogs(ctx, logs); err != nil {
			return err
		}
	}

	return nil
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
