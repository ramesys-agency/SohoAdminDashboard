import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import CategoryForm from "./components/CategoryForm";

export default function CreateCategory() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageHeader
        title="Create Category"
        description={
          <button
            onClick={() => navigate("/categories")}
            className="inline-flex items-center gap-1 text-[#1325ec] text-sm font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Categories
          </button>
        }
        actions={
          <>
            <button
              onClick={() => navigate("/categories")}
              className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Discard
            </button>
            <button className="px-4 py-2 text-sm font-bold bg-[#1325ec] text-white rounded-lg shadow-lg shadow-[#1325ec]/20 hover:opacity-90">
              Save Category
            </button>
          </>
        }
      />
      <CategoryForm />
    </PageWrapper>
  );
}
