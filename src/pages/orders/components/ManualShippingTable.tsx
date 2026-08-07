import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Pagination from "../../../components/ui/Pagination";
import {
  getManualOrders,
  retryOrderSync,
  setManualHandled,
  type Order,
} from "../../../api/orders";
import dayjs from "dayjs";

const headers = [
  "Order ID",
  "Customer",
  "Deliver to",
  "Items",
  "Total",
  "Flagged",
  "Attempts",
  "Actions",
];

interface ManualShippingTableProps {
  search: string;
  /** "false" = still needs arranging, "true" = already handled by staff. */
  handled: "true" | "false" | "all";
  onCountChange?: (count: number) => void;
}

export default function ManualShippingTable({
  search,
  handled,
  onCountChange,
}: ManualShippingTableProps) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, handled]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getManualOrders({
        handled,
        search: debouncedSearch.trim() || undefined,
      });
      setOrders(data);
      onCountChange?.(data.length);
    } catch (error) {
      console.error("Failed to fetch manual shipping orders:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, handled, onCountChange]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRetry = async (order: Order) => {
    try {
      setBusyId(order.id);
      const response = await retryOrderSync(order.id);
      const synced = Boolean(response?.data?.order?.orderCode);
      window.alert(
        synced
          ? "Order handed to the courier successfully."
          : "The courier is still unreachable — the order stays queued for another attempt."
      );
      await fetchOrders();
    } catch (error: any) {
      window.alert(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Retry failed. Please try again."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleHandled = async (order: Order) => {
    try {
      setBusyId(order.id);
      await setManualHandled(order.id, !order.manualHandledAt);
      await fetchOrders();
    } catch (error: any) {
      window.alert(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Could not update this order."
      );
    } finally {
      setBusyId(null);
    }
  };

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
    <div className="space-y-4 mb-6">
      {/* Why these orders are here — the table alone doesn't say it */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <span className="material-symbols-outlined text-amber-600">
          local_shipping
        </span>
        <div>
          <p className="text-sm font-bold text-amber-900">
            These orders could not be sent to the courier automatically
          </p>
          <p className="text-sm text-amber-800">
            The customer has already been told their order is placed. Arrange the
            delivery manually, then mark it handled — or retry the automatic
            hand-off if the courier service is back up.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
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
                    colSpan={headers.length}
                    className="px-6 py-12 text-center text-slate-500 font-medium"
                  >
                    <span className="material-symbols-outlined text-emerald-500 text-3xl block mb-2">
                      check_circle
                    </span>
                    No orders need manual shipping.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const address = [
                    order.dropAddress,
                    order.receiverThana,
                    order.receiverDistrict,
                  ]
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="text-sm font-bold text-primary hover:underline"
                        >
                          {order.orderCode || order.id.slice(0, 8).toUpperCase()}
                        </button>
                        {order.manualHandledAt && (
                          <p className="text-[11px] font-semibold text-emerald-600 mt-1">
                            Handled {dayjs(order.manualHandledAt).format("MMM DD")}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <p className="text-sm font-bold text-slate-900">
                          {order.customerFullName || order.user?.fullName || "Guest User"}
                        </p>
                        {/* Phone first — staff call the customer to arrange delivery */}
                        <p className="text-xs text-slate-600 font-medium">
                          {order.customerMobileNumber || order.user?.phone || "No phone"}
                        </p>
                      </td>
                      <td className="px-6 py-4 align-top max-w-[220px]">
                        <p className="text-xs text-slate-600">{address || "—"}</p>
                      </td>
                      <td className="px-6 py-4 align-top max-w-[240px]">
                        <p className="text-xs text-slate-600">
                          {order.items
                            ?.map(
                              (i) =>
                                `${i.product?.name ?? "Item"} x${i.quantity}`
                            )
                            .join(", ") || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top text-sm font-bold text-slate-900">
                        ৳{parseFloat(order.totalAmount).toLocaleString()}
                        {order.cod && (
                          <span className="block text-[10px] font-bold text-amber-600 uppercase">
                            COD
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top text-sm text-slate-600">
                        {order.manualFlaggedAt
                          ? dayjs(order.manualFlaggedAt).format("MMM DD, HH:mm")
                          : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <span className="text-sm font-semibold text-slate-700">
                          {order.logisticsJob
                            ? `${order.logisticsJob.attempts}/${order.logisticsJob.maxAttempts}`
                            : "—"}
                        </span>
                        {order.manualReason && (
                          <p
                            className="text-[11px] text-red-600 max-w-[200px] truncate"
                            title={order.manualReason}
                          >
                            {order.manualReason}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={busyId === order.id}
                            onClick={() => handleRetry(order)}
                          >
                            Retry sync
                          </Button>
                          <Button
                            size="sm"
                            disabled={busyId === order.id}
                            onClick={() => handleToggleHandled(order)}
                          >
                            {order.manualHandledAt ? "Reopen" : "Mark handled"}
                          </Button>
                        </div>
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
          showingText={`Showing ${paginatedOrders.length} of ${orders.length} orders`}
        />
      </div>
    </div>
  );
}
