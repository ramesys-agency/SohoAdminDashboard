import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import CollectionsTable from "./components/CollectionsTable";
import Button from "../../components/ui/Button";

const tabs = ["All Collections", "Active", "Inactive"];

export default function Collections() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <PageWrapper>
      <PageHeader
        title="Collections"
        description="Group your products to help customers browse easily."
        actions={
          <Button
            onClick={() => navigate("/collections/create")}
            leftIcon={
              <span className="material-symbols-outlined text-lg">add</span>
            }
          >
            Add Collection
          </Button>
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
        <CollectionsTable activeTab={activeTab} />
      </div>
    </PageWrapper>
  );
}
