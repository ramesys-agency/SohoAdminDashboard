import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../../components/ui/StatusBadge";
import Pagination from "../../../components/ui/Pagination";

const orders = [
  {
    id: "#ORD-8821",
    initials: "JD",
    customer: "Jane Doe",
    email: "jane.doe@email.com",
    date: "Oct 24, 2023",
    total: "$249.00",
    payment: "Paid",
    fulfillment: "Fulfilled",
  },
  {
    id: "#ORD-8820",
    initials: "MS",
    customer: "Mark Smith",
    email: "m.smith@web.com",
    date: "Oct 23, 2023",
    total: "$1,020.50",
    payment: "Pending",
    fulfillment: "Unfulfilled",
  },
  {
    id: "#ORD-8819",
    initials: "KL",
    customer: "Karen Lee",
    email: "klee88@gmail.com",
    date: "Oct 22, 2023",
    total: "$89.00",
    payment: "Paid",
    fulfillment: "Fulfilled",
  },
  {
    id: "#ORD-8818",
    initials: "TW",
    customer: "Tom Wright",
    email: "tom.w@outlook.com",
    date: "Oct 21, 2023",
    total: "$156.40",
    payment: "Failed",
    fulfillment: "Unfulfilled",
  },
  {
    id: "#ORD-8817",
    initials: "AJ",
    customer: "Alice Johnson",
    email: "alice.j@corp.com",
    date: "Oct 20, 2023",
    total: "$542.00",
    payment: "Paid",
    fulfillment: "Processing",
  },
];

const headers = [
  "Order ID",
  "Customer",
  "Date",
  "Total",
  "Payment",
  "Fulfillment",
  "Actions",
];

export default function OrdersTable() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {headers.map((h) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => navigate(`/orders/${order.id.replace("#", "")}`)}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-[#1325ec] hover:underline">
                    {order.id}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {order.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {order.customer}
                      </p>
                      <p className="text-xs text-slate-500">{order.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                  {order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={order.payment} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={order.fulfillment} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/orders/${order.id.replace("#", "")}`);
                    }}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-slate-500">
                      open_in_new
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={16}
        onPageChange={setPage}
        showingText="Showing 1 to 10 of 156 results"
      />
    </div>
  );
}
