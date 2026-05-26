interface OrderFiltersProps {
  paymentFilter: string;
  setPaymentFilter: (val: string) => void;
  fulfillmentFilter: string;
  setFulfillmentFilter: (val: string) => void;
  clearFilters: () => void;
}

export default function OrderFilters({
  paymentFilter,
  setPaymentFilter,
  fulfillmentFilter,
  setFulfillmentFilter,
  clearFilters,
}: OrderFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div className="flex-1 flex flex-wrap items-center gap-3">
        {/* Payment Filter dropdown */}
        <div className="relative min-w-[160px]">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none text-slate-700 font-semibold cursor-pointer"
          >
            {["Payment: All", "Paid", "Pending", "Refunded"].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            expand_more
          </span>
        </div>

        {/* Fulfillment Filter dropdown */}
        <div className="relative min-w-[160px]">
          <select
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value)}
            className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none text-slate-700 font-semibold cursor-pointer"
          >
            {["Fulfillment: All", "Fulfilled", "Unfulfilled", "Processing"].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="text-primary text-sm font-bold hover:underline transition-all"
      >
        Clear Filters
      </button>
    </div>
  );
}
