import { useState } from "react";
import StatusBadge from "../../../components/ui/StatusBadge";
import Pagination from "../../../components/ui/Pagination";

const data = [
  {
    name: "Best Sellers",
    products: "156 Products",
    updated: "Updated 2h ago",
    order: 1,
    status: "Active",
  },
  {
    name: "New Arrivals",
    products: "42 Products",
    updated: "Updated 1d ago",
    order: 2,
    status: "Active",
  },
  {
    name: "Summer Essentials",
    products: "89 Products",
    updated: "Updated 5d ago",
    order: 3,
    status: "Inactive",
  },
  {
    name: "Accessories",
    products: "210 Products",
    updated: "Updated 1w ago",
    order: 4,
    status: "Archived",
  },
];

export default function CollectionsTable() {
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              {[
                "Collection Name",
                "Products",
                "Display Order",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 ${h === "Actions" ? "text-right" : h === "Display Order" ? "text-center" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((col) => (
              <tr
                key={col.name}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400">
                        folder
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">{col.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-900 block">
                    {col.products}
                  </span>
                  <span className="text-xs text-slate-400">{col.updated}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                    {col.order}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={col.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-[#1325ec] transition-colors">
                      <span className="material-symbols-outlined text-lg">
                        edit
                      </span>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-slate-50/20 border-t border-slate-200 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-bold">4</span> collections
        </p>
        <Pagination currentPage={page} totalPages={3} onPageChange={setPage} />
      </div>
    </div>
  );
}
