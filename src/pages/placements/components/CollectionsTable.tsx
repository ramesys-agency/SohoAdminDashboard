import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StatusBadge from "../../../components/ui/StatusBadge";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import {
  getPlacements,
  deletePlacement,
  duplicatePlacement,
  type Placement,
} from "../../../api/placements";
import { getFullImageUrl } from "../../../lib/imageUrl";
import {
  AppPage,
  PAGE_DISPLAY_LABEL,
  PageSection,
  SECTION_DISPLAY_LABEL,
  SECTION_GUIDANCE_MAP,
} from "../types";

const PAGE_OPTIONS = [
  { label: "All Pages", value: "" },
  ...Object.values(AppPage).map((page) => ({
    label: PAGE_DISPLAY_LABEL[page],
    value: page as string,
  })),
];

export default function CollectionsTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [placementPage, setPlacementPage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Placement | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(value), 400);
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["placements", placementPage || "all-pages"],
    queryFn: () => getPlacements(placementPage ? { page: placementPage } : undefined),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["placements"] });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePlacement(id),
    onSuccess: () => {
      toast.success("Section deleted.");
      invalidate();
      setDeleteTarget(null);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? "Failed to delete section.");
      setDeleteTarget(null);
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => duplicatePlacement(id),
    onSuccess: (res) => {
      toast.success(`Created "${res.data.name}" with a copy of the products.`);
      invalidate();
    },
    onError: () => toast.error("Failed to duplicate section."),
  });

  const placements = (data?.data ?? []).filter((p) =>
    debouncedSearch
      ? p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.slug.toLowerCase().includes(debouncedSearch.toLowerCase())
      : true,
  );

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
            placeholder="Search sections by name or handle..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={placementPage}
            onChange={(e) => setPlacementPage(e.target.value)}
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
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading sections...</div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">Failed to load sections.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  {["Section", "Products", "Page", "Layout", "Order", "Status", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 ${
                          h === "Actions" ? "text-right" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {placements.map((placement) => (
                  <tr key={placement.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                          {placement.imageUrl ? (
                            <img
                              src={getFullImageUrl(placement.imageUrl)}
                              alt={placement.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-slate-400">folder</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate">
                            {placement.name}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            /{placement.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900">
                        {placement.productCount} Products
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                        {PAGE_DISPLAY_LABEL[placement.page as AppPage] || placement.page}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700"
                        title={
                          SECTION_GUIDANCE_MAP[placement.section as PageSection] ?? placement.section
                        }
                      >
                        <span className="material-symbols-outlined text-[13px]">
                          {placement.isBanner ? "panorama_wide_angle" : "crop_portrait"}
                        </span>
                        {SECTION_DISPLAY_LABEL[placement.section as PageSection] ??
                          placement.section}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-500">
                      {placement.displayOrder}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={placement.isActive ? "Active" : "Inactive"} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/placements/${placement.id}/products`, {
                              state: { placementName: placement.name },
                            })
                          }
                          className="px-3 py-1 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          Products
                        </button>
                        <button
                          onClick={() => duplicateMutation.mutate(placement.id)}
                          disabled={duplicateMutation.isPending}
                          className="p-2 text-slate-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                          title="Duplicate into a new collection"
                        >
                          <span className="material-symbols-outlined text-lg">content_copy</span>
                        </button>
                        <button
                          onClick={() => navigate(`/placements/edit/${placement.id}`)}
                          className="p-2 text-slate-400 hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(placement)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {placements.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-slate-500 text-sm font-medium"
                    >
                      No sections found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        isLoading={deleteMutation.isPending}
        title="Delete Section"
        message={
          <>
            Delete{" "}
            <span className="font-semibold text-slate-900">&ldquo;{deleteTarget?.name}&rdquo;</span>
            ? Its collection and curated product list go with it. This cannot be undone.
          </>
        }
      />
    </div>
  );
}
