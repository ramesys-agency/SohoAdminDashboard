import type { Order } from "../../../../api/orders";
import dayjs from "dayjs";

interface OrderSummaryProps {
  order: Order;
}

/**
 * Read-only facts about the order. Anything that changes the order lives in
 * OrderActions, so there is one place on the page that can act on it.
 */
export default function OrderSummary({ order }: OrderSummaryProps) {
  const units = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const payment = order.payments?.[0];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
      <div className="flex flex-wrap gap-x-10 gap-y-4">
        <Fact label="Placed On">
          {dayjs(order.createdAt).format("MMM DD, YYYY - hh:mm A")}
        </Fact>

        <Fact label="Items">
          {order.items.length} product{order.items.length === 1 ? "" : "s"} ·{" "}
          {units} unit{units === 1 ? "" : "s"}
        </Fact>

        <Fact label="Total Amount">
          <span className="text-primary">
            ৳{parseFloat(order.totalAmount).toLocaleString()}
          </span>
        </Fact>

        <Fact label="Payment Method">
          {order.cod ? "Cash on delivery" : "Online"}
          {payment?.provider ? ` · ${payment.provider}` : ""}
        </Fact>

        {order.logisticsStatusName && (
          <Fact label="RoadRush Status">{order.logisticsStatusName}</Fact>
        )}
      </div>
    </div>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-900">{children}</p>
    </div>
  );
}
