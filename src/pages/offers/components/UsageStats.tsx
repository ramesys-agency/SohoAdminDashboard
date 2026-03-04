const stats = [
  {
    icon: "trending_up",
    label: "Total Revenue from Coupons",
    value: "$12,450.00",
    trend: "+12.5%",
    trendUp: true,
  },
  {
    icon: "confirmation_number",
    label: "Total Redeemed Coupons",
    value: "1,248",
    trend: "+8.2%",
    trendUp: true,
  },
  {
    icon: "percent",
    label: "Average Discount Rate",
    value: "18.4%",
    trend: "0.0%",
    trendUp: false,
  },
];

export default function UsageStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-lg bg-[#1325ec]/10 p-2 text-[#1325ec]">
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <span
              className={`text-xs font-bold ${s.trendUp ? "text-emerald-500" : "text-slate-400"}`}
            >
              {s.trendUp ? "+" : ""}
              {s.trend}
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900">{s.value}</p>
          <p className="text-sm font-medium text-slate-500">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
