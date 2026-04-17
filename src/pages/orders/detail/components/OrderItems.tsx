import type { Order } from "../../../../api/orders";

interface OrderItemsProps {
  order: Order;
}

export default function OrderItems({ order }: OrderItemsProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">Order Items</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                Size/Color
              </th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">
                Quantity
              </th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">
                Price
              </th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900">
                    {item.product?.name}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                    {item.variant?.size || "N/A"} /{" "}
                    {item.variant?.colorName || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  x{item.quantity}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 text-right">
                  ৳{parseFloat(item.priceAtBuy).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                  ৳
                  {(
                    parseFloat(item.priceAtBuy) * item.quantity
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t border-slate-200">
            <tr>
              <td
                colSpan={4}
                className="px-6 py-4 text-sm font-bold text-slate-500 text-right uppercase"
              >
                Subtotal
              </td>
              <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                ৳{parseFloat(order.totalAmount).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td
                colSpan={4}
                className="px-6 py-3 text-sm font-bold text-slate-500 text-right uppercase"
              >
                Grand Total
              </td>
              <td className="px-6 py-3 text-lg font-bold text-primary text-right">
                ৳{parseFloat(order.totalAmount).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
