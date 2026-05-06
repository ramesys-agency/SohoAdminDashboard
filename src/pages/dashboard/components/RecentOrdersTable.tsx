import { useNavigate } from "react-router-dom";
import StatusBadge from "../../../components/ui/StatusBadge";

interface RecentOrdersTableProps {
  orders?: {
    id: string;
    customer: string;
    amount: number;
    status: string;
    date: string;
  }[];
}

export default function RecentOrdersTable({
  orders = [],
}: RecentOrdersTableProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
        <button
          onClick={() => navigate("/orders")}
          className="text-primary text-sm font-bold hover:underline"
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
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-400 italic"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-bold text-primary hover:underline">
                    #{order.id.split("-")[0].toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                        {getInitials(order.customer)}
                      </div>
                      <span className="text-slate-900">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    ৳{order.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
