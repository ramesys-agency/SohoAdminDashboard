import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPlacement,
  updatePlacement,
  type Placement,
} from "../../../api/placements";
import { getCategories } from "../../../api/categories";
import { getFullImageUrl } from "../../../lib/imageUrl";
import ProductPicker from "./ProductPicker";
import {
  AppPage,
  PAGE_DISPLAY_LABEL,
  PageSection,
  SECTION_DISPLAY_LABEL,
  SECTION_GUIDANCE_MAP,
  SECTION_IMAGE_SPEC,
  isBannerSection,
  isCategorySourced,
} from "../types";
import { MAX_IMAGE_UPLOAD_MB, imageHint } from "../../../lib/imageGuidelines";

/** The four layouts a home promo can land in, in the order they cycle. */
const HOME_PROMO_SECTIONS = [
  PageSection.FEATURED_ROW,
  PageSection.GRID_SECTION,
  PageSection.MID_BANNER,
  PageSection.SEE_ALL,
];

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(placement?.imageUrl ?? "");
  const [isActive, setIsActive] = useState(placement?.isActive ?? true);
  const [sourcePlacementId, setSourcePlacementId] = useState("");
  const [linksToProduct, setLinksToProduct] = useState(
    Boolean(placement?.productId),
  );
  const [productId, setProductId] = useState(placement?.productId ?? "");
  const [sourceCategoryId, setSourceCategoryId] = useState(
    placement?.sourceCategoryId ?? "",
  );

  /// The layout is settled by the add button the admin clicked, or by the
  /// placement already being edited — it is never re-chosen in here.
  const sectionValue = (placement?.section as PageSection) ?? section;

  /// Circles offer a source category but do not require one — a circle with no
  /// category is simply a hand-picked list, filled in on the products screen.
  const isCircle = isCategorySourced(sectionValue);

  /// Home draws its promos in the four layouts by position, not by section, so
  /// naming one layout here would be wrong the moment the card is dragged.
  const isHomePromo =
    page === AppPage.HOME && sectionValue !== PageSection.HERO;

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-placement-source"],
    queryFn: () => getCategories({ isActive: true, limit: 200 }),
    enabled: isCircle,
  });

  const categoryRaw = categoriesData as unknown as {
    data?: {
      id: string;
      name: string;
      parentId?: string | null;
      parent?: { id: string; name: string } | null;
    }[];
  };
  const categories = Array.isArray(categoryRaw?.data) ? categoryRaw.data : [];

  /// "Shirts" alone is ambiguous once two parents each have one, so a
  /// subcategory is labelled with its parent. The parent name comes from the
  /// row itself when the API supplies it, and from the fetched list otherwise.
  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));
  const categoryOptions = categories
    .map((category) => {
      const parentName =
        category.parent?.name ||
        (category.parentId ? categoryNameById.get(category.parentId) : null);
      return {
        id: category.id,
        name: category.name,
        // Sorting on the parent first keeps a parent's subcategories together in
        // the list instead of scattering them alphabetically among other roots.
        groupKey: parentName || category.name,
        isChild: Boolean(parentName),
        label: parentName ? `${parentName} → ${category.name}` : category.name,
      };
    })
    .sort(
      (a, b) =>
        a.groupKey.localeCompare(b.groupKey) ||
        Number(a.isChild) - Number(b.isChild) ||
        a.name.localeCompare(b.name),
    );

  const saveMutation = useMutation({
    mutationFn: async () => {
      const trimmed = name.trim();
      if (!trimmed) throw new Error("Give this section a name.");

      const payload = {
        name: trimmed,
        // Circles show a name and an image only, so there is nowhere for a
        // description to appear.
        description: isCircle ? "" : description.trim(),
        page,
        section: sectionValue,
        isBanner: isBannerSection(sectionValue),
        isActive,
        image: imageFile,
        productId: linksToProduct ? productId || null : null,
        // Empty string unlinks the category — either because this is not a
        // circle, or because the admin chose to hand-pick it.
        sourceCategoryId: isCircle ? sourceCategoryId : "",
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
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      toast.error(
        e?.response?.data?.message || e?.message || "Failed to save section.",
      );
    },
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                view_quilt
              </span>
              {isEdit ? "Edit Section" : "Add Section"}
            </h3>
            {/* Page + section are context, not fields the admin has to think about */}
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5 ml-7">
              {PAGE_DISPLAY_LABEL[page]} ›{" "}
              {isHomePromo
                ? "Promo Section"
                : (SECTION_DISPLAY_LABEL[sectionValue] ?? sectionValue)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
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
              Shown as the section heading in the app. Its link handle is
              generated from this name.
            </p>
          </div>

          {/* A circle renders as a name under an image — no description shows. */}
          {!isCircle && (
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
          )}

          {/* The add button already decided the layout, so this only says what
              that layout looks like — a picker here could only contradict the
              slot the card was added to. */}
          {!isCircle && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Layout
              </label>
              {isHomePromo ? (
                <p className="text-xs text-indigo-700 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 leading-snug">
                  <span className="font-bold">Decided by position</span> — home
                  promos cycle through Large → Collage → Side Image → Horizontal
                  in order. Drag this card on the canvas to change which layout
                  it gets.
                </p>
              ) : (
                SECTION_GUIDANCE_MAP[sectionValue] && (
                  <p className="text-xs text-indigo-700 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 leading-snug">
                    <span className="font-bold">
                      {SECTION_DISPLAY_LABEL[sectionValue]}
                    </span>{" "}
                    — {SECTION_GUIDANCE_MAP[sectionValue]}
                  </p>
                )
              )}
            </div>
          )}

          {isCircle && (
            <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-3 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-sky-800">
                Products Come From
              </label>
              <select
                value={sourceCategoryId}
                onChange={(e) => {
                  const nextId = e.target.value;
                  setSourceCategoryId(nextId);
                  // Naming the circle after the category is almost always what
                  // is wanted, but it stays editable.
                  const picked = categories.find((c) => c.id === nextId);
                  if (picked && !name.trim()) setName(picked.name);
                }}
                className="w-full rounded-lg border border-sky-300 bg-white px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
              >
                <option value="">
                  Hand-picked — I'll choose the products myself
                </option>
                {categoryOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* The trade-off is stated where the choice is made, rather than
                  discovered months later when the circle has gone stale. */}
              {sourceCategoryId ? (
                <p className="text-[11px] text-sky-800/80 leading-snug">
                  Products come from this category and everything under it,
                  filtered to this tab's gender. New products added to the
                  category show up here on their own — you can still add or
                  remove individual ones afterwards without breaking that.
                </p>
              ) : (
                <p className="text-[11px] text-sky-800/80 leading-snug">
                  You pick every product by hand on the next screen. Nothing
                  arrives automatically, so new stock has to be added here
                  yourself. Save this first, then use the products button on the
                  circle to fill it.
                </p>
              )}

              {isEdit &&
                (placement?.sourceCategoryId ?? "") !== sourceCategoryId && (
                  <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                    Changing this empties the list: every product added, removed
                    or reordered by hand here is discarded, and you start again
                    on the products screen.
                  </p>
                )}
            </div>
          )}

          {/* Copying a product list only makes sense when the placement keeps
              one — a category-sourced circle derives its own. */}
          {!isEdit && (!isCircle || !sourceCategoryId) && (
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
                    {PAGE_DISPLAY_LABEL[p.page as AppPage] ?? p.page} › {p.name}{" "}
                    ({p.productCount} products)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Duplicating copies that section&rsquo;s products into a
                brand-new collection. The two lists are independent afterwards —
                editing one never changes the other.
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
                  <span className="material-symbols-outlined text-slate-400">
                    image
                  </span>
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
            {/* Every layout crops to a different shape, so the number quoted
                here follows the slot this card will actually render in. */}
            {isHomePromo ? (
              <p className="mt-1.5 text-[11px] text-slate-500 leading-snug">
                Size depends on the layout this card lands in —{" "}
                {HOME_PROMO_SECTIONS.map(
                  (s) =>
                    `${SECTION_DISPLAY_LABEL[s]} ${SECTION_IMAGE_SPEC[s].size}`,
                ).join(" · ")}
                . JPG, PNG or WebP up to {MAX_IMAGE_UPLOAD_MB} MB.
              </p>
            ) : (
              <p className="mt-1.5 text-[11px] text-slate-500">
                {imageHint(SECTION_IMAGE_SPEC[sectionValue])}
              </p>
            )}
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
              <label
                htmlFor="linksToProduct"
                className="text-xs font-bold text-slate-700 cursor-pointer"
              >
                Link straight to one product
              </label>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Off by default: tapping the section opens its product list. Turn
              on to send shoppers to a single product page instead.
            </p>
            {linksToProduct && (
              <ProductPicker value={productId} onChange={setProductId} />
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
            <label
              htmlFor="placementIsActive"
              className="text-xs font-bold text-slate-700 cursor-pointer"
            >
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
            {saveMutation.isPending
              ? "Saving..."
              : isEdit
                ? "Save Section"
                : "Create Section"}
          </button>
        </div>
      </div>
    </div>
  );
}
