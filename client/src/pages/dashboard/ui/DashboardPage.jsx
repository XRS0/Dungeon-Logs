import { SystemStatus } from "~widgets/system-status";
import { SystemSummary } from "~widgets/system-summary";
import { LogPreview } from "../../../widgets/log-viewer/ui/LogPreview";

export const DashboardPage = () => {
  return (
    <div className="space-y-8 py-8">
      <h2 className="text-[20px] font-semibold">Инфраструктура</h2>

      <div className="grid grid-cols-[4fr_3fr] gap-10">
        <LogPreview />
        <div className="space-y-8">
          <SystemStatus />
          <SystemSummary />
        </div>
      </div>
    </div>
  );
};
