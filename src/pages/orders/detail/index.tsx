import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import OrderSummary from "./components/OrderSummary";
import OrderItems from "./components/OrderItems";
import CustomerInfo from "./components/CustomerInfo";
import OrderTimeline from "./components/OrderTimeline";
import LogisticsDetails from "./components/LogisticsDetails";
import ReturnsPanel from "./components/ReturnsPanel";
import {
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  syncOrderWithRoadRush,
  type Order,
  refreshOrderStatus,
  retryOrderSync,
  setManualHandled,
} from "../../../api/orders";
import dayjs from "dayjs";
import Button from "../../../components/ui/Button";

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (status: string, note?: string) => {
    if (!id) return;
    try {
      await updateOrderStatus(id, status, note);
      toast.success("Status updated successfully");
      await fetchOrder(); // Refresh
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update status",
      );
    }
  };

  const handleUpdatePayment = async (status: string) => {
    if (!id) return;
    try {
      await updatePaymentStatus(id, status);
      toast.success("Payment status updated successfully");
      await fetchOrder(); // Refresh
    } catch (error: any) {
      console.error("Failed to update payment status:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update payment status",
      );
    }
  };

  const handleSyncRoadRush = async () => {
    if (!id) return;
    try {
      await syncOrderWithRoadRush(id);
      toast.success("Order synced with RoadRush successfully!");
      await fetchOrder();
    } catch (error: any) {
      console.error("Failed to sync with RoadRush:", error);
      toast.error(
        error?.response?.data?.message || "Failed to sync with RoadRush",
      );
    }
  };

  const handleRetrySync = async () => {
    if (!id) return;
    try {
      const response = await retryOrderSync(id);
      if (response?.data?.order?.orderCode) {
        toast.success("Order handed to the courier successfully");
      } else {
        toast.warning(
          "The courier is still unreachable — the order stays queued for another attempt",
        );
      }
      await fetchOrder();
    } catch (error: any) {
      console.error("Failed to retry logistics sync:", error);
      toast.error(error?.response?.data?.error || "Retry failed");
    }
  };

  const handleToggleManualHandled = async () => {
    if (!id || !order) return;
    try {
      await setManualHandled(id, !order.manualHandledAt);
      toast.success(
        order.manualHandledAt
          ? "Order moved back to the manual shipping queue"
          : "Order marked as handled",
      );
      await fetchOrder();
    } catch (error: any) {
      console.error("Failed to update manual shipping state:", error);
      toast.error(
        error?.response?.data?.error || "Could not update this order",
      );
    }
  };

  const handleRefreshStatus = async () => {
    if (!id) return;
    try {
      await refreshOrderStatus(id);
      toast.success("Status refreshed successfully");
      await fetchOrder();
    } catch (error: any) {
      console.error("Failed to refresh status:", error);
      toast.error(error?.response?.data?.message || "Failed to refresh status");
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageWrapper>
    );
  }

  if (!order) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-slate-900">Order not found</h2>
          <button
            onClick={() => navigate("/orders")}
            className="mt-4 text-primary"
          >
            Back to Orders
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title={`Order ${order.orderCode || order.id.slice(0, 8).toUpperCase()}`}
        description={
          <Button onClick={() => navigate("/orders")} variant="ghost" size="sm">
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Orders
          </Button>
        }
        actions={
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              {order.lastLogisticsSync && (
                <span className="text-[10px] text-slate-400 font-medium italic">
                  Last updated:{" "}
                  {dayjs(order.lastLogisticsSync).format("MMM DD, hh:mm A")}
                </span>
              )}
              {order.orderCode ? (
                <button
                  onClick={handleRefreshStatus}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/5 text-primary text-sm font-bold rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">
                    refresh
                  </span>
                  Refresh Status
                </button>
              ) : (
                <button
                  onClick={handleSyncRoadRush}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-md"
                >
                  <span className="material-symbols-outlined text-lg">
                    sync
                  </span>
                  Sync with RoadRush
                </button>
              )}
            </div>
            {order.orderCode && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Tracking ID:
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100">
                  {order.orderCode}
                </span>
              </div>
            )}
          </div>
        }
      />

      {order.orderType === "manual_shipping" && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-600">
              local_shipping
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900">
                Manual shipping required
                {order.manualHandledAt && " — already handled"}
              </p>
              <p className="text-sm text-amber-800">
                The courier hand-off failed
                {order.logisticsJob
                  ? ` after ${order.logisticsJob.attempts} of ${order.logisticsJob.maxAttempts} attempts`
                  : ""}
                {order.manualFlaggedAt
                  ? ` on ${dayjs(order.manualFlaggedAt).format("MMM DD, hh:mm A")}`
                  : ""}
                . Arrange this delivery yourself, then mark it handled.
              </p>
              {order.manualReason && (
                <p className="mt-1 text-xs text-amber-700 font-mono break-all">
                  {order.manualReason}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!order.orderCode && (
                <Button variant="outline" size="sm" onClick={handleRetrySync}>
                  Retry sync
                </Button>
              )}
              <Button size="sm" onClick={handleToggleManualHandled}>
                {order.manualHandledAt ? "Reopen" : "Mark handled"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <OrderSummary
        order={order}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePayment={handleUpdatePayment}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OrderItems order={order} />
          <ReturnsPanel order={order} onChanged={fetchOrder} />
          <LogisticsDetails order={order} />
          <CustomerInfo order={order} />
        </div>
        <div>
          <OrderTimeline order={order} />
        </div>
      </div>
    </PageWrapper>
  );
}
