import { useNavigate } from "react-router-dom";
import StatusBadge from "../../../components/ui/StatusBadge";

const orders = [
  {
    id: "#ORD-9421",
    customer: "Sarah Johnson",
    initials: "SJ",
    status: "Delivered",
    amount: "$245.99",
    date: "2 mins ago",
  },
  {
    id: "#ORD-9420",
    customer: "Michael Chen",
    initials: "MC",
    status: "Pending",
    amount: "$1,204.00",
    date: "15 mins ago",
  },
  {
    id: "#ORD-9419",
    customer: "Emma Wilson",
    initials: "EW",
    status: "Processing",
    amount: "$89.50",
    date: "1 hour ago",
  },
];

export default function RecentOrdersTable() {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
        <button
          onClick={() => navigate("/orders")}
          className="text-[#1325ec] text-sm font-bold hover:underline"
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => navigate("/orders/ORD-9421")}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 font-bold text-[#1325ec] hover:underline">
                  {order.id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-[#1325ec]/10 flex items-center justify-center text-[#1325ec] text-[10px] font-bold">
                      {order.initials}
                    </div>
                    <span className="text-slate-900">{order.customer}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {order.amount}
                </td>
                <td className="px-6 py-4 text-right text-slate-500">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
