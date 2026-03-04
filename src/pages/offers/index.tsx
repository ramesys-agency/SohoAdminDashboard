import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import CouponsTable from "./components/CouponsTable";
import UsageStats from "./components/UsageStats";

const filterTabs = [
  { label: "Active", count: 12 },
  { label: "Scheduled", count: 4 },
  { label: "Expired", count: null },
];

export default function Offers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <PageWrapper>
      <PageHeader
        title="Offers & Coupons"
        description="Manage and monitor your promotional campaigns."
        actions={
          <button
            onClick={() => navigate("/offers/create")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1325ec] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1325ec]/90 transition-all shadow-lg shadow-[#1325ec]/20"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Create Discount
          </button>
        }
      />
      <div>
        <div className="mb-6 border-b border-slate-200">
          <div className="flex gap-8">
            {filterTabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`border-b-2 pb-4 px-1 text-sm font-bold transition-colors ${
                  activeTab === i
                    ? "border-[#1325ec] text-[#1325ec]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span
                    className={`ml-1 text-xs px-2 py-0.5 rounded-full ${activeTab === i ? "bg-[#1325ec]/10" : "bg-slate-100"}`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <CouponsTable />
      </div>
      <UsageStats />
    </PageWrapper>
  );
}
