import { LogViewer } from "~widgets/log-viewer";
import { SystemStatus } from "~widgets/system-status";
import { SystemSummary } from "~widgets/system-summary";

export const DashboardPage = () => {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-accent/80">Текущий сеанс</p>
        <h2 className="text-4xl font-semibold leading-tight text-white">
          Статус инфраструктуры <span className="text-accent">Daysi</span>
        </h2>
        <p className="text-base text-white/60">
          Сводка логов, здоровья систем и рекомендаций для оперативной команды.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
        <LogViewer />
        <div className="flex flex-col gap-8">
          <SystemStatus />
          <SystemSummary />
        </div>
      </div>
    </div>
  );
};
