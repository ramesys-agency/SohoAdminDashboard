import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import Pagination from "./Pagination";
import Button from "./Button";
import type { Product } from "../../mocks/products";

interface ProductsTableProps {
  products: Product[];
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggle?: (id: string) => void;
  itemsPerPage?: number;
  hideActions?: boolean;
}

export default function ProductsTable({
  products,
  selectable = false,
  selectedIds = new Set(),
  onToggle,
  itemsPerPage = 5,
  hideActions = false,
}: ProductsTableProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const tableHeaders = [
    "Product",
    "Category",
    "Price",
    "Status",
    "Created Date",
    ...(!hideActions || selectable ? ["Actions"] : []),
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              {tableHeaders.map((h) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider ${
                    h === "Actions" ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedProducts.map((p) => (
              <tr
                key={p.sku}
                className="hover:bg-slate-50/30 transition-all duration-200 group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="size-11 rounded-xl bg-slate-50 border border-slate-100 shrink-0 flex items-center justify-center group-hover:border-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-primary/40">
                        inventory_2
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p
                        className="text-sm font-bold text-slate-900 cursor-pointer hover:text-primary transition-colors"
                        onClick={() =>
                          !selectable && navigate(`/products/view/${p.id}`)
                        }
                      >
                        {p.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        SKU: {p.sku}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-600">
                    {p.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-900 font-mono tracking-tight">
                    {p.price}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                    {p.date}
                  </span>
                </td>
                {(!hideActions || selectable) && (
                  <td className="px-6 py-4 text-right">
                    {selectable ? (
                      <div className="flex justify-end">
                        <button
                          onClick={() => onToggle?.(p.id)}
                          className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            selectedIds.has(p.id)
                              ? "bg-primary border-primary shadow-md shadow-primary/20"
                              : "border-slate-200 hover:border-primary/50"
                          }`}
                        >
                          {selectedIds.has(p.id) && (
                            <span className="material-symbols-outlined text-white text-base font-bold">
                              check
                            </span>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/products/view/${p.id}`)}
                          title="View"
                        >
                          <span className="material-symbols-outlined text-lg">
                            visibility
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/products/edit/${p.id}`)}
                          className="hover:text-primary hover:bg-primary/5"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-red-500 hover:bg-red-50"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </Button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        showingText={`Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(
          currentPage * itemsPerPage,
          products.length,
        )} of ${products.length} products`}
      />
    </div>
  );
}
