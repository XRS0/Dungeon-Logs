import { useEffect, useMemo, useState } from "react";
import { Compass, ListTree, TerminalSquare } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SectionCard } from "~shared/ui";
import { formatRelativeMinutes, formatTime } from "~shared/lib/date";
import { useRunDetails, useRunLogs, useRunSessions, useRunTimeline } from "~entities/run";

const tabConfig = [
  { id: "timeline", label: "Гант / Трейс", icon: <ListTree className="h-4 w-4" /> },
  { id: "logs", label: "Логи", icon: <TerminalSquare className="h-4 w-4" /> }
];

const statusBadge = {
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  running: "bg-sky-500/15 text-sky-200 border-sky-400/30",
  failed: "bg-red-500/15 text-red-300 border-red-400/30"
};

export const ExplorerPage = () => {
  const { runId } = useParams();
  const navigate = useNavigate();
  const { data: sessions } = useRunSessions();
  const [activeTab, setActiveTab] = useState("timeline");

  const resolvedRunId = runId ?? sessions?.[0]?.id ?? null;

  useEffect(() => {
    if (!runId && sessions?.length) {
      navigate(`/explorer/${sessions[0].id}`, { replace: true });
    }
  }, [runId, sessions, navigate]);

  useEffect(() => {
    setActiveTab("timeline");
  }, [resolvedRunId]);

  const { data: run, isLoading: runLoading } = useRunDetails(resolvedRunId);
  const { data: timeline = [], isLoading: timelineLoading } = useRunTimeline(resolvedRunId);
  const { data: logs = [], isLoading: logsLoading } = useRunLogs(resolvedRunId);

  if (!resolvedRunId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center">
        <Compass className="h-12 w-12 text-accent" />
        <p className="text-lg">Нет запусков для анализа. Перейдите на страницу «Запуски» и выберите plan/apply сеанс.</p>
        <Link
          to="/launches"
          className="btn rounded-full border border-accent/60 bg-accent/15 text-accent hover:bg-accent/25"
        >
          Открыть запуски
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-8 py-8">
      <SectionCard title={"Исследователь"}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            {run && (
              <div className="text-[#767676]">
                Запущено {formatRelativeMinutes(run.startedAt)} · длительность {run.durationMinutes} мин · куратор {run.owner}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide">
            {run && (
              <>
                <span className="bg-success text-success-content py-2 px-4 rounded-xl">
                  +{run.changes.add} добавления
                </span>
                <span className="bg-warning text-warning-content py-2 px-4 rounded-xl">
                  ±{run.changes.change} изменения
                </span>
                <span className="bg-error text-error-content py-2 px-4 rounded-xl">
                  -{run.changes.destroy} удаления
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-sm rounded-full border px-4 ${
                  activeTab === tab.id
                    ? "btn-accent"
                    : "btn-ghost text-accent"
                }`}
              >
                <span className="flex items-center gap-2">
                  {tab.icon}
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          <div>
            {activeTab === "timeline" && (
              <div className="space-y-4">
                {timelineLoading && <div className="h-24 animate-pulse rounded-xl bg-surfaceMuted/60" />}
                {!timelineLoading && timeline.length === 0 && (
                  <p className="text-sm text-[#767676]">Нет этапов — проверьте логи ниже.</p>
                )}
                {!timelineLoading &&
                  timeline.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-2 rounded-xl bg-primary p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-lg font-semibold text-primary-content">{item.label}</p>
                        <p className="text-sm text-[#767676]">{item.details}</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#767676]">
                        <span className="rounded-full border border-interactive/40 bg-surface/70 px-3 py-1">
                          {item.durationMinutes} мин
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs uppercase ${
                            item.status === "done"
                              ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
                              : item.status === "in-progress"
                              ? "border-sky-400/40 bg-sky-500/15 text-sky-200"
                              : "border-red-400/40 bg-red-500/15 text-red-300"
                          }`}
                        >
                          {item.status === "done"
                            ? "выполнено"
                            : item.status === "in-progress"
                            ? "в процессе"
                            : "ошибка"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {activeTab === "logs" && (
              <div className="space-y-4">
                {logsLoading && <div className="h-24 animate-pulse rounded-xl bg-surfaceMuted/60" />}
                {!logsLoading && (
                  <div className="overflow-auto rounded-xl border border-interactive/40 bg-black/70 p-4 font-mono text-sm text-white/80">
                    {logs.length === 0 ? (
                      <p>Логи для этого запуска пока не получены.</p>
                    ) : (
                      <pre className="whitespace-pre-wrap">{logs.map((line, idx) => `$ ${line}`).join("\n")}</pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {run && (
            <p className="text-right text-xs text-white/40">
              Последнее обновление: {formatTime(run.startedAt)}
            </p>
          )}
        </div>
      </SectionCard>
    </div>
  );
};
