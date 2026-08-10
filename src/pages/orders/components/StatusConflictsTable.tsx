import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../../components/ui/Button";
import Pagination from "../../../components/ui/Pagination";
import {
  getStatusConflicts,
  resolveStatusConflict,
  type Order,
} from "../../../api/orders";
import dayjs from "dayjs";

const headers = [
  "Order ID",
  "Customer",
  "Our status",
  "RoadRush says",
  "Why",
  "Last sync",
  "Actions",
];

interface StatusConflictsTableProps {
  search: string;
  onCountChange?: (count: number) => void;
}

/**
 * The reconciliation queue: orders where our status and RoadRush's disagree and
 * nobody has chosen a side yet.
 *
 * The backend refuses to settle these silently — each one has consequences for
 * stock or money that a human should sign off. An order leaves this list once
 * someone accepts RoadRush's status or keeps ours, and comes back if RoadRush
 * later reports something new.
 */
export default function StatusConflictsTable({
  search,
  onCountChange,
}: StatusConflictsTableProps) {
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
  }, [debouncedSearch]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getStatusConflicts({
        search: debouncedSearch.trim() || undefined,
      });
      setOrders(data);
      onCountChange?.(data.length);
    } catch (error) {
      console.error("Failed to fetch status conflicts:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, onCountChange]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleResolve = async (order: Order, choice: "accept" | "keep") => {
    try {
      setBusyId(order.id);
      await resolveStatusConflict(order.id, choice);
      toast.success(
        choice === "accept"
          ? "RoadRush's status applied"
          : "Status kept — marked as reviewed",
      );
      await fetchOrders();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Could not resolve this conflict",
      );
    } finally {
      setBusyId(null);
    }
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(orders.length / itemsPerPage) || 1;
  const paginatedOrders = orders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
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
      <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
        <span className="material-symbols-outlined text-rose-600">
          sync_problem
        </span>
        <div>
          <p className="text-sm font-bold text-rose-900">
            These orders mean something different here than they do at RoadRush
          </p>
          <p className="text-sm text-rose-800">
            RoadRush has no cancel API, so an order cancelled here stays live on
            their side until someone calls them. Accepting their status applies
            it along with everything that follows — a cancellation puts the units
            back on the shelf. Keeping ours pins it against the courier.
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
                    Every order agrees with RoadRush.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="text-sm font-bold text-primary hover:underline"
                      >
                        {order.orderCode || order.id.slice(0, 8).toUpperCase()}
                      </button>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="text-sm font-bold text-slate-900">
                        {order.customerFullName ||
                          order.user?.fullName ||
                          "Guest User"}
                      </p>
                      {/* Phone first — settling a conflict usually means calling */}
                      <p className="text-xs text-slate-600 font-medium">
                        {order.customerMobileNumber ||
                          order.user?.phone ||
                          "No phone"}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <span className="text-sm font-bold text-slate-900 capitalize">
                        {order.status}
                      </span>
                      {order.adminStatusPinned && (
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Pinned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <span className="text-sm font-bold text-slate-900">
                        {order.logisticsStatusName || "—"}
                      </span>
                      {order.logisticsStatus && (
                        <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {order.logisticsStatus}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top max-w-[320px]">
                      <p className="text-xs text-slate-600">
                        {order.statusConflictReason || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top text-sm text-slate-600">
                      {order.lastLogisticsSync
                        ? dayjs(order.lastLogisticsSync).format("MMM DD, HH:mm")
                        : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busyId !== null}
                          isLoading={busyId === order.id}
                          onClick={() => handleResolve(order, "keep")}
                        >
                          Keep ours
                        </Button>
                        <Button
                          size="sm"
                          disabled={busyId !== null || !order.logisticsStatus}
                          onClick={() => handleResolve(order, "accept")}
                        >
                          Accept RoadRush
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {orders.length > itemsPerPage && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
