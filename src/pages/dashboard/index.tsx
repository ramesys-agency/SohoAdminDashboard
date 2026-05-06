import { useQuery } from "@tanstack/react-query";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import MetricCards from "./components/MetricCards";
import SalesChart from "./components/SalesChart";
import RecentOrdersTable from "./components/RecentOrdersTable";
import LowStockList from "./components/LowStockList";
import { getDashboardStats } from "../../api/stats";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-screen">
          <div className="size-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Dashboard Overview"
        description="Welcome back! Here's what's happening today."
      />
      <div className="space-y-6">
        <MetricCards
          totalSales={stats?.totalSales}
          totalOrders={stats?.totalOrders}
          totalCustomers={stats?.totalCustomers}
        />
        <SalesChart trend={stats?.salesTrend} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentOrdersTable orders={stats?.recentOrders} />
          </div>
          <LowStockList />
        </div>
      </div>
    </PageWrapper>
  );
}
