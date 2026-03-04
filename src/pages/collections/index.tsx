import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import CollectionsTable from "./components/CollectionsTable";

const tabs = ["All Collections", "Active", "Archived"];

export default function Collections() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <PageWrapper>
      <PageHeader
        title="Collections"
        description="Group your products to help customers browse easily."
        actions={
          <button
            onClick={() => navigate("/collections/create")}
            className="inline-flex items-center gap-2 bg-[#1325ec] hover:bg-[#1325ec]/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-[#1325ec]/20"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Collection
          </button>
        }
      />
      <div>
        <div className="mb-6 border-b border-slate-200 flex gap-6">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`pb-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === i
                  ? "border-[#1325ec] text-[#1325ec] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <CollectionsTable />
      </div>
    </PageWrapper>
  );
}
