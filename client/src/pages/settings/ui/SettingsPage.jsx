import { Info, Palette } from "lucide-react";
import { SectionCard } from "~shared/ui";
import { useTheme } from "~app/providers/ThemeProvider";

export const SettingsPage = () => {
  const { mode, theme, setMode } = useTheme();

  const controls = [
    { value: "system", label: "Системная", hint: "Следовать настройкам ОС" },
    { value: "light", label: "Светлая", hint: "Тема daylight" },
    { value: "dark", label: "Тёмная", hint: "Тема daynight" }
  ];

  const activeLabel = controls.find((item) => item.value === mode)?.label ?? mode;

  return (
    <div className="flex h-full flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold">Настройки</h2>
        <p className="text-white/60">Управление темой оформления и сведениями о панели.</p>
      </div>

      <SectionCard icon={<Palette className="h-6 w-6" />} title="Тема оформления">
        <div className="space-y-3">
          <p className="text-sm text-white/60">Выберите режим подсветки интерфейса.</p>
          <div className="flex flex-wrap gap-2">
            {controls.map((item) => (
              <button
                key={item.value}
                onClick={() => setMode(item.value)}
                className={`btn btn-sm rounded-full border px-4 transition-colors ${
                  mode === item.value
                    ? "border-accent/70 bg-accent/20 text-accent"
                    : "border-interactive/50 bg-surface/70 text-white/70 hover:border-accent/40 hover:text-accent"
                }`}
                aria-pressed={mode === item.value}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="text-xs uppercase tracking-wide text-white/40">Активно: {activeLabel} · Тема: {theme}</p>
        </div>
      </SectionCard>

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
