import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPlacement,
  updatePlacement,
  type Placement,
} from "../../../api/placements";
import { getProducts, type ApiProduct } from "../../../api/products";
import { getFullImageUrl } from "../../../lib/imageUrl";
import {
  AppPage,
  PAGE_DISPLAY_LABEL,
  PAGE_SECTION_MAP,
  PageSection,
  SECTION_DISPLAY_LABEL,
  SECTION_GUIDANCE_MAP,
  isBannerSection,
} from "../types";

/**
 * Mount this only while it is open, with a `key` that changes per target, so
 * each opening starts from clean state instead of resetting inside an effect.
 */
interface PlacementDialogProps {
  onClose: () => void;
  /** Page and section come from wherever the admin clicked — never typed. */
  page: AppPage;
  section: PageSection;
  /** Set when editing; null creates a brand-new placement + collection. */
  placement: Placement | null;
  /** Candidates for "duplicate products from" — every placement, all pages. */
  duplicateOptions: Placement[];
}

export default function PlacementDialog({
  onClose,
  page,
  section,
  placement,
  duplicateOptions,
}: PlacementDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = Boolean(placement);

  const [name, setName] = useState(placement?.name ?? "");
  const [description, setDescription] = useState(placement?.description ?? "");
  const [sectionValue, setSectionValue] = useState<PageSection>(
    (placement?.section as PageSection) ?? section,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(placement?.imageUrl ?? "");
  const [isActive, setIsActive] = useState(placement?.isActive ?? true);
  const [sourcePlacementId, setSourcePlacementId] = useState("");
  const [linksToProduct, setLinksToProduct] = useState(Boolean(placement?.productId));
  const [productId, setProductId] = useState(placement?.productId ?? "");

  const { data: productsData } = useQuery({
    queryKey: ["products-deeplink-dropdown"],
    queryFn: () => getProducts({ limit: 100 }),
    enabled: linksToProduct,
  });

  const raw = productsData as unknown as { products?: ApiProduct[]; data?: ApiProduct[] };
  const products: ApiProduct[] = Array.isArray(raw?.products)
    ? raw.products
    : Array.isArray(raw?.data)
      ? raw.data
      : [];

  const allowedSections = PAGE_SECTION_MAP[page] ?? [];

  const saveMutation = useMutation({
    mutationFn: async () => {
      const trimmed = name.trim();
      if (!trimmed) throw new Error("Give this section a name.");

      const payload = {
        name: trimmed,
        description: description.trim(),
        page,
        section: sectionValue,
        isBanner: isBannerSection(sectionValue),
        isActive,
        image: imageFile,
        productId: linksToProduct ? productId || null : null,
      };

      if (placement) {
        return updatePlacement(placement.id, payload);
      }

      return createPlacement({
        ...payload,
        ...(sourcePlacementId ? { sourcePlacementId } : {}),
      });
    },
    onSuccess: () => {
      toast.success(
        placement
          ? "Section updated."
          : sourcePlacementId
            ? "Section created with a copy of the selected products."
            : "Section created.",
      );
      queryClient.invalidateQueries({ queryKey: ["placements"] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      onClose();
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(e?.response?.data?.message || e?.message || "Failed to save section.");
    },
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">view_quilt</span>
              {isEdit ? "Edit Section" : "Add Section"}
            </h3>
            {/* Page + section are context, not fields the admin has to think about */}
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5 ml-7">
              {PAGE_DISPLAY_LABEL[page]} › {SECTION_DISPLAY_LABEL[sectionValue] ?? sectionValue}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Section Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Best Sellers — Women"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
            <p className="mt-1.5 text-[11px] text-slate-500">
              Shown as the section heading in the app. Its link handle is generated from this name.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short subtitle shown under the section title..."
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Layout
            </label>
            <select
              value={sectionValue}
              onChange={(e) => setSectionValue(e.target.value as PageSection)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              {allowedSections.map((sec) => (
                <option key={sec} value={sec}>
                  {SECTION_DISPLAY_LABEL[sec]}
                </option>
              ))}
            </select>
            {SECTION_GUIDANCE_MAP[sectionValue] && (
              <p className="mt-1.5 text-xs text-indigo-600 bg-indigo-50 p-2 rounded border border-indigo-100">
                💡 {SECTION_GUIDANCE_MAP[sectionValue]}
              </p>
            )}
          </div>

          {!isEdit && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800">
                Start From
              </label>
              <select
                value={sourcePlacementId}
                onChange={(e) => setSourcePlacementId(e.target.value)}
                className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
              >
                <option value="">Empty — pick products after saving</option>
                {duplicateOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {PAGE_DISPLAY_LABEL[p.page as AppPage] ?? p.page} › {p.name} (
                    {p.productCount} products)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Duplicating copies that section&rsquo;s products into a brand-new collection. The
                two lists are independent afterwards — editing one never changes the other.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Cover Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-20 rounded-lg border border-slate-300 bg-slate-100 overflow-hidden flex justify-center items-center">
                {imagePreview ? (
                  <img
                    src={getFullImageUrl(imagePreview)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-slate-400">image</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="linksToProduct"
                checked={linksToProduct}
                onChange={(e) => {
                  setLinksToProduct(e.target.checked);
                  if (!e.target.checked) setProductId("");
                }}
                className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
              />
              <label htmlFor="linksToProduct" className="text-xs font-bold text-slate-700 cursor-pointer">
                Link straight to one product
              </label>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Off by default: tapping the section opens its product list. Turn on to send shoppers
              to a single product page instead.
            </p>
            {linksToProduct && (
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              >
                <option value="">-- Choose Product --</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="placementIsActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
            />
            <label htmlFor="placementIsActive" className="text-xs font-bold text-slate-700 cursor-pointer">
              Active (visible on app and web)
            </label>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="px-5 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            {saveMutation.isPending ? "Saving..." : isEdit ? "Save Section" : "Create Section"}
          </button>
        </div>
      </div>
    </div>
  );
}
