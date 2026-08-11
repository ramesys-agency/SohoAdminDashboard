import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import PlacementDialog from "../components/PlacementDialog";
import { getPlacementById, getPlacements } from "../../../api/placements";
import { AppPage, PageSection } from "../types";

/**
 * Deep-link editor for a single section, reached from the table view. Sections
 * are normally created and edited straight on the canvas, so this reuses the
 * very same dialog rather than keeping a second form in sync.
 */
export default function EditPlacement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["placement", id],
    queryFn: () => getPlacementById(id!),
    enabled: Boolean(id),
  });

  const { data: allData } = useQuery({
    queryKey: ["placements", "all"],
    queryFn: () => getPlacements(),
  });

  const placement = data?.data;
  const close = () => navigate("/placements");

  return (
    <PageWrapper>
      <PageHeader
        title="Edit Section"
        description="Update this section's name, description, cover image and visibility."
      />

      {isLoading && <div className="p-8 text-center text-slate-500">Loading section...</div>}

      {!isLoading && !placement && (
        <div className="p-8 text-center text-red-500">Section not found.</div>
      )}

      {placement && (
        <PlacementDialog
          key={placement.id}
          onClose={close}
          page={placement.page as AppPage}
          section={placement.section as PageSection}
          placement={placement}
          duplicateOptions={allData?.data ?? []}
        />
      )}
    </PageWrapper>
  );
}
