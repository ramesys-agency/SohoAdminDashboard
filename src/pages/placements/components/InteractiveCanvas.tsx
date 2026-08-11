import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import OffersCanvas from "./OffersCanvas";
import CatalogCanvas from "./CatalogCanvas";
import HomeCanvas from "./HomeCanvas";
import PlacementDialog from "./PlacementDialog";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import {
  getPlacements,
  deletePlacement,
  reorderPlacements,
  type Placement,
} from "../../../api/placements";
import { getFullImageUrl } from "../../../lib/imageUrl";
import {
  AppPage,
  PAGE_DISPLAY_LABEL,
  PAGE_SECTION_MAP,
  PageSection,
  SECTION_DISPLAY_LABEL,
  type CanvasProps,
} from "../types";

interface InteractiveCanvasProps {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
}

export default function InteractiveCanvas({
  activePage,
  setActivePage,
}: InteractiveCanvasProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [deviceMode, setDeviceMode] = useState<"mobile" | "web">("mobile");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSection, setDialogSection] = useState<PageSection>(PageSection.GRID_SECTION);
  const [editingPlacement, setEditingPlacement] = useState<Placement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Placement | null>(null);

  // Placements for the page being edited...
  const { data: pageData } = useQuery({
    queryKey: ["placements", activePage],
    queryFn: () => getPlacements({ page: activePage }),
  });

  // ...and every placement, so "duplicate from" can pull across pages.
  const { data: allData } = useQuery({
    queryKey: ["placements", "all"],
    queryFn: () => getPlacements(),
  });

  const placements = pageData?.data ?? [];
  const allPlacements = allData?.data ?? [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["placements"] });
    queryClient.invalidateQueries({ queryKey: ["collections"] });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePlacement(id),
    onSuccess: () => {
      toast.success("Section deleted.");
      invalidate();
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete section."),
  });

  const reorderMutation = useMutation({
    mutationFn: (ordered: Placement[]) =>
      reorderPlacements(ordered.map((p, index) => ({ id: p.id, displayOrder: index + 1 }))),
    onSuccess: invalidate,
    onError: () => {
      toast.error("Failed to save the new order.");
      invalidate();
    },
  });

  const handleReorder = (ordered: Placement[]) => {
    // Paint the new order immediately, then persist.
    queryClient.setQueryData(["placements", activePage], { success: true, data: ordered });
    reorderMutation.mutate(ordered);
  };

  const openAdd = (section: PageSection) => {
    setEditingPlacement(null);
    setDialogSection(section);
    setDialogOpen(true);
  };

  const openEdit = (placement: Placement) => {
    setEditingPlacement(placement);
    setDialogSection(placement.section as PageSection);
    setDialogOpen(true);
  };

  const canvasProps: CanvasProps = {
    placements,
    onEdit: openEdit,
    onAdd: openAdd,
    onDelete: setDeleteTarget,
    onProducts: (placement) =>
      navigate(`/placements/${placement.id}/products`, {
        state: { placementName: placement.name },
      }),
    onReorder: handleReorder,
  };

  const isCatalogPage =
    activePage === AppPage.CATALOG_MEN ||
    activePage === AppPage.CATALOG_WOMEN ||
    activePage === AppPage.CATALOG_KIDS;

  return (
    <div className="space-y-6">
      {/* Top Header & Page Selector Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {Object.values(AppPage).map((p) => (
            <button
              key={p}
              onClick={() => setActivePage(p as AppPage)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activePage === p
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {p === AppPage.HOME ? "home" : p === AppPage.OFFERS ? "sell" : "checkroom"}
              </span>
              {PAGE_DISPLAY_LABEL[p as AppPage]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                deviceMode === "mobile"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">smartphone</span>
              Mobile Screen
            </button>
            <button
              onClick={() => setDeviceMode("web")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                deviceMode === "web"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
              Desktop Web
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Page Inspector */}
        <div className="xl:col-span-6 space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-200 border border-white/10 uppercase tracking-wider">
                  Active Page
                </span>
                <span className="text-amber-400 font-bold text-xs">• Live Preview Sync</span>
              </div>
              <h2 className="text-2xl font-bold font-['Playfair_Display',serif]">
                {PAGE_DISPLAY_LABEL[activePage]} Sections
              </h2>
              <p className="text-slate-300 text-xs">
                Every section is its own collection — own name, image, link handle and product
                list. Renaming or re-curating one never touches the others.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="bg-white/10 rounded-xl p-3 text-center min-w-20 border border-white/10">
                <span className="block text-xl font-extrabold text-white">{placements.length}</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                  Sections
                </span>
              </div>
              <div className="bg-emerald-500/20 rounded-xl p-3 text-center min-w-20 border border-emerald-400/20">
                <span className="block text-xl font-extrabold text-emerald-200">
                  {placements.filter((p) => p.isActive).length}
                </span>
                <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">
                  Live
                </span>
              </div>
            </div>
          </div>

          {/* Section inventory for the active page */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">touch_app</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Interactive Mobile Canvas</h3>
                <p className="text-xs text-slate-500">
                  Add, edit and drag sections directly on the phone preview. Page and section are
                  set by where you click.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {placements.map((placement) => (
                <div
                  key={placement.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {placement.imageUrl ? (
                      <img
                        src={getFullImageUrl(placement.imageUrl)}
                        alt={placement.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400 text-[18px]">
                        image
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{placement.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">
                      /{placement.slug} · {placement.productCount} products
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {SECTION_DISPLAY_LABEL[placement.section as PageSection] ?? placement.section}
                  </span>
                  {!placement.isActive && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      Hidden
                    </span>
                  )}
                </div>
              ))}

              {placements.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">
                  No sections on this page yet — add one from the phone preview.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Mobile Screen Preview */}
        <div className="xl:col-span-6 sticky top-6 self-start flex flex-col items-center justify-start z-10">
          <div className="w-full max-w-[435px] bg-slate-900 text-white rounded-t-2xl p-3 border-b border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase text-slate-200">
                Static App Preview
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
              {PAGE_DISPLAY_LABEL[activePage]}
            </span>
          </div>

          <div className="bg-slate-100 border-x border-b border-slate-300 rounded-b-3xl p-4 shadow-xl flex justify-center items-center w-full max-w-[435px]">
            {deviceMode === "mobile" ? (
              <div className="relative w-[415px] h-[770px] border-[10px] border-slate-900 rounded-[44px] bg-white overflow-hidden shadow-2xl ring-1 ring-slate-300 flex flex-col transition-all duration-300">
                <div className="absolute top-0 inset-x-0 h-5 bg-slate-900 rounded-b-xl mx-auto w-36 z-30 flex justify-center items-center">
                  <div className="w-12 h-1 bg-slate-800 rounded-full mt-0.5" />
                </div>

                <div className="bg-white text-slate-900 px-6 pt-3 pb-1 flex justify-between items-center text-[11px] font-semibold z-20">
                  <span>12:46</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[13px]">
                      signal_cellular_4_bar
                    </span>
                    <span className="material-symbols-outlined text-[13px]">wifi</span>
                    <span className="material-symbols-outlined text-[13px]">battery_full</span>
                  </div>
                </div>

                {activePage === AppPage.OFFERS ? (
                  <OffersCanvas {...canvasProps} />
                ) : isCatalogPage ? (
                  <CatalogCanvas
                    {...canvasProps}
                    activePage={activePage}
                    setActivePage={setActivePage}
                  />
                ) : (
                  <HomeCanvas {...canvasProps} />
                )}

                {/* Bottom App Navigation Bar */}
                <div className="bg-white border-t border-slate-100 px-5 py-2 flex items-center justify-between text-slate-900 z-30 absolute bottom-0 inset-x-0">
                  <div
                    onClick={() => setActivePage(AppPage.HOME)}
                    className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                      activePage === AppPage.HOME ? "text-slate-900 font-bold" : "text-slate-500"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">home</span>
                    <span className="text-[9px]">Home</span>
                  </div>
                  <div
                    onClick={() => setActivePage(AppPage.CATALOG_WOMEN)}
                    className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                      isCatalogPage ? "text-slate-900 font-bold" : "text-slate-500"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">grid_view</span>
                    <span className="text-[9px]">Catalog</span>
                  </div>
                  <div
                    onClick={() => setActivePage(AppPage.OFFERS)}
                    className={`flex flex-col items-center gap-0.5 cursor-pointer ${
                      activePage === AppPage.OFFERS ? "text-slate-900 font-bold" : "text-slate-500"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">sell</span>
                    <span className="text-[9px]">Offers</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-500">
                    <span className="material-symbols-outlined text-lg">favorite</span>
                    <span className="text-[9px] font-medium">Wishlist</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 text-slate-500">
                    <span className="material-symbols-outlined text-lg">person</span>
                    <span className="text-[9px] font-medium">Profile</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop Web Store Preview */
              <div className="relative w-full h-[620px] rounded-xl bg-white border border-slate-300 overflow-hidden flex flex-col">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-[200px]">
                    https://soho-bd.com/{activePage.toLowerCase()}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <img src="/soho.png" alt="Soho" className="h-8 object-contain" />
                  <div className="grid grid-cols-1 gap-4">
                    {placements.map((placement) => (
                      <div
                        key={placement.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex justify-between items-center"
                      >
                        <span className="font-bold text-xs text-slate-800">{placement.name}</span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {SECTION_DISPLAY_LABEL[placement.section as PageSection] ??
                            placement.section}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {dialogOpen && (
        <PlacementDialog
          // Remount per target so each opening starts from a clean draft.
          key={`${editingPlacement?.id ?? "new"}-${activePage}-${dialogSection}`}
          onClose={() => setDialogOpen(false)}
          page={activePage}
          section={
            PAGE_SECTION_MAP[activePage]?.includes(dialogSection)
              ? dialogSection
              : (PAGE_SECTION_MAP[activePage]?.[0] ?? PageSection.GRID_SECTION)
          }
          placement={editingPlacement}
          duplicateOptions={allPlacements}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        isLoading={deleteMutation.isPending}
        title="Delete Section"
        message={
          <>
            Delete{" "}
            <span className="font-semibold text-slate-900">
              &ldquo;{deleteTarget?.name}&rdquo;
            </span>
            ? Its collection and curated product list go with it. Other sections are unaffected.
          </>
        }
      />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
