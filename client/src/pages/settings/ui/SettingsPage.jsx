import { SectionCard } from "~shared/ui";

export const SettingsPage = () => {
  return (
    <div className="flex h-full flex-col gap-8 py-8">
      <SectionCard title="О Dungeon Logs">
        <div className="space-y-3 text-[#767676]">
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
