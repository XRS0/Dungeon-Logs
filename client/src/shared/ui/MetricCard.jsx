import { Equal, TrendingDown, TrendingUp } from "lucide-react";

const trendIconMap = {
  up: <TrendingUp />,
  down: <TrendingDown />,
  steady: <Equal />
};

const MetricCard = ({ label, delta, value}) => {
  return (
    <div
      className="rounded-2xl bg-base-100 p-4"
    >
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        {delta && (
          <span
            className={`flex items-center gap-1 text-xs font-medium ${
              delta.trend === "up"
                ? "text-accent"
                : delta.trend === "down"
                ? "text-orange-400"
                : "text-white/60"
            }`}
          >
            {trendIconMap[delta.trend]}
            
          </span>
        )}
      </div>

      <div className="flex justify-between items-end">
        <p className="mt-3 text-3xl font-semibol">{value}</p>
        <p className={`${
          delta.trend === "up"
            ? "text-accent"
            : delta.trend === "down"
            ? "text-orange-400"
            : "text-white/60"
        }`}>{delta.value}</p>
      </div>
    </div>
  );
}

export default MetricCard;