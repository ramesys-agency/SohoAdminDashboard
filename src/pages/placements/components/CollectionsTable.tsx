import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StatusBadge from "../../../components/ui/StatusBadge";
import Pagination from "../../../components/ui/Pagination";
import { getCollections } from "../../../api/collections";
import type { Collection, CollectionPlacement } from "../../../api/collections";
import { deletePlacement } from "../../../api/placements";

import { AppPage, PAGE_DISPLAY_LABEL, SECTION_GUIDANCE_MAP, PageSection } from "../types";

const PAGE_OPTIONS = [
  { label: "All Pages", value: "" },
  { label: PAGE_DISPLAY_LABEL[AppPage.HOME], value: AppPage.HOME },
  {
    label: PAGE_DISPLAY_LABEL[AppPage.CATALOG_MEN],
    value: AppPage.CATALOG_MEN,
  },
  {
    label: PAGE_DISPLAY_LABEL[AppPage.CATALOG_WOMEN],
    value: AppPage.CATALOG_WOMEN,
  },
  {
    label: PAGE_DISPLAY_LABEL[AppPage.CATALOG_KIDS],
    value: AppPage.CATALOG_KIDS,
  },
  { label: PAGE_DISPLAY_LABEL[AppPage.OFFERS], value: AppPage.OFFERS },
];

interface PlacementRow {
  placement: CollectionPlacement;
  collection: Collection;
}

export default function CollectionsTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [placementPage, setPlacementPage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      if (searchTimer.current) clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => {
        setDebouncedSearch(value);
        setPage(1);
      }, 400);
    },
    [],
  );

  const handlePageFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPlacementPage(e.target.value);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["collections", page, debouncedSearch, placementPage],
    queryFn: () => getCollections(page, 10, debouncedSearch, placementPage),
  });

  const deleteMutation = useMutation({
    mutationFn: (placementId: string) => deletePlacement(placementId),
    onSuccess: () => {
      toast.success("Placement deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      setDeletingId(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? "Failed to delete placement.");
      setDeletingId(null);
    },
  });

  const handleDelete = (placementId: string, collectionName: string) => {
    if (
      !window.confirm(
        `Delete this placement for "${collectionName}"? This cannot be undone.`,
      )
    )
      return;
    setDeletingId(placementId);
    deleteMutation.mutate(placementId);
  };

  const allCollections = data?.data || [];
  const meta = data?.meta;

  // Flatten: one row per placement across all collections
  const placementRows: PlacementRow[] = allCollections.flatMap(
    (col: Collection) =>
      col.collectionPlacements?.map((p) => ({ placement: p, collection: col })) ?? [],
  );

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
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search collections..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={placementPage}
            onChange={handlePageFilterChange}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white"
          >
            {PAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                {[
                  "Collection Name",
                  "Products",
                  "Placement Page",
                  "Section",
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
              {placementRows.map(({ placement, collection }) => (
                <tr
                  key={placement.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                        {placement.imageUrl ? (
                          <img
                            src={placement.imageUrl}
                            alt={collection.name}
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
                          {collection.name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-900">
                      {placement._count?.products ?? 0} Products
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {PAGE_DISPLAY_LABEL[placement.page as AppPage] || placement.page}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {placement.section ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700"
                        title={SECTION_GUIDANCE_MAP[placement.section as PageSection] ?? placement.section}
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {placement.isBanner ? "panorama_wide_angle" : "crop_portrait"}
                        </span>
                        {placement.section}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={placement.isActive ? "Active" : "Inactive"}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/placements/${placement.id}/products`,
                            { state: { collectionName: collection.name } },
                          )
                        }
                        className="px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Products"
                      >
                        Products
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/placements/edit/${placement.id}`, {
                            state: { placement },
                          })
                        }
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-lg">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(placement.id, collection.name)}
                        disabled={
                          deletingId === placement.id && deleteMutation.isPending
                        }
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-lg">
                          {deletingId === placement.id && deleteMutation.isPending
                            ? "hourglass_empty"
                            : "delete"}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {placementRows.length === 0 && !isLoading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No placements found.
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
    </div>
  );
}
