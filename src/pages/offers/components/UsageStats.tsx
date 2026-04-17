import { useQuery } from "@tanstack/react-query";
import { getAllCoupons } from "../../../api/coupons";

export default function UsageStats() {
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: getAllCoupons,
  });

  const totalRedeemed = coupons.reduce(
    (acc, c) => acc + (c.usageCount || 0),
    0,
  );
  const avgDiscount = coupons.length
    ? coupons.reduce((acc, c) => acc + Number(c.value), 0) / coupons.length
    : 0;

  // Note: Total revenue would require fetching orders or having a specific stats endpoint
  // For now, we'll use a placeholder for revenue but dynamic values forothers

  const stats = [
    {
      icon: "trending_up",
      label: "Total Revenue Impact",
      value: "$12,450.00", // Placeholder until orders API is integrated for this
      trend: "+12.5%",
      trendUp: true,
    },
    {
      icon: "confirmation_number",
      label: "Total Redeemed Coupons",
      value: totalRedeemed.toLocaleString(),
      trend: "+8.2%",
      trendUp: true,
    },
    {
      icon: "percent",
      label: "Average Discount Value",
      value: `${avgDiscount.toFixed(1)}${coupons.some((c) => c.type === "percentage") ? "%" : ""}`,
      trend: "0.0%",
      trendUp: false,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-5 animate-pulse"
          >
            <div className="h-10 w-10 bg-slate-100 rounded-lg mb-4" />
            <div className="h-8 w-24 bg-slate-100 rounded mb-2" />
            <div className="h-4 w-32 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

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
