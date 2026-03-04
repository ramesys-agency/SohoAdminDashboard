import StatusBadge from "../../../../components/ui/StatusBadge";

export default function OrderSummary() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-black text-slate-900">#ORD-8821</h2>
            <StatusBadge status="Paid" />
            <StatusBadge status="Fulfilled" />
          </div>
          <p className="text-sm text-slate-500">
            Placed on October 24, 2023 at 10:30 AM
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
            <span className="material-symbols-outlined text-sm">print</span>
            Print
          </button>
          <button className="flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
            <span className="material-symbols-outlined text-sm">download</span>
            Invoice
          </button>
          <button className="px-4 py-2 bg-[#1325ec] text-white rounded-lg text-sm font-bold hover:opacity-90">
            Fulfill Order
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Order Total",
            value: "$1,148.00",
            icon: "payments",
            color: "text-[#1325ec] bg-[#1325ec]/10",
          },
          {
            label: "Items",
            value: "2 Products",
            icon: "inventory_2",
            color: "text-orange-600 bg-orange-100",
          },
          {
            label: "Payment",
            value: "Credit Card",
            icon: "credit_card",
            color: "text-emerald-600 bg-emerald-100",
          },
          {
            label: "Delivery",
            value: "Standard",
            icon: "local_shipping",
            color: "text-blue-600 bg-blue-100",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
          >
            <div
              className={`size-9 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}
            >
              <span className="material-symbols-outlined text-lg">
                {s.icon}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-sm font-bold text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
