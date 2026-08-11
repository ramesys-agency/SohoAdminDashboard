import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCollections,
  type Collection,
  type CollectionPlacement,
} from "../../../api/collections";
import { AppPage } from "../types";
import ConfirmModal from "../../../components/ui/ConfirmModal";

interface OffersCanvasProps {
  collections?: Collection[];
  getFullImageUrl: (url?: string | null) => string;
  openEditPlacement: (placement: CollectionPlacement) => void;
  deletePlacementMutation: any;
  setIsAddingPlacement: (val: boolean) => void;
  setEditingPlacement: (placement: CollectionPlacement | null) => void;
  setPlacementCollectionId: (id: string) => void;
  onNavigateToProducts: (placementId: string, collectionName: string) => void;
}

export default function OffersCanvas({
  collections: initialCollections = [],
  getFullImageUrl,
  openEditPlacement,
  deletePlacementMutation,
  setIsAddingPlacement,
  setEditingPlacement,
  setPlacementCollectionId,
  onNavigateToProducts,
}: OffersCanvasProps) {
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  // Mobile Application API Call: getCollections({ placementPage: "OFFER", placementIsActive: true, isActive: true })
  const { data: offersData } = useQuery({
    queryKey: ["offers-api-collections"],
    queryFn: async () => {
      const resOffer = await getCollections(1, 100, undefined, "OFFER");
      if (resOffer?.data && resOffer.data.length > 0) return resOffer.data;
      const resOffers = await getCollections(1, 100, undefined, "OFFERS");
      return resOffers?.data || [];
    },
  });

  const offerCollections =
    offersData && offersData.length > 0 ? offersData : initialCollections;

  // Format offers items matching mobile app OffersScreen.tsx
  const offerItems = offerCollections.flatMap((collection: Collection) => {
    const placements =
      collection.collectionPlacements?.filter(
        (p) =>
          p.page === "OFFER" ||
          p.page === "OFFERS" ||
          p.page === AppPage.OFFERS,
      ) ?? [];

    if (placements.length > 0) {
      return placements.map((placement) => ({
        placement,
        collection,
        title: collection.name,
        subtitle: "For Selected Items",
        imageUrl: placement.imageUrl,
      }));
    }

    return [
      {
        placement: null as unknown as CollectionPlacement,
        collection,
        title: collection.name,
        subtitle: "For Selected Items",
        imageUrl: "",
      },
    ];
  });

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden font-['Urbanist',sans-serif]">
      {/* SubHeader matching React Native SubHeader.tsx */}
      <div className="bg-white px-5 pt-2 pb-3 flex items-center justify-between sticky top-0 z-20 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-900 text-2xl cursor-pointer">
            arrow_back
          </span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Offers
          </h1>
        </div>
        <div className="w-6"></div>
      </div>

      {/* Offers Banners Scroll Container */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-24 space-y-6 hide-scrollbar">
        {offerItems.length === 0 ? (
          /* Empty State Offer Card Placeholder matching OfferCard 400px height */
          <div className="space-y-6">
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-md bg-slate-900 flex items-center justify-center p-6 text-center group">
              <img
                src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop"
                alt="Default Offer Banner"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Action Controls */}
              <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 backdrop-blur-xs">
                <button
                  onClick={() => {
                    setEditingPlacement(null);
                    setPlacementCollectionId("");
                    setIsAddingPlacement(true);
                  }}
                  className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    add
                  </span>
                  + Create First Offer Banner
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Real Dynamic Offer Cards (Matching Mobile OfferCard.tsx height 400px & rounded-3xl) */
          offerItems.map(({ placement, collection, title, imageUrl }, idx) => {
            const img = getFullImageUrl(imageUrl);
            return (
              <div
                key={placement?.id || collection.id || idx}
                className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-lg bg-slate-900 group cursor-pointer border border-slate-100"
              >
                <img
                  src={
                    img ||
                    "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4 backdrop-blur-xs">
                  {placement && (
                    <button
                      onClick={() => openEditPlacement(placement)}
                      className="px-3.5 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        edit
                      </span>
                      Edit Offer
                    </button>
                  )}
                  <button
                    onClick={() =>
                      onNavigateToProducts(
                        placement?.id || collection.id,
                        title,
                      )
                    }
                    className="px-3.5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      inventory_2
                    </span>
                    Products
                  </button>
                  {placement && (
                    <button
                      onClick={() =>
                        setDeleteTarget({ id: placement.id, title })
                      }
                      className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-md cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        delete
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Add New Offer Banner Button */}
        <div
          onClick={() => {
            setEditingPlacement(null);
            setPlacementCollectionId("");
            setIsAddingPlacement(true);
          }}
          className="p-4 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-amber-600 transition-all cursor-pointer bg-white/60 hover:bg-white"
        >
          <span className="material-symbols-outlined text-[20px]">
            add_circle
          </span>
          <span className="text-xs font-bold">
            + Add Offer Placement Banner
          </span>
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
        title="Delete Offer Placement"
        message={
          <>
            Are you sure you want to delete offer placement for{" "}
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
