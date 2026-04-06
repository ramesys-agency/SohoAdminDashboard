import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import CollectionsTable from "./components/CollectionsTable";

export default function Placements() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <PageHeader
        title="Placements"
        description="Configure where your collections appear in the mobile app."
        actions={
          <Button
            onClick={() => navigate("/placements/create")}
            leftIcon={
              <span className="material-symbols-outlined text-lg">add</span>
            }
          >
            Add Placement
          </Button>
        }
      />
      <div>
        <CollectionsTable />
      </div>
    </PageWrapper>
  );
}
