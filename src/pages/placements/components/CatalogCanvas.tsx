import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCollections, type Collection, type CollectionPlacement } from "../../../api/collections";
import { getCategories } from "../../../api/categories";
import { AppPage } from "../types";
import ConfirmModal from "../../../components/ui/ConfirmModal";

interface CatalogCanvasProps {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  collections?: Collection[];
  getFullImageUrl: (url?: string | null) => string;
  openEditPlacement: (placement: CollectionPlacement) => void;
  deletePlacementMutation: any;
  setIsAddingPlacement: (val: boolean) => void;
  setEditingPlacement: (placement: CollectionPlacement | null) => void;
  setPlacementCollectionId: (id: string) => void;
  onNavigateToProducts: (placementId: string, collectionName: string) => void;
}

export default function CatalogCanvas({
  activePage,
  setActivePage,
  collections: initialCollections = [],
  getFullImageUrl,
  openEditPlacement,
  deletePlacementMutation,
  setIsAddingPlacement,
  setEditingPlacement,
  setPlacementCollectionId,
  onNavigateToProducts,
}: CatalogCanvasProps) {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const currentGender = activePage.startsWith("CATALOG")
    ? activePage.replace("CATALOG_", "")
    : activePage; // "WOMEN" | "MEN" | "KIDS"

  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const bannerCarouselRef = useRef<HTMLDivElement | null>(null);

  const scrollToSlide = (index: number) => {
    setActiveBannerIndex(index);
    if (bannerCarouselRef.current) {
      const slideWidth = 312; // 300px card width + 12px (gap-3)
      bannerCarouselRef.current.scrollTo({
        left: index * slideWidth,
        behavior: "smooth",
      });
    }
  };

  const handleCarouselScroll = () => {
    if (bannerCarouselRef.current) {
      const scrollLeft = bannerCarouselRef.current.scrollLeft;
      const slideWidth = 312;
      const index = Math.round(scrollLeft / slideWidth);
      if (index !== activeBannerIndex) {
        setActiveBannerIndex(index);
      }
    }
  };

  // 1. Fetch Categories for Active Gender Tab matching mobile categoryApi.getCategories
  const { data: categoryResponse } = useQuery({
    queryKey: ["categories-catalog-gender", currentGender],
    queryFn: async () => {
      const res = await getCategories({ isActive: true, gender: currentGender });
      return res?.data || res || [];
    },
  });

  const categories = Array.isArray(categoryResponse) ? categoryResponse : [];

  // Default Fallback Categories for visual match if backend has none yet
  const fallbackCategories = [
    { id: "c1", name: "Accessories", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=300" },
    { id: "c2", name: "Dresses", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=300" },
    { id: "c3", name: "Jackets", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=300" },
    { id: "c4", name: "Jeans", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=300" },
    { id: "c5", name: "Shirts", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=300" },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  // 2. Fetch Collections / Placements for Active Gender Page
  const { data: collectionsData } = useQuery({
    queryKey: ["collections-catalog-page", currentGender],
    queryFn: async () => {
      const res = await getCollections(1, 100, undefined, currentGender);
      return res?.data || [];
    },
  });

  const activeCollections =
    collectionsData && collectionsData.length > 0
      ? collectionsData
      : initialCollections.filter((c) =>
          c.collectionPlacements?.some((p) => p.page === currentGender)
        );

  // Extract FEATURED_ROW (Carousels) and GRID_SECTION (2-Column Grid)
  const featuredRowPlacements = activeCollections.flatMap((c) =>
    (c.collectionPlacements || [])
      .filter((p) => p.page === currentGender && p.section === "FEATURED_ROW")
      .map((p) => ({ placement: p, collection: c }))
  );

  const gridSectionPlacements = activeCollections.flatMap((c) =>
    (c.collectionPlacements || [])
      .filter((p) => p.page === currentGender && p.section === "GRID_SECTION")
      .map((p) => ({ placement: p, collection: c }))
  );

  // Default Grid Items if no placement configured yet (Matches user screenshots)
  const defaultGridItems =
    currentGender === "MEN"
      ? [
          { id: "d1", title: "LIMITED", subtitle: "Limited Edition", bannerText: "LIMITED" },
          { id: "d2", title: "EVERYDAY", subtitle: "Everyday Essentials", bannerText: "EVERYDAY" },
          { id: "d3", title: "BUDGET BUYS", subtitle: "Budget Buys", bannerText: "BUDGET BUYS" },
          { id: "d4", title: "TRENDING", subtitle: "Trending Now", bannerText: "TRENDING" },
          { id: "d5", title: "NEW ARRIVALS", subtitle: "New Arrivals", bannerText: "NEW ARRIVALS" },
          { id: "d6", title: "BEST SELLERS", subtitle: "Best Sellers", bannerText: "BEST SELLERS" },
        ]
      : [
          { id: "d1", title: "TRENDING", subtitle: "Trending Now", bannerText: "TRENDING" },
          { id: "d2", title: "SUMMER SALE", subtitle: "Summer Sale 2024", bannerText: "SUMMER SALE" },
          { id: "d3", title: "NEW ARRIVALS", subtitle: "New Arrivals", bannerText: "NEW ARRIVALS" },
          { id: "d4", title: "BEST SELLERS", subtitle: "Best Sellers", bannerText: "BEST SELLERS" },
          { id: "d5", title: "LIMITED", subtitle: "Limited Edition", bannerText: "LIMITED" },
          { id: "d6", title: "EVERYDAY", subtitle: "Everyday Essentials", bannerText: "EVERYDAY" },
        ];

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden font-['Urbanist',sans-serif]">
      {/* Top Mobile Header: Catalog Title & Actions */}
      <div className="bg-white px-5 pt-2 pb-2 flex items-center justify-between sticky top-0 z-20 border-b border-slate-100">
        <h1 className="text-2xl font-['Playfair_Display',serif] font-normal text-slate-900 tracking-tight">
          Catalog
        </h1>
        <div className="flex items-center gap-4 text-slate-900">
          <span className="material-symbols-outlined text-2xl font-light cursor-pointer">
            search
          </span>
          <span className="material-symbols-outlined text-2xl font-light cursor-pointer">
            notifications
          </span>
        </div>
      </div>

      {/* Segmented Control / Gender Tabs (Women | Men | Kids) */}
      <div className="px-4 py-2 bg-white z-10 border-b border-slate-50">
        <div className="bg-[#F3F3F3] p-1 rounded-2xl flex items-center h-11 border border-slate-200/50">
          <button
            onClick={() => setActivePage(AppPage.CATALOG_WOMEN)}
            className={`flex-1 h-full rounded-xl text-xs font-semibold transition-all ${
              currentGender === "WOMEN"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            Women
          </button>
          <button
            onClick={() => setActivePage(AppPage.CATALOG_MEN)}
            className={`flex-1 h-full rounded-xl text-xs font-semibold transition-all ${
              currentGender === "MEN"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            Men
          </button>
          <button
            onClick={() => setActivePage(AppPage.CATALOG_KIDS)}
            className={`flex-1 h-full rounded-xl text-xs font-semibold transition-all ${
              currentGender === "KIDS"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            Kids
          </button>
        </div>
      </div>

      {/* Scrollable Screen Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 space-y-5 hide-scrollbar">
        {/* 1. Horizontal Sub-Categories Circle Row */}
        <div className="flex items-center gap-4 overflow-x-auto py-2 hide-scrollbar">
          {displayCategories.map((item: any) => {
            const circleImg = getFullImageUrl(item.imageUrl || item.image);
            const circleColor = currentGender === "WOMEN" ? "bg-[#C2185B]" : "bg-[#1E293B]";
            return (
              <div
                key={item.id}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-full overflow-hidden mb-1.5 ${circleColor} p-0.5 shadow-xs transition-transform group-hover:scale-105 border border-slate-100 flex items-center justify-center text-center`}>
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
                <span className="text-[11px] font-medium text-slate-700 text-center font-['Urbanist',sans-serif]">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* 2. Promotional Banner Carousel (FEATURED_ROW) */}
        {(() => {
          const totalFeaturedSlides = featuredRowPlacements.length + 1; // Includes + Add Banner slide
          return (
            <div className="space-y-3">
              <div
                ref={bannerCarouselRef}
                onScroll={handleCarouselScroll}
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-1 pt-1 scroll-smooth"
              >
                {featuredRowPlacements.map(({ placement, collection }, idx) => {
                  const bannerImg = getFullImageUrl(placement.imageUrl);
                  return (
                    <div
                      key={placement.id || idx}
                      className="relative w-[300px] h-[185px] rounded-3xl overflow-hidden shadow-md bg-slate-900 group border border-slate-100 flex-shrink-0 snap-center"
                    >
                      <img
                        src={
                          bannerImg ||
                          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800"
                        }
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Hover Action Controls */}
                      <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 backdrop-blur-xs">
                        <button
                          onClick={() => openEditPlacement(placement)}
                          className="px-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-md flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          Edit Banner
                        </button>
                        <button
                          onClick={() =>
                            onNavigateToProducts(
                              placement.id,
                              collection.name
                            )
                          }
                          className="px-3 py-1.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 shadow-md flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                          Products
                        </button>
                        <button
                          onClick={() =>
                            setDeleteTarget({ id: placement.id, title: collection.name })
                          }
                          className="p-1.5 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-md"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Carousel Slide: + Add New Banner Option (Same width w-[300px]) */}
                <div
                  onClick={() => {
                    setEditingPlacement(null);
                    setPlacementCollectionId("");
                    setIsAddingPlacement(true);
                  }}
                  className="w-[300px] h-[185px] rounded-3xl border-2 border-dashed border-slate-300 hover:border-slate-900 bg-slate-50 hover:bg-white flex flex-col items-center justify-center gap-2 cursor-pointer transition-all flex-shrink-0 snap-center text-slate-500 hover:text-slate-900 shadow-xs"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-slate-700">add</span>
                  </div>
                  <span className="text-xs font-bold text-center px-4">+ Add Featured Banner</span>
                </div>
              </div>

              {/* Interactive Pagination Dots */}
              <div className="flex justify-center gap-1.5 pt-0.5">
                {Array.from({ length: totalFeaturedSlides }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeBannerIndex === idx
                        ? "w-7 bg-slate-800"
                        : "w-2 bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })()}

        {/* 3. 2-Column Collection Grid (GRID_SECTION) */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {gridSectionPlacements.length > 0
            ? gridSectionPlacements.map(({ placement, collection }) => {
                const img = getFullImageUrl(placement.imageUrl);
                return (
                  <div
                    key={placement.id}
                    className="flex flex-col space-y-1.5 group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#2D2D2D] shadow-sm border border-slate-100 flex items-center justify-center p-4 text-center">
                      {img ? (
                        <img
                          src={img}
                          alt={collection.name}
                          className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="relative z-10 text-white font-sans font-extrabold text-lg tracking-wider uppercase leading-snug drop-shadow-md">
                          {collection.name}
                        </span>
                      )}

                      {/* Hover Overlay Controls */}
                      <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 backdrop-blur-xs z-20">
                        <button
                          onClick={() => openEditPlacement(placement)}
                          className="w-full py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-md flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          Edit Card
                        </button>
                        <button
                          onClick={() =>
                            onNavigateToProducts(placement.id, collection.name)
                          }
                          className="w-full py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 shadow-md flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                          Products
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: placement.id, title: collection.name })}
                          className="w-full py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                          Delete
                        </button>
                      </div>
                    </div>

                    <span className="font-['Playfair_Display',serif] text-base font-normal text-slate-900 pl-0.5">
                      {collection.name}
                    </span>
                  </div>
                );
              })
            : defaultGridItems.map((item) => (
                <div key={item.id} className="flex flex-col space-y-1.5 group cursor-pointer">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#2C2C2E] shadow-sm border border-slate-100 flex items-center justify-center p-4 text-center">
                    <span className="text-white font-sans font-extrabold text-lg tracking-wider uppercase leading-snug">
                      {item.bannerText}
                    </span>

                    {/* Hover Quick Add Control */}
                    <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 backdrop-blur-xs">
                      <button
                        onClick={() => {
                          setEditingPlacement(null);
                          setPlacementCollectionId("");
                          setIsAddingPlacement(true);
                        }}
                        className="w-full py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Map Collection
                      </button>
                    </div>
                  </div>

                  <span className="font-['Playfair_Display',serif] text-base font-normal text-slate-900 pl-0.5">
                    {item.subtitle}
                  </span>
                </div>
              ))}

          {/* Add New Option in Grid Section in Same Layout (3:4 aspect ratio) */}
          <div
            onClick={() => {
              setEditingPlacement(null);
              setPlacementCollectionId("");
              setIsAddingPlacement(true);
            }}
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

        {/* Add Placement Quick Action */}
        <div
          onClick={() => {
            setEditingPlacement(null);
            setPlacementCollectionId("");
            setIsAddingPlacement(true);
          }}
          className="p-4 border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 transition-all cursor-pointer bg-white/60 hover:bg-white"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span className="text-xs font-bold">+ Add Placement to Catalog ({currentGender})</span>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deletePlacementMutation.mutate(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        isLoading={deletePlacementMutation.isPending}
        title="Delete Catalog Placement"
        message={
          <>
            Are you sure you want to delete placement for{" "}
            <span className="font-semibold text-slate-900">
              &ldquo;{deleteTarget?.title}&rdquo;
            </span>
            ?
          </>
        }
      />
    </div>
  );
}
