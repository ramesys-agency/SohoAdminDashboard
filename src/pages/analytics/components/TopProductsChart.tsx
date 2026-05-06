const products = [
  { name: "iPhone 15 Pro Max", value: "৳42,300.00", pct: 85 },
  { name: "MacBook Air M3", value: "৳31,100.00", pct: 65 },
  { name: "Sony WH-1000XM5", value: "৳18,400.00", pct: 40 },
  { name: "Apple Watch Ultra", value: "৳12,900.00", pct: 25 },
];

export default function TopProductsChart() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-slate-900">Top Products</h3>
        <button className="text-primary text-sm font-bold">View All</button>
      </div>
      <div className="space-y-6">
        {products.map((p) => (
          <div key={p.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-900">{p.name}</span>
              <span className="text-slate-500">{p.value}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${p.pct}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
