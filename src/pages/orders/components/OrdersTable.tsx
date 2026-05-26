import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, paymentFilter, fulfillmentFilter, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    // Payment filter
    const latestPayment = order.payments?.[0];
    const paymentStatus = latestPayment?.status || "pending";
    if (paymentFilter !== "Payment: All") {
      const normalizedFilter = paymentFilter.toLowerCase();
      
      if (normalizedFilter === "paid") {
        if (paymentStatus.toLowerCase() !== "success" && paymentStatus.toLowerCase() !== "paid") return false;
      } else if (normalizedFilter === "pending") {
        if (paymentStatus.toLowerCase() !== "pending" && paymentStatus.toLowerCase() !== "cod_pending") return false;
      } else if (normalizedFilter === "refunded") {
        if (paymentStatus.toLowerCase() !== "refunded") return false;
      }
    }

    // Fulfillment filter
    // Options: "Fulfillment: All", "Fulfilled", "Unfulfilled", "Processing"
    if (fulfillmentFilter !== "Fulfillment: All") {
      const normalizedFilter = fulfillmentFilter.toLowerCase();
      // Order status options in database: pending, processing, shipped, delivered, cancelled
      if (normalizedFilter === "fulfilled") {
        if (order.status.toLowerCase() !== "delivered") return false;
      } else if (normalizedFilter === "unfulfilled") {
        if (order.status.toLowerCase() !== "pending" && order.status.toLowerCase() !== "cancelled") return false;
      } else if (normalizedFilter === "processing") {
        if (order.status.toLowerCase() !== "processing" && order.status.toLowerCase() !== "shipped") return false;
      }
    }

    // Date filter
    if (startDate) {
      const start = dayjs(startDate).startOf("day");
      const orderDate = dayjs(order.createdAt);
      if (orderDate.isBefore(start)) {
        return false;
      }
    }
    if (endDate) {
      const end = dayjs(endDate).endOf("day");
      const orderDate = dayjs(order.createdAt);
      if (orderDate.isAfter(end)) {
        return false;
      }
    }

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      const orderCode = (order.orderCode || "").toLowerCase();
      const orderId = (order.id || "").toLowerCase();
      const customerName = (order.user?.fullName || order.customerFullName || "guest user").toLowerCase();
      const customerEmail = (order.user?.email || order.customerEmail || "").toLowerCase();
      const customerPhone = (order.user?.phone || order.customerMobileNumber || "").toLowerCase();

      const matchesSearch =
        orderCode.includes(query) ||
        orderId.includes(query) ||
        customerName.includes(query) ||
        customerEmail.includes(query) ||
        customerPhone.includes(query);

      if (!matchesSearch) return false;
    }

    return true;
  });

  // Pagination logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice(
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
        showingText={`Showing ${paginatedOrders.length} of ${filteredOrders.length} total orders`}
      />
    </div>
  );
}
