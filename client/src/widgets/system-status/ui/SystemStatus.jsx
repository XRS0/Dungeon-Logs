import { SectionCard } from "~shared/ui";
import { useSystemStatus } from "~entities/system";
import MetricCard from "../../../shared/ui/MetricCard";

export const SystemStatus = () => {
  const { data, isLoading } = useSystemStatus();
  const metrics = data?.metrics ?? [];
  const signals = data?.signals ?? [];

  return (
    <SectionCard
      title="Состояние системы"
    >
      {isLoading && (
        <div className="h-32 animate-pulse rounded-2xl border border-interactive/40 bg-surface/50" />
      )}
      {!isLoading && (metrics.length > 0 || signals.length > 0) && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, idx) => (
              <MetricCard key={idx} {...metric} />
            ))}
          </div>
          <div className="space-y-3">
            {signals.length === 0 && (
              <div className="rounded-2xl border border-interactive/40 bg-surface/70 p-6 text-center text-white/50">
                Все потоки удерживают стабильность.
              </div>
            )}
          </div>
        </div>
      )}
      {!isLoading && metrics.length === 0 && signals.length === 0 && (
        <div className="rounded-2xl border border-interactive/40 bg-surface/70 p-16 text-center text-white/40">
          Нет активных сигналов. Наслаждайтесь тишиной.
        </div>
      )}
    </SectionCard>
  );
};
