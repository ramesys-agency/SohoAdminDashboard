import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../../components/ui/StatusBadge";
import Pagination from "../../../components/ui/Pagination";

const products = [
  {
    name: "NeoPhone 15 Pro",
    sku: "PH-1029-NP",
    category: "Electronics",
    price: "$999.00",
    status: "Active",
    date: "Oct 12, 2023",
  },
  {
    name: "Aura Wireless Buds",
    sku: "AU-5541-W",
    category: "Audio",
    price: "$149.00",
    status: "Active",
    date: "Oct 15, 2023",
  },
  {
    name: "Atlas Leather Bag",
    sku: "BG-2210-LB",
    category: "Travel",
    price: "$280.00",
    status: "Draft",
    date: "Nov 02, 2023",
  },
  {
    name: "Nexus Ergo Desk",
    sku: "HM-7782-WD",
    category: "Furniture",
    price: "$450.00",
    status: "Active",
    date: "Nov 10, 2023",
  },
];

export default function ProductsTable() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {[
                "Product",
                "Category",
                "Price",
                "Status",
                "Created Date",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${h === "Actions" ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((p) => (
              <tr
                key={p.sku}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => navigate(`/products/${p.sku}`)}
                  >
                    <div className="size-12 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400">
                        inventory_2
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 hover:text-[#1325ec] transition-colors">
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-500">SKU: {p.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {p.category}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">
                  {p.price}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{p.date}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => navigate(`/products/${p.sku}`)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                    title="View"
                  >
                    <span className="material-symbols-outlined">
                      visibility
                    </span>
                  </button>
                  <button
                    onClick={() => navigate("/products/edit")}
                    className="p-1.5 text-slate-400 hover:text-[#1325ec] transition-colors ml-1"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors ml-1"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={5}
        onPageChange={setPage}
        showingText="Showing 1 to 10 of 42 products"
      />
    </div>
  );
}
