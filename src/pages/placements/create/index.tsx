import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../../../components/ui/Button";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import PlacementForm from "../components/PlacementForm";
import MobilePreview from "../components/MobilePreview";
import { createPlacement, updatePlacement } from "../../../api/placements";
import { getCollections } from "../../../api/collections";
import type { Collection } from "../../../api/collections";

type CollectionMode = "new" | "existing";

interface LocationState {
  collection?: Collection;
}

export default function CreatePlacements() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  // Collection data passed from the list page via router state
  const locationState = location.state as LocationState | null;
  const passedCollection = locationState?.collection;
  const passedPlacement = passedCollection?.collectionPlacements?.[0];

  // Initialise form state directly from router state (no fetch needed)
  const [collectionMode, setCollectionMode] = useState<CollectionMode>("existing");
  const [collectionId, setCollectionId] = useState<string>(passedCollection?.id ?? "");
  const [pageName, setPageName] = useState<string>(passedPlacement?.page ?? "");
  const [sectionName, setSectionName] = useState<string>(passedPlacement?.section ?? "");
  const [isBanner, setIsBanner] = useState<boolean>(passedPlacement?.isBanner ?? true);
  const [isActive, setIsActive] = useState<boolean>(passedPlacement?.isActive ?? true);
  const [imageUrl, setImageUrl] = useState<string>(passedPlacement?.imageUrl ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // The placement ID needed for the PUT call
  const placementId = passedPlacement?.id ?? "";

  // Fetch all collections for the dropdown (create mode only)
  const { data: collectionsData, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["collections-all"],
    queryFn: () => getCollections(1, 100),
    enabled: !isEdit && collectionMode === "existing",
  });

  const allCollections =
    collectionsData?.data?.map((c) => ({ id: c.id, name: c.name })) ?? [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createPlacement,
    onSuccess: () => {
      alert("Placement created successfully!");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      navigate("/placements");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      alert(error?.response?.data?.message ?? "Failed to create placement.");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      pId,
      payload,
    }: {
      pId: string;
      payload: Parameters<typeof updatePlacement>[1];
    }) => updatePlacement(pId, payload),
    onSuccess: () => {
      alert("Placement updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      navigate("/placements");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      alert(error?.response?.data?.message ?? "Failed to update placement.");
    },
  });

  const handleSave = () => {
    if (!isEdit && !collectionId) {
      alert("Please select or enter a collection.");
      return;
    }
    if (!pageName) {
      alert("Please select a target app page.");
      return;
    }

    setIsSaving(true);

    if (isEdit && placementId) {
      updateMutation.mutate({
        pId: placementId,
        payload: {
          page: pageName,
          section: sectionName || undefined,
          isBanner,
          isActive,
          image: imageFile ?? undefined,
        },
      });
    } else {
      createMutation.mutate({
        collectionId,
        page: pageName,
        section: sectionName || undefined,
        isBanner,
        isActive,
        image: imageFile ?? undefined,
      });
    }

    setIsSaving(false);
  };

  const isPending = createMutation.isPending || updateMutation.isPending || isSaving;

  return (
    <PageWrapper>
      <PageHeader
        title={isEdit ? "Edit Placement" : "App Placements"}
        description="Configure where your collections appear in the mobile app."
        actions={
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/placements")}
              className="!bg-white !text-slate-700 border border-slate-200 hover:!bg-slate-50"
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

      {/* Collection Mode Toggle — only show in create mode */}
      {!isEdit && (
        <div className="mt-6 inline-flex items-center bg-slate-100 rounded-xl p-1 gap-1">
          <button
            type="button"
            onClick={() => {
              setCollectionMode("existing");
              setCollectionId("");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              collectionMode === "existing"
                ? "bg-white text-[#1325ec] shadow-sm border border-slate-200"
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
                ? "bg-white text-[#1325ec] shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              add_circle
            </span>
            Create New Collection
          </button>
        </div>
      )}

      {/* In edit mode, show the collection name as a read-only label */}
      {isEdit && passedCollection && (
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-sm text-slate-700 font-semibold">
          <span className="material-symbols-outlined text-[18px] text-slate-400">
            folder
          </span>
          Collection: {passedCollection.name}
        </div>
      )}

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

        {/* Right sidebar */}
        <MobilePreview
          pageName={pageName}
          sectionName={sectionName}
          isBanner={isBanner}
          imageUrl={imageUrl}
          collectionId={collectionId}
        />
      </div>
    </PageWrapper>
  );
}
