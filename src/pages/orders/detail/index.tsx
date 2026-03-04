import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import OrderSummary from "./components/OrderSummary";
import OrderItems from "./components/OrderItems";
import CustomerInfo from "./components/CustomerInfo";
import OrderTimeline from "./components/OrderTimeline";

export default function OrderDetail() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageHeader
        title="Order Detail"
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
      <OrderSummary />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OrderItems />
          <CustomerInfo />
        </div>
        <div>
          <OrderTimeline />
        </div>
      </div>
    </PageWrapper>
  );
}
