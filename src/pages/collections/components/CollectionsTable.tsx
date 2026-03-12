import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StatusBadge from "../../../components/ui/StatusBadge";
import Pagination from "../../../components/ui/Pagination";
import { getCollections } from "../../../api/collections";
import type { Collection } from "../../../api/collections";

interface CollectionsTableProps {
  /** 0 = All, 1 = Active, 2 = Inactive */
  activeTab: number;
}

export default function CollectionsTable({ activeTab }: CollectionsTableProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["collections", page],
    queryFn: () => getCollections(page, 10),
  });

  const allCollections = data?.data || [];
  const meta = data?.meta;

  // Filter based on activeTab using isActive
  const filteredCollections = allCollections.filter((col: Collection) => {
    if (activeTab === 1) return col.isActive === true;
    if (activeTab === 2) return col.isActive === false;
    return true; // "All"
  });

  const getFirstImageUrl = (col: Collection): string | null => {
    return col.collectionPlacements?.[0]?.imageUrl ?? null;
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading collections...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load collections.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              {[
                "Collection Name",
                "Products",
                "Gender",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 ${h === "Actions" ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCollections.map((col: Collection) => (
              <tr
                key={col.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {getFirstImageUrl(col) ? (
                        <img
                          src={getFirstImageUrl(col)!}
                          alt={col.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-slate-400">
                          folder
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {col.name}
                      </span>
                      <span className="text-xs text-slate-400">{col.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-900">
                    {col.productCount} Products
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {col.gender.map((g) => (
                      <span
                        key={g}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={col.isActive ? "Active" : "Inactive"} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        navigate(`/collections/${col.id}/add-products`)
                      }
                      className="p-2 text-slate-400 hover:text-[#1325ec] transition-colors"
                      title="Add Products"
                    >
                      <span className="material-symbols-outlined text-lg">
                        add_box
                      </span>
                    </button>
                    <button
                      onClick={() => navigate(`/collections/${col.id}/edit`)}
                      className="p-2 text-slate-400 hover:text-[#1325ec] transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-lg">
                        edit
                      </span>
                    </button>
                    <button
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-lg">
                        delete
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCollections.length === 0 && !isLoading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No collections found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {meta && meta.totalPages > 1 && (
        <div className="px-6 py-4 bg-slate-50/20 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold">
              {(page - 1) * meta.limit + 1}–
              {Math.min(page * meta.limit, meta.total)}
            </span>{" "}
            of <span className="font-bold">{meta.total}</span> collections
          </p>
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
