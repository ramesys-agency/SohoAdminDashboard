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
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-xl">
                ios_share
              </span>
              Export
            </button>
            <button
              onClick={() => navigate("/categories/create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1325ec] text-white rounded-lg font-bold text-sm shadow-lg shadow-[#1325ec]/20 hover:bg-[#1325ec]/90 transition-all"
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
