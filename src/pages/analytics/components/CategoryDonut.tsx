import Button from "../../../components/ui/Button";

const segments = [
  {
    color: "bg-primary",
    stroke: "#1325ec]",
    dasharray: "60 100",
    dashoffset: "0",
    label: "Electronics",
    pct: "60%",
  },
  {
    color: "bg-blue-400",
    stroke: "#60a5fa",
    dasharray: "25 100",
    dashoffset: "-60",
    label: "Furniture",
    pct: "25%",
  },
  {
    color: "bg-amber-500",
    stroke: "#f59e0b",
    dasharray: "15 100",
    dashoffset: "-85",
    label: "Clothing",
    pct: "15%",
  },
];

export default function CategoryDonut() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-slate-900">
          Category Distribution
        </h3>
        <Button variant="ghost" size="icon">
          <span className="material-symbols-outlined text-slate-400">
            more_horiz
          </span>
        </Button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="relative size-48">
          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
            <circle
              className="stroke-slate-100"
              cx="18"
              cy="18"
              fill="none"
              r="16"
              strokeWidth="4"
            />
            {segments.map((s) => (
              <circle
                key={s.label}
                cx="18"
                cy="18"
                fill="none"
                r="16"
                stroke={s.stroke}
                strokeDasharray={s.dasharray}
                strokeDashoffset={s.dashoffset}
                strokeWidth="4"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900">1.2k</span>
            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">
              Total
            </span>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-3 text-sm">
          {segments.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <div className={`size-3 rounded-full ${s.color}`}></div>
              <span className="text-slate-600">{s.label}</span>
              <span className="font-bold ml-auto">{s.pct}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
