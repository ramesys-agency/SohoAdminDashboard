import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../../api/categories";
import type { Placement } from "../../../api/placements";
import { getFullImageUrl } from "../../../lib/imageUrl";
import { AppPage, PageSection, type CanvasProps } from "../types";
import { useDragReorder } from "./useDragReorder";

interface CatalogCanvasProps extends CanvasProps {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
}

export default function CatalogCanvas({
  activePage,
  setActivePage,
  placements,
  onEdit,
  onAdd,
  onDelete,
  onProducts,
  onReorder,
}: CatalogCanvasProps) {
  const currentGender = activePage; // "WOMEN" | "MEN" | "KIDS"

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const bannerCarouselRef = useRef<HTMLDivElement | null>(null);

  const scrollToSlide = (index: number) => {
    setActiveBannerIndex(index);
    if (bannerCarouselRef.current) {
      const slideWidth = 312; // 300px card width + 12px (gap-3)
      bannerCarouselRef.current.scrollTo({ left: index * slideWidth, behavior: "smooth" });
    }
  };

  const handleCarouselScroll = () => {
    if (!bannerCarouselRef.current) return;
    const index = Math.round(bannerCarouselRef.current.scrollLeft / 312);
    if (index !== activeBannerIndex) setActiveBannerIndex(index);
  };

  // Fetch Categories for Active Gender Tab, matching mobile categoryApi.getCategories
  const { data: categoryResponse } = useQuery({
    queryKey: ["categories-catalog-gender", currentGender],
    queryFn: async () => {
      const res = await getCategories({ isActive: true, gender: currentGender });
      return res?.data || res || [];
    },
  });

  const categories = Array.isArray(categoryResponse) ? categoryResponse : [];

  const bannerPlacements = placements.filter(
    (p) => p.section === PageSection.HERO || p.section === PageSection.FEATURED_ROW,
  );
  const gridPlacements = placements.filter((p) => p.section === PageSection.GRID_SECTION);

  const { dragProps, dropIndicatorClass } = useDragReorder(gridPlacements, (ordered) =>
    onReorder([...bannerPlacements, ...ordered]),
  );

  const HoverActions = ({
    placement,
    stacked = false,
  }: {
    placement: Placement;
    stacked?: boolean;
  }) => (
    <div
      className={`absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex ${
        stacked ? "flex-col" : ""
      } items-center justify-center gap-2 p-3 backdrop-blur-xs z-20`}
    >
      <button
        onClick={() => onEdit(placement)}
        className={`${stacked ? "w-full py-1.5" : "px-3 py-1.5"} bg-white text-slate-900 rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-1 cursor-pointer`}
      >
        <span className="material-symbols-outlined text-[14px]">edit</span>
        Edit
      </button>
      <button
        onClick={() => onProducts(placement)}
        className={`${stacked ? "w-full py-1.5" : "px-3 py-1.5"} bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 shadow-md flex items-center justify-center gap-1 cursor-pointer`}
      >
        <span className="material-symbols-outlined text-[14px]">inventory_2</span>
        {placement.productCount}
      </button>
      <button
        onClick={() => onDelete(placement)}
        className={`${stacked ? "w-full py-1.5" : "p-1.5"} bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md flex items-center justify-center gap-1 cursor-pointer`}
      >
        <span className="material-symbols-outlined text-[14px]">delete</span>
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden font-['Urbanist',sans-serif]">
      {/* Top Mobile Header */}
      <div className="bg-white px-5 pt-2 pb-2 flex items-center justify-between sticky top-0 z-20 border-b border-slate-100">
        <h1 className="text-2xl font-['Playfair_Display',serif] font-normal text-slate-900 tracking-tight">
          Catalog
        </h1>
        <div className="flex items-center gap-4 text-slate-900">
          <span className="material-symbols-outlined text-2xl font-light">search</span>
          <span className="material-symbols-outlined text-2xl font-light">notifications</span>
        </div>
      </div>

      {/* Gender Tabs */}
      <div className="px-4 py-2 bg-white z-10 border-b border-slate-50">
        <div className="bg-[#F3F3F3] p-1 rounded-2xl flex items-center h-11 border border-slate-200/50">
          {(
            [
              [AppPage.CATALOG_WOMEN, "Women"],
              [AppPage.CATALOG_MEN, "Men"],
              [AppPage.CATALOG_KIDS, "Kids"],
            ] as const
          ).map(([page, label]) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`flex-1 h-full rounded-xl text-xs font-semibold transition-all ${
                currentGender === page
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 space-y-5 hide-scrollbar">
        {/* 1. Sub-Categories Circle Row */}
        <div className="flex items-center gap-4 overflow-x-auto py-2 hide-scrollbar">
          {categories.map((item: { id: string; name: string; imageUrl?: string }) => {
            const circleImg = getFullImageUrl(item.imageUrl);
            const circleColor = currentGender === AppPage.CATALOG_WOMEN ? "bg-[#C2185B]" : "bg-[#1E293B]";
            return (
              <div key={item.id} className="flex flex-col items-center flex-shrink-0 group">
                <div
                  className={`w-14 h-14 rounded-full overflow-hidden mb-1.5 ${circleColor} p-0.5 shadow-xs border border-slate-100 flex items-center justify-center text-center`}
                >
                  {circleImg ? (
                    <img
                      src={circleImg}
                      alt={item.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-[9px] font-bold text-white uppercase px-1 leading-tight line-clamp-2">
                      {item.name}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-slate-700 text-center">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* 2. Banner Carousel (HERO + FEATURED_ROW) */}
        <div className="space-y-3">
          <div
            ref={bannerCarouselRef}
            onScroll={handleCarouselScroll}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-1 pt-1 scroll-smooth"
          >
            {bannerPlacements.map((placement) => {
              const bannerImg = getFullImageUrl(placement.imageUrl);
              return (
                <div
                  key={placement.id}
                  className="relative w-[300px] h-[185px] rounded-3xl overflow-hidden shadow-md bg-slate-900 group border border-slate-100 flex-shrink-0 snap-center"
                >
                  {bannerImg ? (
                    <img
                      src={bannerImg}
                      alt={placement.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-center">
                      <span className="text-white font-sans font-extrabold text-lg tracking-wider uppercase">
                        {placement.name}
                      </span>
                    </div>
                  )}
                  {!placement.isActive && (
                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[9px] font-bold uppercase">
                      Hidden
                    </span>
                  )}
                  <HoverActions placement={placement} />
                </div>
              );
            })}

            <div
              onClick={() => onAdd(PageSection.HERO)}
              className="w-[300px] h-[185px] rounded-3xl border-2 border-dashed border-slate-300 hover:border-slate-900 bg-slate-50 hover:bg-white flex flex-col items-center justify-center gap-2 cursor-pointer transition-all flex-shrink-0 snap-center text-slate-500 hover:text-slate-900 shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-slate-700">add</span>
              </div>
              <span className="text-xs font-bold text-center px-4">+ Add Banner</span>
            </div>
          </div>

          <div className="flex justify-center gap-1.5 pt-0.5">
            {Array.from({ length: bannerPlacements.length + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeBannerIndex === idx ? "w-7 bg-slate-800" : "w-2 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* 3. 2-Column Grid (GRID_SECTION) — drag to reorder */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {gridPlacements.map((placement, index) => {
            const img = getFullImageUrl(placement.imageUrl);
            return (
              <div
                key={placement.id}
                {...dragProps(index)}
                className={`flex flex-col space-y-1.5 group cursor-grab active:cursor-grabbing transition-all ${dropIndicatorClass(index)}`}
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#2D2D2D] shadow-sm border border-slate-100 flex items-center justify-center p-4 text-center">
                  {img ? (
                    <img
                      src={img}
                      alt={placement.name}
                      className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="relative z-10 text-white font-sans font-extrabold text-lg tracking-wider uppercase leading-snug drop-shadow-md">
                      {placement.name}
                    </span>
                  )}
                  {!placement.isActive && (
                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-slate-900/80 text-white text-[9px] font-bold uppercase">
                      Hidden
                    </span>
                  )}
                  <HoverActions placement={placement} stacked />
                </div>

                <span className="font-['Playfair_Display',serif] text-base font-normal text-slate-900 pl-0.5 truncate">
                  {placement.name}
                </span>
              </div>
            );
          })}

          {/* Add New Grid Card */}
          <div
            onClick={() => onAdd(PageSection.GRID_SECTION)}
            className="flex flex-col space-y-1.5 cursor-pointer group"
          >
            <div className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-900 bg-slate-50 hover:bg-white flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-900 transition-all p-4 text-center shadow-xs">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-slate-700">add</span>
              </div>
              <span className="text-xs font-bold leading-snug">+ Add Grid Card</span>
            </div>
            <span className="font-['Playfair_Display',serif] text-sm font-medium text-slate-400 pl-0.5">
              New Grid Item
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
