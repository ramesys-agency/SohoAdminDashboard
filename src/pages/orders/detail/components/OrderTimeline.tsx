const events = [
  {
    status: "Order Delivered",
    time: "Oct 27, 2023 · 2:14 PM",
    icon: "check_circle",
    color: "text-emerald-600 bg-emerald-100",
    done: true,
  },
  {
    status: "Out for Delivery",
    time: "Oct 27, 2023 · 8:00 AM",
    icon: "local_shipping",
    color: "text-blue-600 bg-blue-100",
    done: true,
  },
  {
    status: "Shipped · TRK-99182",
    time: "Oct 25, 2023 · 11:30 AM",
    icon: "inventory_2",
    color: "text-[#1325ec] bg-[#1325ec]/10",
    done: true,
  },
  {
    status: "Payment Confirmed",
    time: "Oct 24, 2023 · 10:31 AM",
    icon: "payments",
    color: "text-emerald-600 bg-emerald-100",
    done: true,
  },
  {
    status: "Order Placed",
    time: "Oct 24, 2023 · 10:30 AM",
    icon: "shopping_bag",
    color: "text-slate-600 bg-slate-100",
    done: true,
  },
];

export default function OrderTimeline() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-bold text-slate-900 mb-6">Order Timeline</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-100"></div>
        <div className="space-y-6">
          {events.map((event, i) => (
            <div key={i} className="flex items-start gap-4 relative">
              <div
                className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${event.color}`}
              >
                <span className="material-symbols-outlined text-sm">
                  {event.icon}
                </span>
              </div>
              <div className="pt-1">
                <p className="text-sm font-bold text-slate-900">
                  {event.status}
                </p>
                <p className="text-xs text-slate-500">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 border-t border-slate-100 pt-4">
        <label className="text-sm font-semibold text-slate-700 block mb-2">
          Add note to order
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Internal note..."
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
          />
          <button className="px-3 py-2 bg-[#1325ec] text-white rounded-lg text-sm font-bold">
            Add
          </button>
        </div>
      </div>
    </section>
  );
}
