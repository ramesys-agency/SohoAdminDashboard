import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import OffersCanvas from "./OffersCanvas";
import CatalogCanvas from "./CatalogCanvas";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import {
  getCollections,
  type Collection,
  type CollectionPlacement,
} from "../../../api/collections";
import {
  getHomePromos,
  deleteHomePromo,
  createHomePromo,
  updateHomePromo,
  type HomePromo,
} from "../../../api/homePromo";
import {
  deletePlacement,
  updatePlacement,
  createPlacement,
} from "../../../api/placements";
import { getProducts, type ApiProduct } from "../../../api/products";
import { AppPage, PAGE_DISPLAY_LABEL, SECTION_GUIDANCE_MAP, PageSection } from "../types";

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

  const [editingPlacement, setEditingPlacement] = useState<CollectionPlacement | null>(null);
  const [editingPromo, setEditingPromo] = useState<HomePromo | null>(null);
  const [deletePromoTarget, setDeletePromoTarget] = useState<HomePromo | null>(null);
  const [isAddingPlacement, setIsAddingPlacement] = useState(false);
  const [isAddingPromo, setIsAddingPromo] = useState(false);

  // Form states for Placement modal
  const [placementCollectionId, setPlacementCollectionId] = useState("");
  const [placementSection, setPlacementSection] = useState<string>("HERO");
  const [placementImageFile, setPlacementImageFile] = useState<File | null>(null);
  const [placementImageUrl, setPlacementImageUrl] = useState("");
  const [placementIsActive, setPlacementIsActive] = useState(true);

  // Form states for Home Promo modal
  const [promoTitle, setPromoTitle] = useState("");
  const [promoDescription, setPromoDescription] = useState("");
  const [promoContentType, setPromoContentType] = useState<"PRODUCT" | "COLLECTION">("COLLECTION");
  const [promoProductId, setPromoProductId] = useState("");
  const [promoCollectionId, setPromoCollectionId] = useState("");
  const [promoImageFile, setPromoImageFile] = useState<File | null>(null);
  const [promoImageUrl, setPromoImageUrl] = useState("");
  const [promoIsActive, setPromoIsActive] = useState(true);

  // --- API QUERIES MATCHING SOHO APPLICATION ---

  // 1. Fetch Collections / Placements for Active Page
  const { data: collectionsData } = useQuery({
    queryKey: ["collections-canvas", activePage],
    queryFn: () => getCollections(1, 100, undefined, activePage),
  });

  // 2. Fetch Active Home Promos
  const { data: promosResponse } = useQuery({
    queryKey: ["home-promos-active"],
    queryFn: () => getHomePromos(true),
  });

  // 3. Fetch Best Sellers Products
  const { data: bestSellersData } = useQuery({
    queryKey: ["best-sellers-canvas"],
    queryFn: () => getProducts({ limit: 2 }),
  });

  // 4. Fetch All Products for Promo Target Dropdown
  const { data: allProductsData } = useQuery({
    queryKey: ["all-products-dropdown"],
    queryFn: () => getProducts({ limit: 100 }),
  });

  const getFullImageUrl = (url?: string | null) => {
    if (!url) return "";
    if (
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("blob:") ||
      url.startsWith("data:")
    ) {
      return url;
    }
    const backendBase = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
      : "http://localhost:5000";
    return `${backendBase}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const collections = collectionsData?.data || [];
  const homePromos = promosResponse?.data || [];

  const rawBestSellers = bestSellersData as any;
  const bestSellers: ApiProduct[] = Array.isArray(rawBestSellers?.products)
    ? rawBestSellers.products
    : Array.isArray(rawBestSellers?.data)
    ? rawBestSellers.data
    : Array.isArray(rawBestSellers)
    ? rawBestSellers
    : [];

  const rawAllProducts = allProductsData as any;
  const products: ApiProduct[] = Array.isArray(rawAllProducts?.products)
    ? rawAllProducts.products
    : Array.isArray(rawAllProducts?.data)
    ? rawAllProducts.data
    : Array.isArray(rawAllProducts)
    ? rawAllProducts
    : [];

  // Flatten placement rows for the active page
  const allPlacementRows = collections.flatMap(
    (col: Collection) =>
      col.collectionPlacements?.map((p) => ({
        placement: p,
        collection: col,
      })) ?? [],
  );

  const pagePlacements = allPlacementRows.filter(
    (item) => item.placement.page === activePage
  );

  const heroPlacements = pagePlacements.filter((p) => p.placement.section === "HERO");

  // Delete Placement Mutation
  const deletePlacementMutation = useMutation({
    mutationFn: (id: string) => deletePlacement(id),
    onSuccess: () => {
      toast.success("Placement deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collections-canvas"] });
    },
    onError: () => toast.error("Failed to delete placement."),
  });

  const deletePromoMutation = useMutation({
    mutationFn: (id: string) => deleteHomePromo(id),
    onSuccess: () => {
      toast.success("Homepage promotion deleted.");
      queryClient.invalidateQueries({ queryKey: ["home-promos"] });
      queryClient.invalidateQueries({ queryKey: ["home-promos-active"] });
      setDeletePromoTarget(null);
    },
    onError: () => toast.error("Failed to delete homepage promotion."),
  });





  // Save Placement Mutation
  const savePlacementMutation = useMutation({
    mutationFn: async () => {
      if (!placementCollectionId) throw new Error("Please select a collection.");
      if (editingPlacement) {
        return updatePlacement(editingPlacement.id, {
          collectionId: placementCollectionId,
          page: activePage,
          section: placementSection,
          isActive: placementIsActive,
          image: placementImageFile,
        });
      } else {
        return createPlacement({
          collectionId: placementCollectionId,
          page: activePage,
          section: placementSection,
          isBanner: placementSection !== PageSection.GRID_SECTION,
          isActive: placementIsActive,
          image: placementImageFile,
        });
      }
    },
    onSuccess: () => {
      toast.success(editingPlacement ? "Placement updated!" : "Placement created!");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collections-canvas"] });
      closeModals();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to save placement.");
    },
  });

  // Save Home Promo Mutation
  const savePromoMutation = useMutation({
    mutationFn: async () => {
      if (!promoTitle.trim()) throw new Error("Title is required.");
      if (editingPromo) {
        return updateHomePromo(editingPromo.id, {
          title: promoTitle,
          description: promoDescription,
          contentType: promoContentType,
          productId: promoContentType === "PRODUCT" ? promoProductId : null,
          collectionId: promoContentType === "COLLECTION" ? promoCollectionId : null,
          image: promoImageFile || promoImageUrl,
          isActive: promoIsActive,
        });
      } else {
        return createHomePromo({
          title: promoTitle,
          description: promoDescription,
          contentType: promoContentType,
          productId: promoContentType === "PRODUCT" ? promoProductId : null,
          collectionId: promoContentType === "COLLECTION" ? promoCollectionId : null,
          image: promoImageFile || promoImageUrl,
          isActive: promoIsActive,
        });
      }
    },
    onSuccess: () => {
      toast.success(editingPromo ? "Promotion updated!" : "Promotion created!");
      queryClient.invalidateQueries({ queryKey: ["home-promos"] });
      queryClient.invalidateQueries({ queryKey: ["home-promos-active"] });
      closeModals();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to save promotion.");
    },
  });

  const closeModals = () => {
    setEditingPlacement(null);
    setEditingPromo(null);
    setIsAddingPlacement(false);
    setIsAddingPromo(false);
    setPlacementCollectionId("");
    setPlacementSection("HERO");
    setPlacementImageFile(null);
    setPlacementImageUrl("");
    setPlacementIsActive(true);
    setPromoTitle("");
    setPromoDescription("");
    setPromoContentType("COLLECTION");
    setPromoProductId("");
    setPromoCollectionId("");
    setPromoImageFile(null);
    setPromoImageUrl("");
    setPromoIsActive(true);
  };

  const openEditPlacement = (placement: CollectionPlacement) => {
    setEditingPlacement(placement);
    setPlacementCollectionId(placement.collectionId);
    setPlacementSection(placement.section || "HERO");
    setPlacementImageUrl(placement.imageUrl || "");
    setPlacementIsActive(placement.isActive);
    setIsAddingPlacement(true);
  };

  const openEditPromo = (promo: HomePromo) => {
    setEditingPromo(promo);
    setPromoTitle(promo.title);
    setPromoDescription(promo.description || "");
    setPromoContentType(promo.contentType);
    setPromoProductId(promo.productId || "");
    setPromoCollectionId(promo.collectionId || "");
    setPromoImageUrl(promo.imageUrl || "");
    setPromoIsActive(promo.isActive);
    setIsAddingPromo(true);
  };

  const getPromoVariant = (index: number): "large" | "collage" | "side" | "horizontal" => {
    const variants: ("large" | "collage" | "side" | "horizontal")[] = ["large", "collage", "side", "horizontal"];
    return variants[index % variants.length];
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Page Selector Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Page Switcher */}
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
                {p === AppPage.HOME
                  ? "home"
                  : p === AppPage.OFFERS
                  ? "sell"
                  : "checkroom"}
              </span>
              {PAGE_DISPLAY_LABEL[p as AppPage]}
            </button>
          ))}
        </div>

        {/* Action Controls */}
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

      {/* Split View Grid: Left Management Panel vs Right Static Mobile Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Page Inspector & Info Panel */}
        <div className="xl:col-span-6 space-y-6">
          {/* Active Page Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-bold text-slate-200 border border-white/10 uppercase tracking-wider">
                  Active Page
                </span>
                <span className="text-amber-400 font-bold text-xs">• Live Preview Sync</span>
              </div>
              <h2 className="text-2xl font-bold font-['Playfair_Display',serif]">
                {PAGE_DISPLAY_LABEL[activePage]} Placements
              </h2>
              <p className="text-slate-300 text-xs">
                Visually configure collections, section layout rules, and promotional content directly inside the mobile preview canvas.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="bg-white/10 rounded-xl p-3 text-center min-w-20 border border-white/10">
                <span className="block text-xl font-extrabold text-white">
                  {pagePlacements.length}
                </span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                  Placements
                </span>
              </div>
              {activePage === AppPage.HOME && (
                <div className="bg-purple-500/20 rounded-xl p-3 text-center min-w-20 border border-purple-400/20">
                  <span className="block text-xl font-extrabold text-purple-200">
                    {homePromos.length}
                  </span>
                  <span className="text-[10px] text-purple-300 uppercase tracking-wider font-semibold">
                    Promos
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Visual Editor Guidance */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-xl">touch_app</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Interactive Mobile Canvas
                </h3>
                <p className="text-xs text-slate-500">
                  All adding, editing, and mapping of placements happen directly on the mobile screen preview.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <span className="material-symbols-outlined text-base text-indigo-600">smartphone</span>
                  Static Live Preview
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The phone frame on the right is fixed in place. Scroll internally to preview the mobile layout.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <span className="material-symbols-outlined text-base text-emerald-600">add_circle</span>
                  In-Canvas Actions
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Click any dashed placeholder or hover overlay inside the phone screen to add or edit components.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Static Non-Scrollable Live Mobile Screen Preview */}
        <div className="xl:col-span-6 sticky top-6 self-start flex flex-col items-center justify-start z-10">
          {/* Header Panel for Mobile Frame */}
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

          {/* Mobile Screen Container Frame */}
          <div className="bg-slate-100 border-x border-b border-slate-300 rounded-b-3xl p-4 shadow-xl flex justify-center items-center w-full max-w-[435px]">
            {deviceMode === "mobile" ? (
              /* Mobile Device Frame */
              <div className="relative w-[415px] h-[770px] border-[10px] border-slate-900 rounded-[44px] bg-white overflow-hidden shadow-2xl ring-1 ring-slate-300 flex flex-col transition-all duration-300">
                {/* Top Speaker / Notch */}
                <div className="absolute top-0 inset-x-0 h-5 bg-slate-900 rounded-b-xl mx-auto w-36 z-30 flex justify-center items-center">
                  <div className="w-12 h-1 bg-slate-800 rounded-full mt-0.5"></div>
                </div>

                {/* Mobile Top Status Bar */}
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

                {/* Mobile Inner Screen Content */}
                {activePage === AppPage.OFFERS ? (
                  <OffersCanvas
                    collections={collections}
                    getFullImageUrl={getFullImageUrl}
                    openEditPlacement={openEditPlacement}
                    deletePlacementMutation={deletePlacementMutation}
                    setIsAddingPlacement={setIsAddingPlacement}
                    setEditingPlacement={setEditingPlacement}
                    setPlacementCollectionId={setPlacementCollectionId}
                    onNavigateToProducts={(placementId, collectionName) =>
                      navigate(`/placements/${placementId}/products`, {
                        state: { collectionName },
                      })
                    }
                  />
                ) : activePage === AppPage.CATALOG_WOMEN ||
                  activePage === AppPage.CATALOG_MEN ||
                  activePage === AppPage.CATALOG_KIDS ||
                  activePage.startsWith("CATALOG") ||
                  ["WOMEN", "MEN", "KIDS"].includes(activePage) ? (
                  <CatalogCanvas
                    activePage={activePage}
                    setActivePage={setActivePage}
                    collections={collections}
                    getFullImageUrl={getFullImageUrl}
                    openEditPlacement={openEditPlacement}
                    deletePlacementMutation={deletePlacementMutation}
                    setIsAddingPlacement={setIsAddingPlacement}
                    setEditingPlacement={setEditingPlacement}
                    setPlacementCollectionId={setPlacementCollectionId}
                    onNavigateToProducts={(placementId, collectionName) =>
                      navigate(`/placements/${placementId}/products`, {
                        state: { collectionName },
                      })
                    }
                  />
                ) : (
                  <>
                    {/* TopNavBar Header */}
                    <div className="bg-white px-5 pt-1 pb-2 flex items-center justify-between sticky top-0 z-20 border-b border-slate-50">
                      <div className="w-10"></div>
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
                        <span className="material-symbols-outlined text-xl font-light cursor-pointer">
                          search
                        </span>
                        <div className="relative">
                          <span className="material-symbols-outlined text-xl font-light cursor-pointer">
                            notifications
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile HomeScreen Scroll Area */}
                    <div className="flex-1 overflow-y-auto pb-20 hide-scrollbar space-y-7 font-['Urbanist',sans-serif]">
                      {/* 1. HERO SLIDES */}
                      <div className="px-4 space-y-2.5 relative group">
                        <div className="flex items-center justify-between">
                          <h2 className="font-['Playfair_Display',serif] text-xl font-normal text-slate-900">
                            See All
                          </h2>
                          <span className="text-[11px] text-slate-400 font-semibold cursor-pointer">
                            See All &gt;&gt;
                          </span>
                        </div>

                        <div className="relative w-full h-[180px] rounded-[20px] overflow-hidden bg-[#27272A] flex items-center justify-center shadow-xs group">
                          {heroPlacements.length > 0 &&
                          heroPlacements[0].placement.imageUrl ? (
                            <img
                              src={getFullImageUrl(heroPlacements[0].placement.imageUrl)}
                              alt="Hero Slide"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <h3 className="text-white font-sans text-xl font-bold tracking-wider">
                              BEST BUYS
                            </h3>
                          )}

                          <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 backdrop-blur-xs">
                            <button
                              onClick={() => {
                                const hero = heroPlacements[0]?.placement;
                                if (hero) openEditPlacement(hero);
                                else {
                                  setEditingPlacement(null);
                                  setPlacementSection("HERO");
                                  setIsAddingPlacement(true);
                                }
                              }}
                              className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[14px]">edit</span>
                              Edit Hero
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 2. BEST SELLERS */}
                      <div className="px-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h2 className="font-['Playfair_Display',serif] text-xl font-normal text-slate-900">
                            Best Sellers
                          </h2>
                          <span className="text-[11px] text-slate-400 font-semibold cursor-pointer">
                            See All &gt;&gt;
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {(bestSellers.length > 0
                            ? bestSellers.slice(0, 2)
                            : [
                                {
                                  id: "1",
                                  name: "Men's Jackets 120",
                                  price: "4,500",
                                  rating: 5,
                                  bg: "#008080",
                                  primaryImage: "",
                                },
                                {
                                  id: "2",
                                  name: "Kid's T-Shirts 118",
                                  price: "1,200",
                                  rating: 0,
                                  bg: "#800000",
                                  primaryImage: "",
                                },
                              ]
                          ).map((prod: ApiProduct | any, idx: number) => {
                            const rawImg =
                              prod.primaryImage ||
                              prod.image ||
                              prod.imageUrl ||
                              (Array.isArray(prod.images)
                                ? typeof prod.images[0] === "string"
                                  ? prod.images[0]
                                  : prod.images[0]?.imageUrl
                                : null) ||
                              (Array.isArray(prod.variants) && prod.variants[0]?.images?.[0]?.imageUrl
                                ? prod.variants[0].images[0].imageUrl
                                : null);
                            const img = getFullImageUrl(rawImg);
                            const displayPrice =
                              prod.price ??
                              (prod.variants && prod.variants[0]?.basePrice
                                ? prod.variants[0].basePrice
                                : idx === 0
                                ? "4,500"
                                : "1,200");

                            return (
                              <div
                                key={prod.id || idx}
                                className="space-y-1.5 flex flex-col justify-between"
                              >
                                <div
                                  className={`relative aspect-[3/4] rounded-[18px] ${
                                    prod.bg || (idx === 0 ? "bg-[#008080]" : "bg-[#800000]")
                                  } flex items-center justify-center p-3 text-center overflow-hidden shadow-xs border border-slate-100`}
                                >
                                  {img ? (
                                    <img
                                      src={img}
                                      alt={prod.name}
                                      className="w-full h-full object-cover absolute inset-0"
                                    />
                                  ) : (
                                    <span className="text-white font-medium text-xs leading-snug">
                                      {prod.name}
                                    </span>
                                  )}
                                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs">
                                    <span className="material-symbols-outlined text-slate-900 text-xs">
                                      favorite_border
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-xs px-0.5">
                                  <span className="font-semibold text-slate-900 truncate flex-1 mr-1 font-['Urbanist',sans-serif]">
                                    {prod.name}
                                  </span>
                                  <div className="flex items-center gap-0.5 text-slate-900 font-bold font-['Urbanist',sans-serif]">
                                    <span>{prod.rating ?? (idx === 0 ? 5 : 0)}</span>
                                    <span className="text-amber-400 text-xs">★</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between px-0.5 pt-0.5">
                                  <span className="text-xs font-bold text-slate-900 font-['Urbanist',sans-serif]">
                                    Price
                                  </span>
                                  <span className="text-xs font-bold text-slate-900 font-['Urbanist',sans-serif]">
                                    ৳ {displayPrice}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. DYNAMIC HOME PROMOS LIST */}
                      <div className="space-y-6 pt-1">
                        {homePromos.map((promo: HomePromo, idx: number) => {
                          const variant = getPromoVariant(idx);
                          const promoImg = getFullImageUrl(promo.imageUrl);
                          return (
                            <div key={promo.id} className="relative group px-4 space-y-2.5">
                              {variant === "large" ? (
                                <div className="space-y-2.5">
                                  <div className="w-full h-[340px] overflow-hidden bg-slate-100 rounded-sm">
                                    <img
                                      src={
                                        promoImg ||
                                        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800"
                                      }
                                      alt={promo.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <h2 className="font-['Playfair_Display',serif] text-xl text-slate-900 font-normal">
                                      {promo.title}
                                    </h2>
                                    <p className="text-slate-500 text-xs leading-relaxed font-normal">
                                      {promo.description ||
                                        "This dress embodies sustainable fashion practices..."}
                                    </p>
                                  </div>
                                </div>
                              ) : variant === "collage" ? (
                                <div className="flex gap-3 items-start">
                                  <div className="w-[140px] h-[200px] rounded-xs overflow-hidden bg-slate-100 flex-shrink-0">
                                    <img
                                      src={
                                        promoImg ||
                                        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800"
                                      }
                                      alt={promo.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 space-y-1.5 pt-2">
                                    <img
                                      src="/arrow-down-right.png"
                                      alt="↘"
                                      className="w-4 h-4 object-contain"
                                    />
                                    <h2 className="font-['Playfair_Display',serif] text-xl text-slate-900 font-normal leading-tight">
                                      {promo.title}
                                    </h2>
                                    <p className="text-slate-500 text-[11px] leading-relaxed">
                                      {promo.description ||
                                        "This dress embodies sustainable fashion practices..."}
                                    </p>
                                  </div>
                                </div>
                              ) : variant === "side" ? (
                                <div className="flex gap-3 items-start">
                                  <div className="flex-1 space-y-1.5 pt-2">
                                    <img
                                      src="/arrow-down-right.png"
                                      alt="↘"
                                      className="w-4 h-4 object-contain"
                                    />
                                    <h2 className="font-['Playfair_Display',serif] text-xl text-slate-900 font-normal leading-tight">
                                      {promo.title}
                                    </h2>
                                    <p className="text-slate-500 text-[11px] leading-relaxed">
                                      {promo.description ||
                                        "This dress embodies sustainable fashion practices..."}
                                    </p>
                                  </div>
                                  <div className="w-[140px] h-[200px] rounded-xs overflow-hidden bg-slate-100 flex-shrink-0">
                                    <img
                                      src={
                                        promoImg ||
                                        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800"
                                      }
                                      alt={promo.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2.5">
                                  <div className="w-full h-[190px] rounded-xs overflow-hidden bg-slate-100">
                                    <img
                                      src={
                                        promoImg ||
                                        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800"
                                      }
                                      alt={promo.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <img
                                      src="/arrow-down-right.png"
                                      alt="↘"
                                      className="w-4 h-4 object-contain"
                                    />
                                    <h2 className="font-['Playfair_Display',serif] text-xl text-slate-900 font-normal">
                                      {promo.title}
                                    </h2>
                                    <p className="text-slate-500 text-xs leading-relaxed">
                                      {promo.description ||
                                        "This dress embodies sustainable fashion practices..."}
                                    </p>
                                  </div>
                                </div>
                              )}

                              <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 rounded-xl backdrop-blur-xs">
                                <button
                                  onClick={() => openEditPromo(promo)}
                                  className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[14px]">edit</span>
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeletePromoTarget(promo)}
                                  className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[14px]">delete</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {/* In-Canvas Add Homepage Promo Card Button */}
                        <div
                          onClick={() => {
                            setEditingPromo(null);
                            setPromoTitle("");
                            setIsAddingPromo(true);
                          }}
                          className="p-4 border-2 border-dashed border-purple-300 hover:border-purple-600 rounded-2xl flex items-center justify-center gap-2 text-purple-600 hover:text-purple-700 transition-all cursor-pointer bg-purple-50/40 hover:bg-purple-50"
                        >
                          <span className="material-symbols-outlined text-[18px]">campaign</span>
                          <span className="text-xs font-bold">+ Add Homepage Promo Card</span>
                        </div>
                      </div>
                    </div>
                  </>
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
                      activePage.startsWith("CATALOG") ? "text-slate-900 font-bold" : "text-slate-500"
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
                  <div className="flex flex-col items-center gap-0.5 cursor-pointer text-slate-500 hover:text-slate-900">
                    <span className="material-symbols-outlined text-lg">favorite</span>
                    <span className="text-[9px] font-medium">Wishlist</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5 cursor-pointer text-slate-500 hover:text-slate-900">
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
                    https://sohoshop.com/{activePage.toLowerCase()}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <img src="/soho.png" alt="Soho" className="h-8 object-contain" />
                  <div className="grid grid-cols-1 gap-4">
                    {pagePlacements.map(({ placement, collection }) => (
                      <div
                        key={placement.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex justify-between items-center"
                      >
                        <span className="font-bold text-xs text-slate-800">{collection.name}</span>
                        <span className="text-[10px] font-semibold text-slate-500">{placement.section}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inline Modal: Add / Edit Placement */}
      {isAddingPlacement && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">view_quilt</span>
                {editingPlacement ? "Edit Placement" : "Create Collection Placement"}
              </h3>
              <button onClick={closeModals} className="text-slate-400 hover:text-slate-600 p-1">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Select Collection <span className="text-red-500">*</span>
                </label>
                <select
                  value={placementCollectionId}
                  onChange={(e) => setPlacementCollectionId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option value="">-- Select Collection --</option>
                  {collections.map((col: Collection) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Page Section Layout
                </label>
                <select
                  value={placementSection}
                  onChange={(e) => setPlacementSection(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  {Object.values(PageSection).map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
                {placementSection && SECTION_GUIDANCE_MAP[placementSection as PageSection] && (
                  <p className="mt-1.5 text-xs text-indigo-600 bg-indigo-50 p-2 rounded border border-indigo-100">
                    💡 {SECTION_GUIDANCE_MAP[placementSection as PageSection]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Cover Banner Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-20 rounded-lg border border-slate-300 bg-slate-100 overflow-hidden flex justify-center items-center relative">
                    {placementImageUrl ? (
                      <img
                        src={getFullImageUrl(placementImageUrl)}
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
                        setPlacementImageFile(file);
                        setPlacementImageUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="placementIsActive"
                  checked={placementIsActive}
                  onChange={(e) => setPlacementIsActive(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                />
                <label htmlFor="placementIsActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Active (Visible on app and web)
                </label>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => savePlacementMutation.mutate()}
                disabled={savePlacementMutation.isPending}
                className="px-5 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                {savePlacementMutation.isPending ? "Saving..." : "Save Placement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Modal: Add / Edit Home Promo */}
      {isAddingPromo && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-purple-50">
              <h3 className="font-bold text-purple-900 text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-700">campaign</span>
                {editingPromo ? "Edit Homepage Promotion" : "Create Homepage Promotion"}
              </h3>
              <button onClick={closeModals} className="text-purple-400 hover:text-purple-600 p-1">
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Promo Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  placeholder="e.g. Summer Collection 50% Off"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Description
                </label>
                <textarea
                  value={promoDescription}
                  onChange={(e) => setPromoDescription(e.target.value)}
                  placeholder="Short promotional subtitle..."
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Redirect Target
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPromoContentType("COLLECTION")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      promoContentType === "COLLECTION"
                        ? "border-purple-600 bg-purple-50 text-purple-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Collection
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromoContentType("PRODUCT")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                      promoContentType === "PRODUCT"
                        ? "border-purple-600 bg-purple-50 text-purple-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Single Product
                  </button>
                </div>
              </div>

              {promoContentType === "COLLECTION" ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Target Collection
                  </label>
                  <select
                    value={promoCollectionId}
                    onChange={(e) => setPromoCollectionId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
                  >
                    <option value="">-- Choose Collection --</option>
                    {collections.map((col: Collection) => (
                      <option key={col.id} value={col.id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Target Product
                  </label>
                  <select
                    value={promoProductId}
                    onChange={(e) => setPromoProductId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
                  >
                    <option value="">-- Choose Product --</option>
                    {products.map((prod: ApiProduct) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Promo Image Banner
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-28 h-16 rounded-lg border border-slate-300 bg-slate-100 overflow-hidden flex justify-center items-center relative">
                    {promoImageUrl ? (
                      <img
                        src={getFullImageUrl(promoImageUrl)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400">campaign</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPromoImageFile(file);
                        setPromoImageUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="promoIsActive"
                  checked={promoIsActive}
                  onChange={(e) => setPromoIsActive(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                />
                <label htmlFor="promoIsActive" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Active (Displayed on app homepage)
                </label>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => savePromoMutation.mutate()}
                disabled={savePromoMutation.isPending}
                className="px-5 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                {savePromoMutation.isPending ? "Saving..." : "Save Promotion"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deletePromoTarget)}
        onClose={() => setDeletePromoTarget(null)}
        onConfirm={() => deletePromoTarget && deletePromoMutation.mutate(deletePromoTarget.id)}
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

      {/* Hide Scrollbars CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
