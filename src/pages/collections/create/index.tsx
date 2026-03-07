import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import CollectionForm from "./components/CollectionForm";
import Button from "../../../components/ui/Button";

export default function CreateCollection() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageHeader
        title="Create Collection"
        description={
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate("/collections")}
            leftIcon={
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
            }
            className="hover:underline"
          >
            Back to Collections
          </Button>
        }
        actions={
          <>
            <Button variant="outline" onClick={() => navigate("/collections")}>
              Discard
            </Button>
            <Button>Save Collection</Button>
          </>
        }
      />
      <CollectionForm />
    </PageWrapper>
  );
}
