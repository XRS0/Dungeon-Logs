import { Rocket, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionCard } from "~shared/ui";
import { formatRelativeMinutes } from "~shared/lib/date";
import { useRunSessions } from "~entities/run";

const statusTone = {
  success: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  running: "bg-sky-500/15 text-sky-200 border-sky-400/30",
  failed: "bg-red-500/15 text-red-300 border-red-400/30"
};

const typeTone = {
  plan: "bg-surface/70 text-white/70 border-interactive/40",
  apply: "bg-accent/15 text-accent border-accent/40"
};

export const LaunchesPage = () => {
  const { data: sessions, isLoading } = useRunSessions();
  const runs = sessions ?? [];

  return (
    <div className="flex h-full flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold">Запуски Terraform</h2>
        <p className="text-white/60">
          Список последних сеансов <span className="text-accent">plan</span> / <span className="text-accent">apply</span>
          . Выберите запуск, чтобы открыть детальный просмотр в «Исследователь».
        </p>
      </div>

      <SectionCard icon={<Rocket className="h-6 w-6" />} title="Сеансы">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-24 animate-pulse rounded-2xl border border-interactive/40 bg-surface/50"
              />
            ))}
          </div>
        ) : (
          <ul className="space-y-4">
            {runs.map((run) => (
              <li
                key={run.id}
                className="rounded-2xl border border-interactive/40 bg-surface/70 p-5 transition-colors hover:border-accent/50"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          statusTone[run.status]
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                        {run.status === "success"
                          ? "Успех"
                          : run.status === "running"
                          ? "Выполняется"
                          : "Ошибка"}
                      </span>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          typeTone[run.type]
                        }`}
                      >
                        {run.type}
                      </span>
                      <span className="rounded-full border border-interactive/40 bg-surface/60 px-3 py-1 text-xs text-white/60">
                        {run.environment}
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{run.title}</h3>
                    <p className="text-sm text-white/50">
                      Запущено {formatRelativeMinutes(run.startedAt)} · Ответственный: {run.owner}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 text-sm text-white/50">
                    <div className="flex items-center gap-2 text-white/70">
                      <Timer className="h-4 w-4 text-accent" />
                      {run.durationMinutes} мин.
                    </div>
                    <div className="flex gap-3 text-xs uppercase tracking-wide">
                      <span className="rounded-md bg-emerald-500/15 px-2 py-1 text-emerald-300">
                        +{run.changes.add} добавл.
                      </span>
                      <span className="rounded-md bg-amber-500/15 px-2 py-1 text-amber-200">
                        ±{run.changes.change} изм.
                      </span>
                      <span className="rounded-md bg-red-500/15 px-2 py-1 text-red-300">
                        -{run.changes.destroy} удал.
                      </span>
                    </div>
                    <Link
                      to={`/explorer/${run.id}`}
                      className="btn btn-sm rounded-full border border-accent/60 bg-accent/15 text-accent hover:bg-accent/25"
                    >
                      Открыть в исследователе
                    </Link>
                  </div>
                </div>
              </li>
            ))}
            {runs.length === 0 && (
              <li className="rounded-2xl border border-interactive/40 bg-surface/70 p-6 text-center text-white/60">
                История запусков пуста. Запустите новый Terraform план и обновите страницу.
              </li>
            )}
          </ul>
        )}
      </SectionCard>
    </div>
  );
};
