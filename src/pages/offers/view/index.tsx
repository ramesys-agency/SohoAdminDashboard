import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import { getCouponById } from "../../../api/coupons";
import StatusBadge from "../../../components/ui/StatusBadge";

export default function ViewOffer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: coupon, isLoading } = useQuery({
    queryKey: ["coupon", id],
    queryFn: () => getCouponById(id || ""),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  if (!coupon) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-slate-800">
            Coupon not found
          </h2>
          <button
            onClick={() => navigate("/offers")}
            className="mt-4 text-primary font-bold"
          >
            Back to Offers
          </button>
        </div>
      </PageWrapper>
    );
  }

  const getStatus = () => {
    if (!coupon.isActive) return "Inactive";
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    if (now < validFrom) return "Scheduled";
    if (coupon.validTo && now > new Date(coupon.validTo)) return "Expired";
    return "Active";
  };

  return (
    <PageWrapper>
      <PageHeader
        title={`Coupon: ${coupon.code}`}
        description={
          <button
            onClick={() => navigate("/offers")}
            className="inline-flex items-center gap-1 text-primary text-sm font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Offers
          </button>
        }
        actions={
          <button
            onClick={() =>
              navigate("/offers/create", { state: { editCoupon: coupon } })
            }
            className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg shadow-lg shadow-primary/20 hover:opacity-90"
          >
            Edit Coupon
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-slate-900">
              Coupon Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Discount Type
                </p>
                <p className="text-sm font-bold text-slate-900 capitalize">
                  {coupon.type}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Discount Value
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {coupon.type === "percentage"
                    ? `${coupon.value}%`
                    : `$${Number(coupon.value).toFixed(2)}`}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Minimum Requirement
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {Number(coupon.minOrderAmount) > 0
                    ? `Order above $${Number(coupon.minOrderAmount).toFixed(2)}`
                    : "None"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Usage Limit
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {coupon.usageLimit
                    ? `${coupon.usageLimit} total uses`
                    : "Unlimited"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Valid From
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {new Date(coupon.validFrom).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Valid To
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {coupon.validTo
                    ? new Date(coupon.validTo).toLocaleString()
                    : "Never Expires"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Applies To
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {coupon.collections?.length
                    ? `Specific Collections (${coupon.collections.length})`
                    : "All Products"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Status
                </p>
                <StatusBadge status={getStatus()} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Usage History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(coupon as any).orders?.map((order: any) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-xs font-mono font-bold text-slate-900 uppercase">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">
                            {order.user?.firstName} {order.user?.lastName}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {order.user?.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-900">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="text-primary text-xs font-bold hover:underline"
                        >
                          View Order
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!coupon as any).orders?.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-xs text-slate-500"
                      >
                        No orders have used this coupon yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold mb-4 text-slate-900 text-center uppercase tracking-widest">
              Performance
            </h3>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-100"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={
                      364.4 -
                      (364.4 *
                        Math.min(
                          (coupon.usageCount / (coupon.usageLimit || 100)) *
                            100,
                          100,
                        )) /
                        100
                    }
                    className="text-primary"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900">
                    {coupon.usageCount}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Redeemed
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-500">
                  Usage Limit: {coupon.usageLimit || "Unlimited"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
