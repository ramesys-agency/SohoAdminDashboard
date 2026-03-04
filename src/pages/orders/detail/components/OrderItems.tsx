import StatusBadge from "../../../../components/ui/StatusBadge";

const items = [
  {
    name: "NeoPhone 15 Pro",
    sku: "PH-1029-NP",
    qty: 1,
    price: "$999.00",
    total: "$999.00",
  },
  {
    name: "Aura Wireless Buds",
    sku: "AU-5541-W",
    qty: 2,
    price: "$74.50",
    total: "$149.00",
  },
];

export default function OrderItems() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-900">Order Items</h3>
        <span className="text-sm text-slate-500">{items.length} items</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-center">Qty</th>
              <th className="px-6 py-3 text-right">Price</th>
              <th className="px-6 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.sku}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400">
                        inventory_2
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-sm font-medium">
                  {item.qty}
                </td>
                <td className="px-6 py-4 text-right text-sm">{item.price}</td>
                <td className="px-6 py-4 text-right text-sm font-bold">
                  {item.total}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-slate-200 bg-slate-50">
            <tr>
              <td
                colSpan={3}
                className="px-6 py-3 text-sm font-semibold text-slate-600 text-right"
              >
                Subtotal
              </td>
              <td className="px-6 py-3 text-sm font-bold text-right">
                $1,148.00
              </td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="px-6 py-3 text-sm font-semibold text-slate-600 text-right"
              >
                Shipping
              </td>
              <td className="px-6 py-3 text-sm font-bold text-right text-emerald-600">
                Free
              </td>
            </tr>
            <tr>
              <td
                colSpan={3}
                className="px-6 py-3 text-base font-bold text-slate-900 text-right"
              >
                Total
              </td>
              <td className="px-6 py-3 text-base font-black text-[#1325ec] text-right">
                $1,148.00
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="p-6 border-t border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Fulfillment:</span>
          <StatusBadge status="Fulfilled" />
        </div>
        <button className="flex items-center gap-1 text-[#1325ec] text-sm font-bold hover:underline">
          <span className="material-symbols-outlined text-sm">
            local_shipping
          </span>
          Mark as Shipped
        </button>
      </div>
    </section>
  );
}
