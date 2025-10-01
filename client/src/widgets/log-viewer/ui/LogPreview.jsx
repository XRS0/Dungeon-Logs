import { SectionCard } from "~shared/ui";
import { useRecentLogs } from "~entities/log";
import LogsList from "../../../shared/ui/logs/LogsList";

export const LogPreview = () => {
  const { data, isLoading } = useRecentLogs();
  const logs = data ?? [];

  return (
    <SectionCard
      title="Лента событий"
    >
      <div className="space-y-4 overflow-auto max-h-[420px]">
        {isLoading && (
          <div className="h-24 animate-pulse rounded-2xl" />
        )}
        {!isLoading && logs.length > 0 && (
          <LogsList logs={logs} />
        )}
        {!isLoading && logs.length === 0 && (
          <div className="rounded-2xl border border-interactive/40 bg-surface/70 p-12 text-center">
            Новых логов пока нет — вы на гребне волны 🌊
          </div>
        )}
      </div>
    </SectionCard>
  );
};
