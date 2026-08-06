import type { Order } from "../../../../api/orders";

interface LogisticsDetailsProps {
  order: Order;
}

const money = (value?: string | null) =>
  value === undefined || value === null
    ? null
    : `৳${parseFloat(value).toLocaleString()}`;

export default function LogisticsDetails({ order }: LogisticsDetailsProps) {
  // Everything here is mirrored from RoadRush order_details, so there is
  // nothing to show until the order has been synced at least once.
  if (!order.lastLogisticsSync) return null;

  const rows: Array<{ label: string; value: string | null }> = [
    { label: "Cash to Collect", value: money(order.cashCollectAmount) },
    { label: "Delivery Fee", value: money(order.deliveryFee) },
    { label: "COD Charge", value: money(order.codCharge) },
    { label: "VAT", value: money(order.vat) },
    { label: "Tax", value: money(order.tax) },
    {
      label: "Distance",
      value: order.distanceKm ? `${parseFloat(order.distanceKm)} km` : null,
    },
    { label: "Priority", value: order.deliveryPriority || null },
    { label: "Requested Delivery", value: order.requestDeliveryDate || null },
  ].filter((row) => row.value !== null);

  if (!rows.length && !order.otp) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900">Logistics &amp; COD</h3>
        {order.cod && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wider">
            Cash on Delivery
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
        {rows.map((row) => (
          <div key={row.label}>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              {row.label}
            </p>
            <p className="text-sm font-bold text-slate-900">{row.value}</p>
          </div>
        ))}
      </div>

      {order.otp && (
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Delivery OTP
          </p>
          <span className="px-2.5 py-1 rounded-md text-sm font-extrabold tracking-[0.2em] bg-slate-900 text-white">
            {order.otp}
          </span>
        </div>
      )}

      {order.cod && (
        <p className="text-xs text-slate-400 mt-4">
          RoadRush reports the amount due, not whether it was collected — confirm
          the payment manually once the cash is settled.
        </p>
      )}
    </div>
  );
}
