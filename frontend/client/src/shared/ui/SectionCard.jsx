export const SectionCard = ({
  title,
  subtitle,
  icon,
  actions,
  accent = false,
  className = "",
  children
}) => {
  return (
    <section
      className={`relative overflow-hidden rounded-3xl border px-6 py-6 shadow-lg transition-colors ${
        accent
          ? "border-accent/60 bg-surface/80 shadow-glow"
          : "border-surfaceMuted/40 bg-surface/60 hover:border-interactive/60"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex gap-4">
          {icon && (
            <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl border border-interactive/60 bg-surface/80 text-accent">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-semibold leading-tight text-white">{title}</h2>
            {subtitle && <p className="mt-1 text-base text-white/60">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3 text-sm text-white/60">{actions}</div>}
      </div>
      <div className="mt-6 text-base text-white/80">{children}</div>
    </section>
  );
};
