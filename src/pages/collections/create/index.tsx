import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import CollectionForm from "./components/CollectionForm";

export default function CreateCollection() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageHeader
        title="Create Collection"
        description={
          <button
            onClick={() => navigate("/collections")}
            className="inline-flex items-center gap-1 text-[#1325ec] text-sm font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Collections
          </button>
        }
        actions={
          <>
            <button
              onClick={() => navigate("/collections")}
              className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Discard
            </button>
            <button className="px-4 py-2 text-sm font-bold bg-[#1325ec] text-white rounded-lg shadow-lg shadow-[#1325ec]/20 hover:opacity-90">
              Save Collection
            </button>
          </>
        }
      />
      <CollectionForm />
    </PageWrapper>
  );
}
