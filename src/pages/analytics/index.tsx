import { useState } from "react";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import KpiCards from "./components/KpiCards";
import RevenueChart from "./components/RevenueChart";
import CategoryDonut from "./components/CategoryDonut";
import TopProductsChart from "./components/TopProductsChart";
import LiveTransactionsTable from "./components/LiveTransactionsTable";
import Button from "../../components/ui/Button";

export default function Analytics() {
  const [activeRange, setActiveRange] = useState("Day");

  return (
    <PageWrapper>
      <PageHeader
        title="Executive Dashboard"
        description="Real-time performance metrics and business intelligence."
        actions={
          <>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
              {["Day", "Week", "Month"].map((r) => (
                <Button
                  key={r}
                  variant={activeRange === r ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveRange(r)}
                  className="rounded-lg"
                >
                  {r}
                </Button>
              ))}
            </div>
            <Button
              leftIcon={
                <span className="material-symbols-outlined text-sm">
                  calendar_today
                </span>
              }
            >
              Oct 1 – Oct 31, 2023
            </Button>
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
