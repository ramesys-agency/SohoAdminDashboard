import { useQuery } from "@tanstack/react-query";
import type { Placement } from "../../../api/placements";
import { getProducts, type ApiProduct } from "../../../api/products";
import { getFullImageUrl } from "../../../lib/imageUrl";
import { PageSection, type CanvasProps } from "../types";
import { useDragReorder } from "./useDragReorder";

/**
 * Mirrors the app's home screen exactly: hero carousel, then the Best Sellers
 * product grid, then four promo sections. The app picks each promo's layout by
 * position rather than by section type, so this canvas does the same — what you
 * drag here is what the app shows, including which sections fall off the end.
 */

/** The four layouts the app cycles through, in order. */
const PROMO_VARIANTS = ["large", "collage", "side", "horizontal"] as const;
type PromoVariant = (typeof PROMO_VARIANTS)[number];

const VARIANT_LABEL: Record<PromoVariant, string> = {
  large: "Large (full-width portrait)",
  collage: "Collage (cover + 2 products)",
  side: "Side Image",
  horizontal: "Horizontal Banner",
};

/** The app renders only this many promo sections. */
const PROMO_LIMIT = 4;

const isBestSellers = (placement: Placement) => /best\s*-?\s*sell/i.test(placement.name);

export default function HomeCanvas({
  placements,
  onEdit,
  onAdd,
  onDelete,
  onProducts,
  onReorder,
}: CanvasProps) {
  const heroes = placements.filter((p) => p.section === PageSection.HERO);
  const sections = placements.filter((p) => p.section !== PageSection.HERO);

  // Best Sellers is lifted out of the promo flow — the app always draws it
  // directly under the hero, as its own product grid.
  const bestSellers = sections.find(isBestSellers);
  const bestSellersIndex = sections.findIndex(isBestSellers);
  const promos = sections.filter((p) => p.id !== bestSellers?.id);

  const { dragProps, dropIndicatorClass } = useDragReorder(promos, (ordered) => {
    // Heroes keep the top; Best Sellers keeps its slot so dragging promos
    // around never rewrites its order.
    const next = [...ordered];
    if (bestSellers) next.splice(Math.min(bestSellersIndex, next.length), 0, bestSellers);
    onReorder([...heroes, ...next]);
  });

  // The same call the app makes: curated products when a Best Sellers
  // placement exists, most-reviewed products as the fallback.
  const { data: bestSellerProducts = [] } = useQuery({
    queryKey: ["home-best-sellers-preview", bestSellers?.id ?? "popular"],
    queryFn: async () => {
      const res = (await getProducts(
        bestSellers ? { placementId: bestSellers.id, limit: 2 } : { sortBy: "popularity", limit: 2 },
      )) as unknown as { data?: ApiProduct[]; products?: ApiProduct[] };
      return (res.products ?? res.data ?? []).slice(0, 2);
    },
  });

  const HoverActions = ({ placement }: { placement: Placement }) => (
    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 rounded-xl backdrop-blur-xs z-20">
      <button
        onClick={() => onEdit(placement)}
        className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[14px]">edit</span>
        Edit
      </button>
      <button
        onClick={() => onProducts(placement)}
        className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[14px]">inventory_2</span>
        {placement.productCount}
      </button>
      <button
        onClick={() => onDelete(placement)}
        className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md cursor-pointer"
      >
        <span className="material-symbols-outlined text-[14px]">delete</span>
      </button>
    </div>
  );

  const InactiveTag = ({ placement }: { placement: Placement }) =>
    placement.isActive ? null : (
      <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[9px] font-bold uppercase tracking-wider">
        Hidden
      </span>
    );

  /** One promo section, drawn in the layout its position maps to. */
  const SectionBody = ({
    placement,
    variant,
  }: {
    placement: Placement;
    variant: PromoVariant;
  }) => {
    const img = getFullImageUrl(placement.imageUrl);
    const [firstProduct, secondProduct] = placement.previewImages.map(getFullImageUrl);

    const Title = () => (
      <div className="space-y-1">
        <h2 className="font-['Playfair_Display',serif] text-xl text-slate-900 font-normal leading-tight">
          {placement.name}
        </h2>
        {placement.description && (
          <p className="text-slate-500 text-xs leading-relaxed">{placement.description}</p>
        )}
      </div>
    );

    switch (variant) {
      case "large":
        return (
          <div className="space-y-2.5">
            <div className="w-full h-[340px] overflow-hidden bg-slate-100 rounded-sm">
              {img && <img src={img} alt={placement.name} className="w-full h-full object-cover" />}
            </div>
            <Title />
          </div>
        );

      case "collage":
        return (
          <div className="flex gap-3 items-start">
            <div className="w-[140px] h-[200px] rounded-xs overflow-hidden bg-slate-100 flex-shrink-0">
              {img && <img src={img} alt={placement.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 space-y-1.5 pt-2">
              <div className="flex gap-1.5">
                {[firstProduct, secondProduct].map((src, i) =>
                  src ? (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-[52px] h-[68px] object-cover rounded-xs bg-slate-100"
                    />
                  ) : null,
                )}
              </div>
              <Title />
            </div>
          </div>
        );

      case "side":
        return (
          <div className="flex gap-3 items-start">
            <div className="flex-1 space-y-1.5 pt-2">
              <Title />
            </div>
            <div className="w-[140px] h-[200px] rounded-xs overflow-hidden bg-slate-100 flex-shrink-0">
              {img && <img src={img} alt={placement.name} className="w-full h-full object-cover" />}
            </div>
          </div>
        );

      // horizontal — wide landscape image with the copy underneath
      default:
        return (
          <div className="space-y-2.5">
            <div className="w-full h-[190px] rounded-xs overflow-hidden bg-slate-100">
              {img && <img src={img} alt={placement.name} className="w-full h-full object-cover" />}
            </div>
            <Title />
          </div>
        );
    }
  };

  /** The two-up product grid the app draws under its Best Sellers heading. */
  const BestSellersGrid = () => (
    <div className="px-4 space-y-2.5">
      <div className="flex items-end justify-between">
        <h2 className="font-['Playfair_Display',serif] text-3xl font-normal text-slate-900 leading-none">
          {bestSellers?.name ?? "Best Sellers"}
        </h2>
        {bestSellers && (
          <span className="text-[11px] text-slate-400 font-semibold pb-1">See All &gt;&gt;</span>
        )}
      </div>

      <div className="relative group grid grid-cols-2 gap-4">
        {bestSellerProducts.map((product) => {
          const img = getFullImageUrl(product.primaryImage);
          return (
            <div key={product.id} className="space-y-1.5">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-100">
                {img && <img src={img} alt={product.name} className="w-full h-full object-cover" />}
                <span className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[15px] text-slate-900">
                    favorite
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-slate-900 truncate">{product.name}</span>
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-slate-900">
                  {product.rating ?? 0}
                  <span className="material-symbols-outlined text-[12px] text-amber-400">star</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900">Price</span>
                <span className="text-base font-bold text-slate-900">৳ {product.price}</span>
              </div>
            </div>
          );
        })}

        {bestSellerProducts.length === 0 && (
          <div className="col-span-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center text-[11px] font-semibold text-slate-500">
            No products to show yet
          </div>
        )}

        {bestSellers && <HoverActions placement={bestSellers} />}
      </div>

      {!bestSellers && (
        <p className="text-[10px] leading-snug text-slate-400">
          Showing the most-reviewed products. Add a section named “Best Sellers” to curate this grid
          yourself.
        </p>
      )}
    </div>
  );

  return (
    <>
      {/* TopNavBar Header */}
      <div className="bg-white px-5 pt-1 pb-2 flex items-center justify-between sticky top-0 z-20 border-b border-slate-50">
        <div className="w-10" />
        <div className="flex-1 flex justify-center items-center py-1">
          <img
            src="/soho.png"
            alt="Soho"
            className="h-9 object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        </div>
        <div className="flex items-center gap-3 text-slate-900">
          <span className="material-symbols-outlined text-xl font-light">search</span>
          <span className="material-symbols-outlined text-xl font-light">notifications</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 hide-scrollbar space-y-7 font-['Urbanist',sans-serif]">
        {/* HERO carousel */}
        <div className="px-4 space-y-2.5 pt-3">
          <div className="flex items-center justify-between">
            <h2 className="font-['Playfair_Display',serif] text-xl font-normal text-slate-900">
              See All
            </h2>
            <span className="text-[11px] text-slate-400 font-semibold">See All &gt;&gt;</span>
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {heroes.map((hero) => {
              const img = getFullImageUrl(hero.imageUrl);
              return (
                <div
                  key={hero.id}
                  className="relative w-[280px] h-[180px] rounded-[20px] overflow-hidden bg-[#27272A] flex items-center justify-center shadow-xs group flex-shrink-0"
                >
                  <InactiveTag placement={hero} />
                  {img ? (
                    <img src={img} alt={hero.name} className="w-full h-full object-cover" />
                  ) : (
                    <h3 className="text-white font-sans text-lg font-bold tracking-wider uppercase px-4 text-center">
                      {hero.name}
                    </h3>
                  )}
                  <HoverActions placement={hero} />
                </div>
              );
            })}

            <div
              onClick={() => onAdd(PageSection.HERO)}
              className="w-[280px] h-[180px] rounded-[20px] border-2 border-dashed border-slate-300 hover:border-slate-900 bg-slate-50 hover:bg-white flex flex-col items-center justify-center gap-2 cursor-pointer transition-all flex-shrink-0 text-slate-500 hover:text-slate-900"
            >
              <span className="material-symbols-outlined text-2xl">add</span>
              <span className="text-xs font-bold">+ Add Hero Slide</span>
            </div>
          </div>
        </div>

        {/* Best Sellers product grid */}
        <BestSellersGrid />

        {/* Promo sections — drag to reorder; position decides the layout */}
        <div className="space-y-6">
          {promos.map((placement, index) => {
            const beyondLimit = index >= PROMO_LIMIT;
            const variant = PROMO_VARIANTS[index % PROMO_VARIANTS.length];

            return (
              <div
                key={placement.id}
                {...dragProps(index)}
                className={`relative group px-4 space-y-2.5 cursor-grab active:cursor-grabbing transition-all ${dropIndicatorClass(index)} ${
                  beyondLimit ? "opacity-40" : ""
                }`}
              >
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="material-symbols-outlined text-[13px]">drag_indicator</span>
                  {beyondLimit ? (
                    <span className="text-amber-600">
                      Not shown on the app — only the first {PROMO_LIMIT} sections render
                    </span>
                  ) : (
                    VARIANT_LABEL[variant]
                  )}
                </div>
                <InactiveTag placement={placement} />
                <SectionBody placement={placement} variant={variant} />
                <HoverActions placement={placement} />
              </div>
            );
          })}

          {/* Layout follows position now, so the section picked here only
              decides where a new card starts in the order. */}
          <div className="px-4">
            <div
              onClick={() => onAdd(PageSection.FEATURED_ROW)}
              className="p-4 border-2 border-dashed border-slate-300 hover:border-primary rounded-xl flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-primary transition-all cursor-pointer bg-white/60 hover:bg-white text-center"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span className="text-[11px] font-bold leading-tight">+ Add Section</span>
              <span className="text-[10px] text-slate-400 leading-snug">
                Layout is decided by position: {PROMO_VARIANTS.map((v) => VARIANT_LABEL[v].split(" (")[0]).join(" → ")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
