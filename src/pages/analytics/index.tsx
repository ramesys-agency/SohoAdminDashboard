import { useState } from "react";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import KpiCards from "./components/KpiCards";
import RevenueChart from "./components/RevenueChart";
import CategoryDonut from "./components/CategoryDonut";
import TopProductsChart from "./components/TopProductsChart";
import LiveTransactionsTable from "./components/LiveTransactionsTable";

export default function Analytics() {
  const [activeRange, setActiveRange] = useState("Day");

  return (
    <PageWrapper>
      <PageHeader
        title="Executive Dashboard"
        description="Real-time performance metrics and business intelligence."
        actions={
          <>
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
              {["Day", "Week", "Month"].map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeRange === r ? "bg-slate-100" : "hover:bg-slate-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 bg-[#1325ec] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#1325ec]/20">
              <span className="material-symbols-outlined text-sm">
                calendar_today
              </span>
              Oct 1 – Oct 31, 2023
            </button>
          </>
        }
      />
      <KpiCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RevenueChart />
        <CategoryDonut />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopProductsChart />
        <LiveTransactionsTable />
      </div>
    </PageWrapper>
  );
}
