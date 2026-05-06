import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../../components/ui/StatusBadge";
import Pagination from "../../../components/ui/Pagination";
import { deleteCoupon, expireCoupon } from "../../../api/coupons";
import type { Coupon } from "../../../api/coupons";

interface CouponsTableProps {
  coupons: Coupon[];
  isLoading?: boolean;
}

export default function CouponsTable({
  coupons,
  isLoading,
}: CouponsTableProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: handleDelete } = useMutation({
    mutationFn: (id: string) => deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  const { mutate: handleExpire } = useMutation({
    mutationFn: (id: string) => expireCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p>Loading coupons...</p>
        </div>
      </div>
    );
  }

  const getStatus = (coupon: Coupon) => {
    if (!coupon.isActive) return "Inactive";
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);

    if (now < validFrom) return "Scheduled";
    if (coupon.validTo && now > new Date(coupon.validTo)) return "Expired";
    return "Active";
  };

  const formatValue = (coupon: Coupon) => {
    if (coupon.type === "percentage") {
      return `${coupon.value}% Off`;
    }
    return `$${Number(coupon.value).toFixed(2)} Off`;
  };

  const formatType = (type: string) => {
    return type === "percentage" ? "Percentage" : "Fixed Amount";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50">
              {[
                "Coupon Code",
                "Type",
                "Value",
                "Usage Limit",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 ${h === "Actions" ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {coupons.map((coupon) => {
              const status = getStatus(coupon);
              const pct = coupon.usageLimit
                ? (coupon.usageCount / coupon.usageLimit) * 100
                : null;
              const barColor = pct && pct > 80 ? "bg-amber-500" : "bg-primary";

              return (
                <tr
                  key={coupon.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-bold bg-slate-100 px-2 py-1 rounded text-slate-900">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {formatType(coupon.type)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    {formatValue(coupon)}
                  </td>
                  <td className="px-6 py-4">
                    {coupon.usageLimit ? (
                      <div className="flex flex-col gap-1 w-32">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>{coupon.usageCount} Used</span>
                          <span>{coupon.usageLimit} Limit</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full ${barColor}`}
                            style={{ width: `${Math.min(pct || 0, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-slate-500">
                        Unlimited
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {status !== "Expired" && (
                        <button
                          title="Expire Now"
                          className="text-slate-400 hover:text-amber-500 transition-colors"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Mark this coupon as expired immediately?",
                              )
                            ) {
                              handleExpire(coupon.id);
                            }
                          }}
                        >
                          <span className="material-symbols-outlined">
                            timer_off
                          </span>
                        </button>
                      )}
                      <button
                        title="Delete"
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this coupon? (It will be hidden from the UI)",
                            )
                          ) {
                            handleDelete(coupon.id);
                          }
                        }}
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                      <button
                        title="View Details"
                        className="text-slate-400 hover:text-primary transition-colors"
                        onClick={() => navigate(`/offers/view/${coupon.id}`)}
                      >
                        <span className="material-symbols-outlined">
                          visibility
                        </span>
                      </button>
                      <button
                        title="Edit"
                        className="text-slate-400 hover:text-primary transition-colors"
                        onClick={() =>
                          navigate("/offers/create", {
                            state: { editCoupon: coupon },
                          })
                        }
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {coupons.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4">
        <span className="text-sm font-medium text-slate-500">
          Showing {coupons.length} coupons
        </span>
        <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
      </div>
    </div>
  );
}
