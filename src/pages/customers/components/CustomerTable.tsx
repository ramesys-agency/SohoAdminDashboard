import { useState } from "react";
import StatusBadge from "../../../components/ui/StatusBadge";
import Pagination from "../../../components/ui/Pagination";

const customers = [
  {
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    status: "VIP",
    orders: "42 Orders",
    spent: "$12,450.00",
  },
  {
    name: "David Chen",
    email: "d.chen@gmail.com",
    status: "Regular",
    orders: "15 Orders",
    spent: "$3,120.50",
  },
  {
    name: "Elena Rodriguez",
    email: "elena.rod@outlook.com",
    status: "New Lead",
    orders: "1 Order",
    spent: "$125.00",
  },
  {
    name: "Marcus Thompson",
    email: "m.thompson@company.com",
    status: "VIP",
    orders: "84 Orders",
    spent: "$24,890.75",
  },
  {
    name: "Sophie Waller",
    email: "swaller@web.de",
    status: "Churn Risk",
    orders: "12 Orders",
    spent: "$2,410.00",
  },
];

const filterTabs = ["All Customers", "VIP Segment", "New Leads", "Churn Risk"];

export default function CustomerTable() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {filterTabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(i)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                activeFilter === i
                  ? "bg-[#1325ec] text-white"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
          <button className="px-2 py-2 rounded-lg text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, email or ID..."
            className="bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm w-full md:w-72 focus:ring-2 focus:ring-[#1325ec]/20 focus:border-[#1325ec] outline-none"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total Orders</th>
              <th className="px-6 py-4 text-right">Total Spent</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.email} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-[#1325ec]/10 flex items-center justify-center text-[#1325ec] font-bold text-sm">
                      {c.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">
                        {c.name}
                      </p>
                      <p className="text-xs text-slate-500">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                  {c.orders}
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">
                  {c.spent}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-[#1325ec]">
                      <span className="material-symbols-outlined text-xl">
                        visibility
                      </span>
                    </button>
                    <button className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-slate-600">
                      <span className="material-symbols-outlined text-xl">
                        more_vert
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={1248}
        onPageChange={setPage}
        showingText="Showing 1-10 of 12,482 customers"
      />
    </div>
  );
}
