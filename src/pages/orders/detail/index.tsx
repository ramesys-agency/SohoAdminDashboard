import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import OrderSummary from "./components/OrderSummary";
import OrderItems from "./components/OrderItems";
import CustomerInfo from "./components/CustomerInfo";
import OrderTimeline from "./components/OrderTimeline";
import {
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  type Order,
} from "../../../api/orders";

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
      await fetchOrder(); // Refresh
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };

  const handleUpdatePayment = async (status: string) => {
    if (!id) return;
    try {
      await updatePaymentStatus(id, status);
      await fetchOrder(); // Refresh
    } catch (error) {
      console.error("Failed to update payment status:", error);
      alert("Failed to update payment status");
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1325ec]"></div>
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
            className="mt-4 text-[#1325ec] hover:underline"
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
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-1 text-[#1325ec] text-sm font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Orders
          </button>
        }
      />

      <OrderSummary
        order={order}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePayment={handleUpdatePayment}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OrderItems order={order} />
          <CustomerInfo order={order} />
        </div>
        <div>
          <OrderTimeline order={order} />
        </div>
      </div>
    </PageWrapper>
  );
}
