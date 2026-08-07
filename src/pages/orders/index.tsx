import { useCallback, useEffect, useState } from "react";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import OrderFilters from "./components/OrderFilters";
import OrdersTable from "./components/OrdersTable";
import ManualShippingTable from "./components/ManualShippingTable";
import { getManualOrdersCount } from "../../api/orders";

type OrdersTab = "all" | "manual";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("Payment: All");
  const [fulfillmentFilter, setFulfillmentFilter] = useState("Fulfillment: All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tab, setTab] = useState<OrdersTab>("all");
  const [manualHandled, setManualHandled] = useState<"true" | "false">("false");
  const [manualCount, setManualCount] = useState(0);

  // Polled rather than fetched once: an order can fall back to manual shipping
  // hours after it was placed, while this page is already open.
  const refreshManualCount = useCallback(async () => {
    try {
      setManualCount(await getManualOrdersCount());
    } catch (error) {
      console.error("Failed to fetch manual shipping count:", error);
    }
  }, []);

  useEffect(() => {
    refreshManualCount();
    const timer = setInterval(refreshManualCount, 60_000);
    return () => clearInterval(timer);
  }, [refreshManualCount]);

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

      {/* Tabs — manual shipping is a work queue, not just another filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-4">
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 -mb-px transition-colors ${
            tab === "all"
              ? "border-primary text-primary"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setTab("manual")}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 -mb-px transition-colors flex items-center gap-2 ${
            tab === "manual"
              ? "border-amber-500 text-amber-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Manual Shipping
          {manualCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold">
              {manualCount}
            </span>
          )}
        </button>
      </div>

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

          {/* The manual queue is filtered by whether staff dealt with it, not
              by date or payment state. */}
          {tab === "manual" && (
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {(
                [
                  ["false", "Needs attention"],
                  ["true", "Handled"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setManualHandled(value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                    manualHandled === value
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Date range picker */}
          <div className={`items-center gap-2 flex-wrap ${tab === "all" ? "flex" : "hidden"}`}>
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
        {tab === "all" && (
          <OrderFilters
            paymentFilter={paymentFilter}
            setPaymentFilter={setPaymentFilter}
            fulfillmentFilter={fulfillmentFilter}
            setFulfillmentFilter={setFulfillmentFilter}
            clearFilters={clearFilters}
          />
        )}
      </div>
      
      {tab === "all" ? (
        <OrdersTable
          search={search}
          paymentFilter={paymentFilter}
          fulfillmentFilter={fulfillmentFilter}
          startDate={startDate}
          endDate={endDate}
        />
      ) : (
        <ManualShippingTable
          search={search}
          handled={manualHandled}
          // Retrying or handling an order changes the badge — keep them in step.
          onCountChange={() => void refreshManualCount()}
        />
      )}
    </PageWrapper>
  );
}
