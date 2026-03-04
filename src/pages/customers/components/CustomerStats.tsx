const stats = [
  {
    icon: "groups",
    bg: "bg-blue-100",
    color: "text-blue-600",
    label: "Total Customers",
    value: "12,482",
  },
  {
    icon: "trending_up",
    bg: "bg-emerald-100",
    color: "text-emerald-600",
    label: "Active This Month",
    value: "2,109",
  },
  {
    icon: "payments",
    bg: "bg-amber-100",
    color: "text-amber-600",
    label: "Total Revenue",
    value: "$1.2M",
  },
];

export default function CustomerStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4"
        >
          <div
            className={`size-12 rounded-full ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0`}
          >
            <span className="material-symbols-outlined">{s.icon}</span>
          </div>
          <div>
            <p className="text-slate-500 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
