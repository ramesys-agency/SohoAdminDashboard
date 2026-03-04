import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import MetricCards from "./components/MetricCards";
import SalesChart from "./components/SalesChart";
import RecentOrdersTable from "./components/RecentOrdersTable";
import LowStockList from "./components/LowStockList";

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageHeader
        title="Dashboard Overview"
        description="Welcome back! Here's what's happening today."
        actions={
          <>
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-700">
              Download Report
            </button>
            <button
              onClick={() => navigate("/products/edit")}
              className="px-4 py-2 bg-[#1325ec] text-white rounded-lg text-sm font-bold hover:bg-[#1325ec]/90 shadow-lg shadow-[#1325ec]/10"
            >
              Add Product
            </button>
          </>
        }
      />
      <MetricCards />
      <SalesChart />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <LowStockList />
      </div>
    </PageWrapper>
  );
}
