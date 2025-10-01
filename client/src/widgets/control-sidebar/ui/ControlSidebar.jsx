import { Activity, AlertTriangle, Compass, Rocket, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  { icon: Activity, label: "Обзор", description: "Сводка событий", to: "/dashboard" },
  { icon: Rocket, label: "Запуски", description: "Plan/apply сеансы", to: "/launches" },
  { icon: Compass, label: "Исследователь", description: "Гант / Логи", to: "/explorer" },
  { icon: AlertTriangle, label: "Инциденты", description: "Ошибки и алерты", to: "/incidents" },
  { icon: Settings, label: "Настройки", description: "Сведения", to: "/settings" }
];

export const ControlSidebar = () => {
  return (
    <aside className="hidden sticky top-0 h-screen w-[320px] flex-col justify-between border-r border-surfaceMuted/40 bg-surface/80 px-6 py-8 shadow-inset backdrop-blur lg:flex">
      <div className="space-y-10">
        <header className="space-y-4">
          <p className="rounded-full border border-accent/40 px-3 py-1 text-sm font-medium uppercase tracking-wide text-accent/90">
            Support Ops
          </p>
          <div>
            <h1 className="text-3xl font-semibold leading-tight">Daysi Command</h1>
            <p className="mt-2 max-w-[220px] text-sm text-white/60">
              Единая панель контроля для техподдержки и аналитики инцидентов.
            </p>
          </div>
        </header>

        <nav className="space-y-3">
          {navigationItems.map(({ icon: Icon, label, description, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `group block rounded-2xl border px-4 py-4 transition-all duration-200 ${
                  isActive
                    ? "border-accent/70 bg-interactive/80 shadow-glow"
                    : "border-transparent bg-surface/60 hover:border-interactive/50 hover:bg-surfaceMuted/60"
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                      isActive ? "border-accent/60 bg-accent/15" : "border-surfaceMuted/60 bg-surface/80"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        isActive ? "text-accent" : "text-white/50 group-hover:text-accent"
                      }`}
                    />
                  </span>
                  <span className="space-y-1">
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      {label}
                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-accent shadow-glow" aria-hidden="true" />
                      )}
                    </span>
                    <span className="text-sm text-white/50">{description}</span>
                  </span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <footer className="rounded-2xl border border-interactive/40 bg-surface/60 p-4">
        <div className="rounded-xl border border-accent/50 bg-accent/10 px-3 py-2 text-sm text-accent">
          Тут обязательно будет какая-то полезная информация 
        </div>
      </footer>
    </aside>
  );
};
