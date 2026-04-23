const cards = [
  {
    title: "Total Revenue",
    value: "৳128,430.00",
    icon: "payments",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    trend: "+12.5%",
    up: true,
  },
  {
    title: "Active Users",
    value: "45,200",
    icon: "group",
    iconBg: "bg-[#1325ec]/10",
    iconColor: "text-[#1325ec]",
    trend: "+5.2%",
    up: true,
  },
  {
    title: "Conv. Rate",
    value: "3.24%",
    icon: "shopping_cart",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    trend: "-0.8%",
    up: false,
  },
  {
    title: "Avg. Order Value",
    value: "৳84.50",
    icon: "trending_up",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    trend: "+2.1%",
    up: true,
  },
];

export default function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white p-6 rounded-xl border border-slate-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`size-10 rounded-lg ${card.iconBg} flex items-center justify-center ${card.iconColor}`}
            >
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <span
              className={`text-sm font-bold flex items-center ${card.up ? "text-emerald-600" : "text-red-600"}`}
            >
              <span className="material-symbols-outlined text-xs">
                {card.up ? "arrow_upward" : "arrow_downward"}
              </span>
              {card.trend}
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">{card.title}</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-900">
            {card.value}
          </h3>
        </div>
      ))}
    </div>
  );
}
