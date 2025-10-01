import { Info } from "lucide-react";
import { SectionCard } from "~shared/ui";

export const SettingsPage = () => {
  return (
    <div className="flex h-full flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold">Настройки</h2>
        <p className="text-white/60">Сведения о панели и конфигурации.</p>
      </div>

      <SectionCard icon={<Info className="h-6 w-6" />} title="О DashBoard">
        <div className="space-y-3 text-white/70">
          <p>
            Daysi Command — одностраничная панель оператора, построенная на React 18 + Vite + Tailwind/DaisyUI.
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>FSD структура: app, pages, widgets, entities, shared</li>
            <li>TanStack Query для управления данными</li>
            <li>Палитра и паттерны DaisyUI + кастомные цвета</li>
          </ul>
        </div>
      </SectionCard>
    </div>
  );
};
