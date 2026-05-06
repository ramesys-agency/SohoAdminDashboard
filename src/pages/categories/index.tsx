import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import CategoryTreeTable from "./components/CategoryTreeTable";

export default function Categories() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageHeader
        title="Category Hierarchy"
        description="Organize your products into nested levels for better management."
        actions={
          <>
            <button
              onClick={() => navigate("/categories/create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Create Category
            </button>
          </>
        }
      />
      <CategoryTreeTable />
    </PageWrapper>
  );
}
