export default function SalesPerformanceChart() {
  const bars = [25, 50, 33, 75, 80, 100];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-slate-900">Sales Performance</h3>
        <button className="text-primary text-sm font-bold">
          View Full Report
        </button>
      </div>
      <div className="h-48 w-full bg-slate-50 rounded-lg flex items-end justify-between px-8 py-4">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-12 rounded-t bg-primary transition-all"
            style={{ height: `${h}%`, opacity: 0.2 + i * 0.15 }}
          ></div>
        ))}
      </div>
    </div>
  );
}
