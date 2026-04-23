interface SalesChartProps {
  trend?: {
    month: string;
    amount: number;
  }[];
}

export default function SalesChart({ trend = [] }: SalesChartProps) {
  const maxAmount = Math.max(...trend.map((t) => t.amount), 1000);
  
  // Calculate SVG path
  const generatePath = () => {
    if (trend.length === 0) return "";
    const width = 1000;
    const height = 200;
    const step = width / (trend.length - 1 || 1);
    
    return trend.map((t, i) => {
      const x = i * step;
      const y = height - (t.amount / maxAmount) * height * 0.8 - 20;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  };

  const path = generatePath();

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Sales Overview</h3>
          <p className="text-sm text-slate-500">
            Revenue performance for the last 6 months
          </p>
        </div>
      </div>
      <div className="h-64 relative">
        <svg
          className="w-full h-full"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="dashGradient" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "rgba(19,37,236,0.2)" }} />
              <stop offset="100%" style={{ stopColor: "rgba(19,37,236,0)" }} />
            </linearGradient>
          </defs>
          <path
            d={`${path} V 200 H 0 Z`}
            fill="url(#dashGradient)"
          />
          <path
            d={path}
            fill="none"
            stroke="#1325ec"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[
            `৳${(maxAmount / 1000).toFixed(1)}k`,
            `৳${(maxAmount / 2000).toFixed(1)}k`,
            "৳0"
          ].map((label) => (
            <div
              key={label}
              className="flex justify-between px-2 text-[10px] text-slate-400 border-t border-slate-100 pt-1"
            >
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-4 px-2 text-[11px] font-medium text-slate-400">
        {trend.map((t) => (
          <span key={t.month}>{t.month}</span>
        ))}
        {trend.length === 0 && <span>No data available</span>}
      </div>
    </div>
  );
}
