import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../../../components/ui/Button";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import PlacementForm from "../components/PlacementForm";
import MobilePreview from "../components/MobilePreview";
import { createPlacement, updatePlacement, getPlacementById } from "../../../api/placements";
import type { PlacementDetail } from "../../../api/placements";
import { getCollections } from "../../../api/collections";

type CollectionMode = "new" | "existing";

interface LocationState {
  placement?: PlacementDetail;
}

export default function CreatePlacements() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const locationState = location.state as LocationState | null;
  const passedPlacement = locationState?.placement;

  // In edit mode, fetch placement by its ID
  const { data: fetchedPlacementRes, isLoading: isLoadingPlacement } = useQuery({
    queryKey: ["placement", id],
    queryFn: () => getPlacementById(id!),
    enabled: isEdit && Boolean(id) && !passedPlacement,
  });
  const fetchedPlacement = fetchedPlacementRes?.data;

  const activePlacement = (fetchedPlacement || passedPlacement) as PlacementDetail | undefined;

  // Form state
  const [collectionMode, setCollectionMode] = useState<CollectionMode>("existing");
  const [collectionId, setCollectionId] = useState<string>("");
  const [pageName, setPageName] = useState<string>("");
  const [sectionName, setSectionName] = useState<string>("");
  const [isBanner, setIsBanner] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Hydrate form from placement (edit mode)
  useEffect(() => {
    if (!activePlacement) return;
    setCollectionId(activePlacement.collectionId);
    setPageName(activePlacement.page);
    setSectionName(activePlacement.section ?? "");
    setIsBanner(activePlacement.isBanner);
    setIsActive(activePlacement.isActive);
    setImageUrl(activePlacement.imageUrl ?? "");
  }, [activePlacement]);

  // Fetch all collections for the dropdown
  const { data: collectionsData, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["collections-all"],
    queryFn: () => getCollections(1, 100),
    enabled: collectionMode === "existing",
  });

  const allCollections =
    collectionsData?.data?.map((c) => ({ id: c.id, name: c.name })) ?? [];

  const createMutation = useMutation({
    mutationFn: createPlacement,
    onSuccess: () => {
      toast.success("Placement created successfully!");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      navigate("/placements");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? "Failed to create placement.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      pId,
      payload,
    }: {
      pId: string;
      payload: Parameters<typeof updatePlacement>[1];
    }) => updatePlacement(pId, payload),
    onSuccess: () => {
      toast.success("Placement updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["placement", id] });
      navigate("/placements");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? "Failed to update placement.");
    },
  });

  const handleSave = async () => {
    if (!collectionId) {
      toast.error("Please select or enter a collection.");
      return;
    }
    if (!pageName) {
      toast.error("Please select a target app page.");
      return;
    }

    setIsSaving(true);

    try {
      if (isEdit && id) {
        updateMutation.mutate({
          pId: id,
          payload: {
            collectionId: collectionMode === "existing" ? collectionId : undefined,
            collectionName: collectionMode === "new" ? collectionId : undefined,
            page: pageName,
            section: sectionName || undefined,
            isBanner,
            isActive,
            image: imageFile ?? undefined,
          },
        });
      } else {
        createMutation.mutate({
          collectionId: collectionMode === "existing" ? collectionId : undefined,
          collectionName: collectionMode === "new" ? collectionId : undefined,
          page: pageName,
          section: sectionName || undefined,
          isBanner,
          isActive,
          image: imageFile ?? undefined,
        });
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(e?.response?.data?.message || e?.message || "Failed to save placement.");
    } finally {
      setIsSaving(false);
    }
  };

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    isSaving ||
    isLoadingPlacement;

  if (isEdit && isLoadingPlacement && !passedPlacement) {
    return (
      <PageWrapper>
        <div className="p-8 text-center text-slate-500">
          Loading placement data...
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title={isEdit ? "Edit Placement" : "App Placements"}
        description="Configure where your collections appear in the mobile app."
        actions={
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/placements")}
              className="bg-white! text-slate-700! border border-slate-200 hover:bg-slate-50!"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEdit
                  ? "Update Placement"
                  : "Save Placement"}
            </Button>
          </div>
        }
      />

      {/* Collection Mode Toggle */}
      <div className="mt-6 inline-flex items-center bg-slate-100 rounded-xl p-1 gap-1">
        <button
          type="button"
          onClick={() => {
            setCollectionMode("existing");
            setCollectionId(isEdit && activePlacement ? activePlacement.collectionId : "");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            collectionMode === "existing"
              ? "bg-white text-primary shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            library_books
          </span>
          Select Existing Collection
        </button>
        <button
          type="button"
          onClick={() => {
            setCollectionMode("new");
            setCollectionId("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            collectionMode === "new"
              ? "bg-white text-primary shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            add_circle
          </span>
          Create New Collection
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start mt-6">
        {/* Left: Main form */}
        <PlacementForm
          collectionMode={collectionMode}
          collectionId={collectionId}
          setCollectionId={setCollectionId}
          pageName={pageName}
          setPageName={setPageName}
          sectionName={sectionName}
          setSectionName={setSectionName}
          setIsBanner={setIsBanner}
          isActive={isActive}
          setIsActive={setIsActive}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          setImageFile={setImageFile}
          collections={allCollections}
          isLoadingCollections={isLoadingCollections}
        />

        {/* Right sidebar - Static on right side */}
        <div className="sticky top-6 self-start">
          <MobilePreview
            pageName={pageName}
            sectionName={sectionName}
            isBanner={isBanner}
            imageUrl={imageUrl}
            collectionId={collectionId}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
