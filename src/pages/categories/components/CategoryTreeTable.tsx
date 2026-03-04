import { useState } from "react";
import StatusBadge from "../../../components/ui/StatusBadge";
import Pagination from "../../../components/ui/Pagination";

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: "devices",
    products: "1,250 products",
    status: "Active",
    children: [
      { name: "Smartphones", products: "450 products", status: "Active" },
      { name: "Laptops", products: "800 products", status: "Active" },
    ],
  },
  {
    id: 2,
    name: "Home Appliances",
    icon: "home",
    products: "600 products",
    status: "Inactive",
    children: [],
  },
  {
    id: 3,
    name: "Fashion & Apparel",
    icon: "apparel",
    products: "2,100 products",
    status: "Active",
    children: [],
  },
];

export default function CategoryTreeTable() {
  const [expanded, setExpanded] = useState<number[]>([1]);
  const [page, setPage] = useState(1);

  const toggle = (id: number) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
              <th className="px-6 py-4 border-b border-slate-200">
                Category Name
              </th>
              <th className="px-6 py-4 border-b border-slate-200">
                Products Count
              </th>
              <th className="px-6 py-4 border-b border-slate-200">Status</th>
              <th className="px-6 py-4 border-b border-slate-200 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <>
                <tr
                  key={cat.id}
                  className="group hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        onClick={() => toggle(cat.id)}
                        className="material-symbols-outlined text-slate-400 group-hover:text-[#1325ec] transition-colors cursor-pointer"
                      >
                        {cat.children.length > 0
                          ? expanded.includes(cat.id)
                            ? "keyboard_arrow_down"
                            : "keyboard_arrow_right"
                          : "remove"}
                      </span>
                      <div className="w-8 h-8 rounded bg-[#1325ec]/10 flex items-center justify-center text-[#1325ec]">
                        <span className="material-symbols-outlined text-lg">
                          {cat.icon}
                        </span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {cat.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {cat.products}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={cat.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-[#1325ec]/10 rounded-lg text-[#1325ec]">
                        <span className="material-symbols-outlined text-xl">
                          edit
                        </span>
                      </button>
                      <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500">
                        <span className="material-symbols-outlined text-xl">
                          more_vert
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
                {expanded.includes(cat.id) &&
                  cat.children.map((child) => (
                    <tr
                      key={child.name}
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 pl-10 border-l-2 border-slate-200 ml-4">
                          <span className="material-symbols-outlined text-slate-300">
                            subdirectory_arrow_right
                          </span>
                          <span className="font-medium text-slate-700">
                            {child.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {child.products}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={child.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-[#1325ec]/10 rounded-lg text-[#1325ec]">
                            <span className="material-symbols-outlined text-xl">
                              edit
                            </span>
                          </button>
                          <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500">
                            <span className="material-symbols-outlined text-xl">
                              more_vert
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={5}
        onPageChange={setPage}
        showingText="Showing 1 to 5 of 24 categories"
      />
    </div>
  );
}
