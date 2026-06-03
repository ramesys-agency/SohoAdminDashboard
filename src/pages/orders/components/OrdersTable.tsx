import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../../components/ui/StatusBadge";
import Pagination from "../../../components/ui/Pagination";
import Button from "../../../components/ui/Button";
import { getAllOrders, type Order } from "../../../api/orders";
import dayjs from "dayjs";

const headers = [
  "Order ID",
  "Customer",
  "Date",
  "Total",
  "Payment",
  "Fulfillment",
  "Actions",
];

interface OrdersTableProps {
  search: string;
  paymentFilter: string;
  fulfillmentFilter: string;
  startDate: string;
  endDate: string;
}

// Normalise label-style filter values ("Payment: All", "Paid", …) into API params
function toPaymentStatus(f: string): string | undefined {
  const v = f.replace("Payment: ", "").toLowerCase();
  return v === "all" ? undefined : v;
}

function toFulfillmentStatus(f: string): string | undefined {
  const v = f.replace("Fulfillment: ", "").toLowerCase();
  return v === "all" ? undefined : v;
}

export default function OrdersTable({
  search,
  paymentFilter,
  fulfillmentFilter,
  startDate,
  endDate,
}: OrdersTableProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounce search so we don't fire on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [search]);

  // Reset page to 1 when any filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, paymentFilter, fulfillmentFilter, startDate, endDate]);

  // Re-fetch whenever the effective filter set changes
  useEffect(() => {
    let cancelled = false;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllOrders({
          search: debouncedSearch.trim() || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          paymentStatus: toPaymentStatus(paymentFilter),
          fulfillmentStatus: toFulfillmentStatus(fulfillmentFilter),
        });
        if (!cancelled) setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchOrders();
    return () => { cancelled = true; };
  }, [debouncedSearch, paymentFilter, fulfillmentFilter, startDate, endDate]);

  // Pagination logic (server already filtered — just page the result set)
  const itemsPerPage = 10;
  const totalPages = Math.ceil(orders.length / itemsPerPage) || 1;
  const paginatedOrders = orders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 flex justify-center items-center shadow-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {headers.map((h) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider ${
                    h === "Actions" ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-500 font-medium"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => {
                const customerInitials = order.user?.fullName
                  ? order.user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U";

                const latestPayment = order.payments?.[0];

                return (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-primary hover:underline">
                        {order.orderCode || order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                          {customerInitials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {order.user?.fullName || "Guest User"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {order.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {dayjs(order.createdAt).format("MMM DD, YYYY")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                      ৳{parseFloat(order.totalAmount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        status={latestPayment?.status || "pending"}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/orders/${order.id}`);
                        }}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-slate-500">
                          open_in_new
                        </span>
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        showingText={`Showing ${paginatedOrders.length} of ${orders.length} total orders`}
      />
    </div>
  );
}
