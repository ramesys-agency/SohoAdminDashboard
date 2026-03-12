import { useNavigate, useLocation } from "react-router-dom";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import CategoryForm from "./components/CategoryForm";
import Button from "../../../components/ui/Button";
import type { Category } from "../category.interface";

export default function CreateCategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const editCategory: Category | undefined = location.state?.editCategory;
  const isEditMode = Boolean(editCategory);

  return (
    <PageWrapper>
      <PageHeader
        title={isEditMode ? "Edit Category" : "Create Category"}
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
            <Button form="create-category-form" type="submit">
              {isEditMode ? "Update Category" : "Save Category"}
            </Button>
          </>
        }
      />
      <CategoryForm />
    </PageWrapper>
  );
}
