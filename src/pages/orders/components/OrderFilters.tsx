export default function OrderFilters() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center gap-4 shadow-sm">
      <div className="flex-1 flex flex-wrap items-center gap-3">
        {[
          {
            label: "Payment: All",
            options: ["Payment: All", "Paid", "Pending", "Refunded"],
          },
          {
            label: "Fulfillment: All",
            options: [
              "Fulfillment: All",
              "Fulfilled",
              "Unfulfilled",
              "Processing",
            ],
          },
        ].map((filter) => (
          <div key={filter.label} className="relative min-w-[160px]">
            <select className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none text-slate-700">
              {filter.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              expand_more
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
          <span className="material-symbols-outlined text-slate-400 text-lg">
            calendar_today
          </span>
          <span>Oct 1 – Oct 31, 2023</span>
        </div>
      </div>
      <button className="text-[#1325ec] text-sm font-bold hover:underline">
        Clear Filters
      </button>
    </div>
  );
}
