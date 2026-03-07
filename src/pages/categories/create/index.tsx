import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import CategoryForm from "./components/CategoryForm";
import Button from "../../../components/ui/Button";

export default function CreateCategory() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageHeader
        title="Create Category"
        description={
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate("/categories")}
            leftIcon={
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
            }
            className="hover:underline"
          >
            Back to Categories
          </Button>
        }
        actions={
          <>
            <Button variant="outline" onClick={() => navigate("/categories")}>
              Discard
            </Button>
            <Button>Save Category</Button>
          </>
        }
      />
      <CategoryForm />
    </PageWrapper>
  );
}
