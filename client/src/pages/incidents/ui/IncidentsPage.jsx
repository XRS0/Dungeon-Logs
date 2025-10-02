import { AlertTriangle, Filter } from "lucide-react";
import { SectionCard } from "~shared/ui";
import { formatRelativeMinutes } from "~shared/lib/date";
import { useIncidents } from "~entities/incident";

const severityTone = {
  high: "border-red-500/40 bg-red-500/15 text-red-300",
  medium: "border-amber-500/40 bg-amber-500/15 text-amber-200",
  low: "border-sky-500/40 bg-sky-500/15 text-sky-200"
};

const statusCopy = {
  open: "Открыт",
  investigating: "Исследуется",
  suppressed: "Подавлен"
};

export const IncidentsPage = () => {
  const { data: incidents, isLoading } = useIncidents();
  const list = incidents ?? [];

  return (
    <div className="flex h-full flex-col gap-8 py-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold">Инциденты</h2>
        <p className="text-white/60">
          Лента правил и алертов, объединённая с оперативными пометками. Фильтрация пока в разработке.
        </p>
      </div>

      <SectionCard icon={<AlertTriangle className="h-6 w-6" />} title="Активные правила">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-20 animate-pulse rounded-2xl border border-interactive/40 bg-surface/50"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-2xl border border-interactive/40 bg-surface/70 p-3 text-sm text-white/60">
              <Filter className="h-4 w-4 text-accent" />
              Возможность фильтровать по окружению и правилу появится позже.
            </div>
            {list.map((incident) => (
              <div
                key={incident.id}
                className="rounded-2xl border border-interactive/40 bg-surface/70 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          severityTone[incident.severity]
                        }`}
                      >
                        {incident.severity === "high"
                          ? "Высокая"
                          : incident.severity === "medium"
                          ? "Средняя"
                          : "Низкая"}
                      </span>
                      <span className="rounded-full border border-interactive/40 bg-surface/60 px-3 py-1 text-xs text-white/60">
                        {incident.rule}
                      </span>
                      <span className="rounded-full border border-interactive/40 bg-surface/60 px-3 py-1 text-xs text-white/60">
                        {statusCopy[incident.status] ?? incident.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{incident.title}</h3>
                    <p className="text-sm text-white/50">
                      {incident.acknowledgedBy ? `Отмечено: ${incident.acknowledgedBy}` : "Ожидает подтверждения"}
                    </p>
                  </div>
                  <div className="text-sm text-white/50">
                    Возник {formatRelativeMinutes(incident.startedAt)}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
                      {incident.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-interactive/40 bg-surface/80 px-3 py-1"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {list.length === 0 && (
              <div className="rounded-2xl border border-interactive/40 bg-surface/70 p-6 text-center text-white/60">
                Активных инцидентов нет. Система работает штатно.
              </div>
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
};
