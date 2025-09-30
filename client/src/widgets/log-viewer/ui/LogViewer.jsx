import { AlertTriangle, Bug, Info } from "lucide-react";

import { SectionCard } from "~shared/ui";
import { formatTime } from "~shared/lib/date";
import { useRecentLogs } from "~entities/log";

const levelIconMap = {
  error: <Bug className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />
};

const levelToneMap = {
  error: "border-red-400/70 bg-red-500/10 text-red-300",
  warning: "border-amber-400/70 bg-amber-500/10 text-amber-300",
  info: "border-sky-400/70 bg-sky-500/10 text-sky-200"
};

export const LogViewer = () => {
  const { data, isLoading, refetch } = useRecentLogs();
  const logs = data ?? [];

  return (
    <SectionCard
      title="Лента событий"
      subtitle="Сгруппированные логи и ключевые обращения"
      accent
      icon={<Bug className="h-6 w-6" />}
      actions={
        <button
          onClick={refetch}
          className="btn btn-sm rounded-full border border-accent/60 bg-accent/15 text-accent hover:bg-accent/25"
        >
          Обновить
        </button>
      }
      className="min-h-[520px]"
    >
      <div className="space-y-4">
        {isLoading && (
          <div className="h-24 animate-pulse rounded-2xl border border-interactive/40 bg-surface/50" />
        )}
        {!isLoading && logs.length > 0 && (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li
                key={log.id}
                className="rounded-2xl border border-interactive/40 bg-surface/70 p-4 shadow-inner"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border ${levelToneMap[log.level]}`}
                    >
                      {levelIconMap[log.level]}
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-white">{log.message}</p>
                      <p className="mt-1 text-sm text-white/50">{log.source}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-white/40">
                    <p>{formatTime(log.timestamp)}</p>
                    {log.meta && <p className="mt-1 text-white/50">{log.meta}</p>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {!isLoading && logs.length === 0 && (
          <div className="rounded-2xl border border-interactive/40 bg-surface/70 p-12 text-center text-white/50">
            Новых логов пока нет — вы на гребне волны 🌊
          </div>
        )}
      </div>
    </SectionCard>
  );
};
