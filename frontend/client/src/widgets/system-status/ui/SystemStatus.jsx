import { ArrowDownRight, ArrowUpRight, Equal, Gauge } from "lucide-react";

import { SectionCard } from "~shared/ui";
import { formatRelativeMinutes } from "~shared/lib/date";
import { useSystemStatus } from "~entities/system";

const trendIconMap = {
  up: <ArrowUpRight className="h-4 w-4" />,
  down: <ArrowDownRight className="h-4 w-4" />,
  steady: <Equal className="h-4 w-4" />
};

export const SystemStatus = () => {
  const { data, isLoading } = useSystemStatus();
  const metrics = data?.metrics ?? [];
  const signals = data?.signals ?? [];

  return (
    <SectionCard
      title="Состояние системы"
      subtitle="Метрики в реальном времени"
      icon={<Gauge className="h-6 w-6" />}
      className="min-h-[260px]"
    >
      {isLoading && (
        <div className="h-32 animate-pulse rounded-2xl border border-interactive/40 bg-surface/50" />
      )}
      {!isLoading && (metrics.length > 0 || signals.length > 0) && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-interactive/40 bg-surface/70 p-4"
              >
                <div className="flex items-center justify-between text-sm text-white/40">
                  <span>{metric.label}</span>
                  {metric.delta && (
                    <span
                      className={`flex items-center gap-1 text-xs font-medium ${
                        metric.delta.trend === "up"
                          ? "text-accent"
                          : metric.delta.trend === "down"
                          ? "text-amber-300"
                          : "text-white/60"
                      }`}
                    >
                      {trendIconMap[metric.delta.trend]}
                      {metric.delta.value}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
                <p
                  className={`mt-2 text-sm font-medium ${
                    metric.tone === "positive"
                      ? "text-accent"
                      : metric.tone === "warning"
                      ? "text-amber-300"
                      : metric.tone === "critical"
                      ? "text-red-400"
                      : "text-white/50"
                  }`}
                >
                  {metric.tone === "positive"
                    ? "Стабильно"
                    : metric.tone === "warning"
                    ? "Требует внимания"
                    : metric.tone === "critical"
                    ? "Критический риск"
                    : ""}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {signals.map((signal) => (
              <div
                key={signal.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-interactive/40 bg-surface/70 p-4"
              >
                <div>
                  <p className="text-lg font-semibold text-white">{signal.title}</p>
                  <p className="mt-1 text-sm text-white/60">{signal.description}</p>
                </div>
                <div className="text-right text-xs text-white/40">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 font-semibold uppercase tracking-wide ${
                      signal.status === "ok"
                        ? "bg-accent/15 text-accent"
                        : signal.status === "attention"
                        ? "bg-amber-500/15 text-amber-200"
                        : "bg-red-500/15 text-red-300"
                    }`}
                  >
                    {signal.status}
                  </span>
                  <p className="mt-2">обновлено {formatRelativeMinutes(signal.updatedAt)}</p>
                </div>
              </div>
            ))}
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
