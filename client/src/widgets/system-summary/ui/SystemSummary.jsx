import { SectionCard } from "~shared/ui";
import { useSystemSummary } from "~entities/system";

export const SystemSummary = () => {
  const { data, isLoading } = useSystemSummary();
  const insights = data ?? [];

  return (
    <SectionCard
      title="Отчёт системы"
    >
      {isLoading && (
        <div className="h-32 animate-pulse rounded-2xl border border-interactive/40 bg-surface/50" />
      )}
      {!isLoading && insights.length > 0 && (
        <div className="flex items-center bg-base-100 h-120 justify-center rounded-[20px]">
          <button className="btn btn-accent">Составить отчет</button>
        </div>
      )}
    </SectionCard>
  );
};
