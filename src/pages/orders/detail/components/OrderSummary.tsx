import type { Order } from "../../../../api/orders";
import StatusBadge from "../../../../components/ui/StatusBadge";
import dayjs from "dayjs";

interface OrderSummaryProps {
  order: Order;
  onUpdateStatus: (status: string, note?: string) => void;
  onUpdatePayment: (status: string) => void;
}

export default function OrderSummary({
  order,
  onUpdateStatus,
  onUpdatePayment,
}: OrderSummaryProps) {
  const currentPayment = order.payments?.[0];
  const isCODPending = currentPayment?.status === "cod_pending" || order.cod;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-center md:text-left">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Placed On
            </p>
            <p className="text-sm font-bold text-slate-900">
              {dayjs(order.createdAt).format("MMM DD, YYYY - hh:mm A")}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Amount
            </p>
            <p className="text-sm font-bold text-slate-900 text-primary">
              ৳{parseFloat(order.totalAmount).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Order Status
            </p>
            <div className="flex items-center gap-2">
              <StatusBadge status={order.status} />
              <select
                className="text-xs border border-slate-200 rounded px-1 py-0.5 outline-none focus:border-primary"
                value={order.status}
                onChange={(e) => onUpdateStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>
            {order.logisticsStatusName && (
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                RoadRush: {order.logisticsStatusName}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Payment Status
            </p>
            <div className="flex items-center gap-2">
              <StatusBadge status={currentPayment?.status || "pending"} />
              <p className="text-xs text-slate-400">
                ({order.cod ? "COD" : "Online"})
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {isCODPending &&
            currentPayment?.status !== "success" &&
            currentPayment?.status !== "cod_collected" && (
              <>
                <button
                  onClick={() => onUpdatePayment("success")}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors"
                  title="Only use if cash has been collected"
                >
                  Confirm Payment
                </button>
                <button
                  onClick={() => onUpdatePayment("failed")}
                  className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors"
                >
                  Reject Payment
                </button>
              </>
            )}

          {!["delivered", "cancelled", "returned"].includes(order.status) && (
            <button
              onClick={() =>
                onUpdateStatus(
                  "delivered",
                  "Manually marked as delivered by admin",
                )
              }
              className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
            >
              Fulfill Order
            </button>
          )}

          {/* Refunds are normally recorded per return in the Returns panel, which
              flips this automatically once refunds cover the order total. This is
              the manual escape hatch for refunds settled outside that flow. */}
          {currentPayment && currentPayment.status !== "refunded" && (
            <button
              onClick={() => onUpdatePayment("refunded")}
              title="Marks the whole payment refunded, regardless of individual returns"
              className="px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 text-sm font-bold rounded-lg hover:bg-purple-100 transition-colors"
            >
              Mark Refunded
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
