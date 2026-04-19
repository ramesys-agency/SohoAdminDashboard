import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import OrderFilters from "./components/OrderFilters";
import OrdersTable from "./components/OrdersTable";
// import SalesPerformanceChart from "./components/SalesPerformanceChart";
// import CalendarWidget from "./components/CalendarWidget";

export default function Orders() {
  return (
    <PageWrapper>
      <PageHeader
        title="Order Management"
        description="Review and fulfill your latest customer transactions."
        // actions={
        //   <>
        //     <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors text-slate-700">
        //       <span className="material-symbols-outlined text-lg">
        //         download
        //       </span>
        //       Export
        //     </button>
        //     <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors text-slate-700">
        //       <span className="material-symbols-outlined text-lg">print</span>
        //       Batch Print
        //     </button>
        //   </>
        // }
      />
      <OrderFilters />
      <OrdersTable />
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesPerformanceChart />
        </div>
        <CalendarWidget />
      </div> */}
    </PageWrapper>
  );
}
