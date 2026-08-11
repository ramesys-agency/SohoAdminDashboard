import { getFullImageUrl } from "../../../lib/imageUrl";
import { PageSection, type CanvasProps } from "../types";
import { useDragReorder } from "./useDragReorder";

export default function OffersCanvas({
  placements,
  onEdit,
  onAdd,
  onDelete,
  onProducts,
  onReorder,
}: CanvasProps) {
  const { dragProps, dropIndicatorClass } = useDragReorder(placements, onReorder);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden font-['Urbanist',sans-serif]">
      {/* SubHeader matching React Native SubHeader.tsx */}
      <div className="bg-white px-5 pt-2 pb-3 flex items-center justify-between sticky top-0 z-20 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-900 text-2xl">arrow_back</span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Offers</h1>
        </div>
        <div className="w-6" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 space-y-6 hide-scrollbar">
        {placements.map((placement, index) => {
          const img = getFullImageUrl(placement.imageUrl);
          return (
            <div
              key={placement.id}
              {...dragProps(index)}
              className={`relative w-full h-[400px] rounded-3xl overflow-hidden shadow-lg bg-slate-900 group cursor-grab active:cursor-grabbing border border-slate-100 transition-all ${dropIndicatorClass(index)}`}
            >
              {img ? (
                <img
                  src={img}
                  alt={placement.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <span className="text-white font-sans font-extrabold text-2xl tracking-wider uppercase">
                    {placement.name}
                  </span>
                </div>
              )}

              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-slate-900/90 to-transparent">
                <h3 className="text-white font-['Playfair_Display',serif] text-lg">
                  {placement.name}
                </h3>
                {placement.description && (
                  <p className="text-slate-200 text-[11px] leading-relaxed line-clamp-2">
                    {placement.description}
                  </p>
                )}
              </div>

              {!placement.isActive && (
                <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[9px] font-bold uppercase tracking-wider">
                  Hidden
                </span>
              )}

              <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 backdrop-blur-xs z-20">
                <button
                  onClick={() => onEdit(placement)}
                  className="px-3.5 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Edit Offer
                </button>
                <button
                  onClick={() => onProducts(placement)}
                  className="px-3.5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                  {placement.productCount} Products
                </button>
                <button
                  onClick={() => onDelete(placement)}
                  className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          );
        })}

        <div
          onClick={() => onAdd(PageSection.GRID_SECTION)}
          className="p-4 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-amber-600 transition-all cursor-pointer bg-white/60 hover:bg-white"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span className="text-xs font-bold">+ Add Offer Card</span>
        </div>
      </div>
    </div>
  );
}
