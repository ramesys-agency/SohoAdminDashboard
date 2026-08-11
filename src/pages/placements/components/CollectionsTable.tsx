import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StatusBadge from "../../../components/ui/StatusBadge";
import Pagination from "../../../components/ui/Pagination";
import { getCollections } from "../../../api/collections";
import type { Collection, CollectionPlacement } from "../../../api/collections";
import { deletePlacement } from "../../../api/placements";
import { getHomePromos, deleteHomePromo, type HomePromo } from "../../../api/homePromo";
import ConfirmModal from "../../../components/ui/ConfirmModal";

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
  const [activeTab, setActiveTab] = useState<"placements" | "promos">("placements");
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

  // Query Collections Placements
  const { data, isLoading, isError } = useQuery({
    queryKey: ["collections", page, debouncedSearch, placementPage],
    queryFn: () => getCollections(page, 10, debouncedSearch, placementPage),
  });

  // Query Homepage Promos
  const { data: promoResponse, isLoading: isLoadingPromos } = useQuery({
    queryKey: ["home-promos-table"],
    queryFn: () => getHomePromos(),
  });

  const deleteMutation = useMutation({
    mutationFn: (placementId: string) => deletePlacement(placementId),
    onSuccess: () => {
      toast.success("Placement deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collections-canvas"] });
      setDeletingId(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? "Failed to delete placement.");
      setDeletingId(null);
    },
  });

  const deletePromoMutation = useMutation({
    mutationFn: (promoId: string) => deleteHomePromo(promoId),
    onSuccess: () => {
      toast.success("Homepage promotion deleted.");
      queryClient.invalidateQueries({ queryKey: ["home-promos"] });
      queryClient.invalidateQueries({ queryKey: ["home-promos-table"] });
      setDeletingId(null);
    },
    onError: () => {
      toast.error("Failed to delete homepage promotion.");
      setDeletingId(null);
    },
  });

  const [deletePlacementTarget, setDeletePlacementTarget] = useState<{ id: string; name: string } | null>(null);
  const [deletePromoTarget, setDeletePromoTarget] = useState<{ id: string; title: string } | null>(null);

  const confirmDeletePlacement = () => {
    if (!deletePlacementTarget) return;
    setDeletingId(deletePlacementTarget.id);
    deleteMutation.mutate(deletePlacementTarget.id);
    setDeletePlacementTarget(null);
  };

  const confirmDeletePromo = () => {
    if (!deletePromoTarget) return;
    setDeletingId(deletePromoTarget.id);
    deletePromoMutation.mutate(deletePromoTarget.id);
    setDeletePromoTarget(null);
  };

  const allCollections = data?.data || [];
  const meta = data?.meta;
  const promos = (promoResponse?.data || []).filter((p) =>
    debouncedSearch ? p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) : true
  );

  const placementRows: PlacementRow[] = allCollections.flatMap(
    (col: Collection) =>
      col.collectionPlacements?.map((p) => ({ placement: p, collection: col })) ?? [],
  );

  return (
    <div className="space-y-4">
      {/* Table Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("placements")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === "placements"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">view_quilt</span>
          Collection Placements ({placementRows.length})
        </button>
        <button
          onClick={() => setActiveTab("promos")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
            activeTab === "promos"
              ? "bg-purple-700 text-white shadow-xs"
              : "bg-purple-50 text-purple-700 hover:bg-purple-100"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">campaign</span>
          Homepage Promos ({promos.length})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            type="text"
            placeholder={
              activeTab === "placements"
                ? "Search collections..."
                : "Search promo banners..."
            }
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
        </div>
        {activeTab === "placements" && (
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
        )}
      </div>

      {/* Table Render */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === "placements" ? (
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading placements...</div>
            ) : isError ? (
              <div className="p-8 text-center text-red-500">Failed to load placements.</div>
            ) : (
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
                        className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 ${
                          h === "Actions" ? "text-right" : ""
                        }`}
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
                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                          {PAGE_DISPLAY_LABEL[placement.page as AppPage] || placement.page}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {placement.section ? (
                          <span
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700"
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
                            className="px-3 py-1 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors"
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
                            onClick={() => setDeletePlacementTarget({ id: placement.id, name: collection.name })}
                            disabled={deletingId === placement.id && deleteMutation.isPending}
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
                  {placementRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-slate-500 text-sm font-medium"
                      >
                        No placements found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          /* Homepage Promos Table */
          <div className="overflow-x-auto">
            {isLoadingPromos ? (
              <div className="p-8 text-center text-purple-600">Loading promotions...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-purple-50/40 border-b border-purple-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Redirect Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {promos.map((promo: HomePromo) => (
                    <tr key={promo.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {promo.imageUrl ? (
                          <img
                            src={promo.imageUrl}
                            alt={promo.title}
                            className="w-16 h-12 rounded-lg object-cover border border-slate-200 shadow-xs"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                            <span className="material-symbols-outlined text-slate-400">campaign</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">{promo.title}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate">{promo.description || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                          {promo.contentType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={promo.isActive ? "Active" : "Inactive"} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setDeletePromoTarget({ id: promo.id, title: promo.title })}
                          disabled={deletingId === promo.id && deletePromoMutation.isPending}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete Promo"
                        >
                          <span className="material-symbols-outlined text-lg">
                            {deletingId === promo.id && deletePromoMutation.isPending
                              ? "hourglass_empty"
                              : "delete"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {promos.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm font-medium">
                        No homepage promotions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {meta && meta.totalPages > 1 && activeTab === "placements" && (
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

      <ConfirmModal
        isOpen={Boolean(deletePlacementTarget)}
        onClose={() => setDeletePlacementTarget(null)}
        onConfirm={confirmDeletePlacement}
        isLoading={deleteMutation.isPending}
        title="Delete Placement"
        message={
          <>
            Are you sure you want to delete this placement for{" "}
            <span className="font-semibold text-slate-900">
              &ldquo;{deletePlacementTarget?.name}&rdquo;
            </span>
            ? This action cannot be undone.
          </>
        }
      />

      <ConfirmModal
        isOpen={Boolean(deletePromoTarget)}
        onClose={() => setDeletePromoTarget(null)}
        onConfirm={confirmDeletePromo}
        isLoading={deletePromoMutation.isPending}
        title="Delete Homepage Promotion"
        message={
          <>
            Are you sure you want to delete promotion{" "}
            <span className="font-semibold text-slate-900">
              &ldquo;{deletePromoTarget?.title}&rdquo;
            </span>
            ?
          </>
        }
      />
    </div>
  );
}
