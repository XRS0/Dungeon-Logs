import { Flame, Radar, Waves } from "lucide-react";

import { SectionCard } from "~shared/ui";
import { useSystemSummary } from "~entities/system";

const impactMap = {
  high: {
    label: "Высокий приоритет",
    color: "bg-red-500/20 text-red-200 border border-red-400/60",
    icon: <Flame className="h-5 w-5" />
  },
  medium: {
    label: "Средний приоритет",
    color: "bg-amber-500/20 text-amber-200 border border-amber-400/60",
    icon: <Radar className="h-5 w-5" />
  },
  low: {
    label: "Низкий приоритет",
    color: "bg-sky-500/20 text-sky-200 border border-sky-400/60",
    icon: <Waves className="h-5 w-5" />
  }
};

export const SystemSummary = () => {
  const { data, isLoading } = useSystemSummary();
  const insights = data ?? [];

  return (
    <SectionCard
      title="Краткий отчёт"
      subtitle="Что требует внимания в ближайшие часы"
      className="min-h-[260px]"
    >
      {isLoading && (
        <div className="h-32 animate-pulse rounded-2xl border border-interactive/40 bg-surface/50" />
      )}
      {!isLoading && insights.length > 0 && (
        <ul className="space-y-3">
          {insights.map((insight) => {
            const tone = impactMap[insight.impact];
            return (
              <li
                key={insight.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-interactive/40 bg-surface/70 p-4"
              >
                <div>
                  <p className="text-lg font-semibold text-white">{insight.title}</p>
                  <p className="mt-1 text-sm text-white/60">{insight.detail}</p>
                </div>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide ${tone.color}`}>
                  {tone.icon}
                  {tone.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      {!isLoading && insights.length === 0 && (
        <div className="rounded-2xl border border-interactive/40 bg-surface/70 p-14 text-center text-white/50">
          Сводка пока пуста — следим за контуром.
        </div>
      )}
    </SectionCard>
  );
};
