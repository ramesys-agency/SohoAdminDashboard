const items = [
  {
    name: "UltraBoost Runners",
    category: "Footwear",
    left: 2,
    pct: 20,
    color: "bg-rose-500",
  },
  {
    name: "Minimalist White Watch",
    category: "Accessories",
    left: 5,
    pct: 45,
    color: "bg-amber-500",
  },
  {
    name: "Wireless Noise-Canceling Headphones",
    category: "Electronics",
    left: 3,
    pct: 30,
    color: "bg-rose-500",
  },
];

export default function LowStockList() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">Low Stock</h3>
        <button className="text-[#1325ec] text-sm font-bold hover:underline">
          Restock
        </button>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div
            key={item.name}
            className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="size-12 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-400">
                inventory_2
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-slate-900">
                {item.name}
              </p>
              <p className="text-[11px] text-slate-500">
                Category: {item.category}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-xs font-bold ${item.pct <= 30 ? "text-rose-500" : "text-amber-500"}`}
              >
                {item.left} Left
              </p>
              <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                <div
                  className={`${item.color} h-full rounded-full`}
                  style={{ width: `${item.pct}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
