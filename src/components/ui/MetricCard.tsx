interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  trend?: "up" | "down";
  trendValue?: string;
  sparklinePath?: string;
  sparklineColor?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
  trend,
  trendValue,
  sparklinePath,
  sparklineColor = "#1325ec",
}: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900">{value}</h3>
        </div>
        <div className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      {trend && trendValue && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={`text-xs font-bold flex items-center gap-0.5 ${
              trend === "up" ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {trend === "up" ? "trending_up" : "trending_down"}
            </span>
            {trendValue}
          </span>
          <span className="text-slate-400 text-[11px]">vs last month</span>
        </div>
      )}
      {sparklinePath && (
        <div className="mt-4 h-12 w-full">
          <svg className="w-full h-full" viewBox="0 0 100 30">
            <path
              d={sparklinePath}
              fill="none"
              stroke={sparklineColor}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
