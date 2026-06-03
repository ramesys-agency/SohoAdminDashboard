import { useState } from "react";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import OrderFilters from "./components/OrderFilters";
import OrdersTable from "./components/OrdersTable";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("Payment: All");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("Fulfillment: All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const clearFilters = () => {
    setSearch("");
    setPaymentFilter("Payment: All");
    setFulfillmentFilter("Fulfillment: All");
    setStartDate("");
    setEndDate("");
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Order Management"
        description="Review and fulfill your latest customer transactions."
      />
      <div className="space-y-4 mb-6">
        {/* Search & Date Filter Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 shadow-sm">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, Customer, Email, or Phone..."
              className="bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-700"
            />
          </div>

          {/* Date range picker */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
              <span className="material-symbols-outlined text-slate-400 text-lg">
                calendar_today
              </span>
              <span className="text-xs font-semibold text-slate-500 mr-1">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent border-none p-0 focus:outline-none text-sm text-slate-700 outline-none w-28 cursor-pointer"
              />
            </div>
            <span className="text-slate-400 text-sm font-medium">to</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
              <span className="material-symbols-outlined text-slate-400 text-lg">
                calendar_today
              </span>
              <span className="text-xs font-semibold text-slate-500 mr-1">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent border-none p-0 focus:outline-none text-sm text-slate-700 outline-none w-28 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Dropdown Filters (Payment & Fulfillment) */}
        <OrderFilters
          paymentFilter={paymentFilter}
          setPaymentFilter={setPaymentFilter}
          fulfillmentFilter={fulfillmentFilter}
          setFulfillmentFilter={setFulfillmentFilter}
          clearFilters={clearFilters}
        />
      </div>
      
      <OrdersTable
        search={search}
        paymentFilter={paymentFilter}
        fulfillmentFilter={fulfillmentFilter}
        startDate={startDate}
        endDate={endDate}
      />
    </PageWrapper>
  );
}
