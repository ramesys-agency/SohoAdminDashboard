import { useState } from "react";
import StatusBadge from "../../../components/ui/StatusBadge";
import Pagination from "../../../components/ui/Pagination";

const coupons = [
  {
    code: "SUMMER24",
    type: "Percentage",
    value: "20% Off",
    used: 500,
    limit: 1000,
    pct: 50,
    barColor: "bg-[#1325ec]",
    status: "Active",
  },
  {
    code: "WELCOME10",
    type: "Fixed Amount",
    value: "$10.00 Off",
    used: null,
    limit: null,
    pct: null,
    barColor: "",
    status: "Active",
  },
  {
    code: "SAVE50NOW",
    type: "Percentage",
    value: "50% Off",
    used: 42,
    limit: 50,
    pct: 84,
    barColor: "bg-amber-500",
    status: "Active",
  },
  {
    code: "BFRIDAY24",
    type: "Percentage",
    value: "35% Off",
    used: 0,
    limit: 2000,
    pct: 0,
    barColor: "bg-[#1325ec]",
    status: "Scheduled",
  },
];

export default function CouponsTable() {
  const [page, setPage] = useState(1);

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
            {coupons.map((coupon) => (
              <tr
                key={coupon.code}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-sm font-bold bg-slate-100 px-2 py-1 rounded text-slate-900">
                    {coupon.code}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                  {coupon.type}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">
                  {coupon.value}
                </td>
                <td className="px-6 py-4">
                  {coupon.pct !== null ? (
                    <div className="flex flex-col gap-1 w-32">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>{coupon.used} Used</span>
                        <span>{coupon.limit} Limit</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full ${coupon.barColor}`}
                          style={{ width: `${coupon.pct}%` }}
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
                  <StatusBadge status={coupon.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-[#1325ec] transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4">
        <span className="text-sm font-medium text-slate-500">
          Showing 1 to 4 of 12 coupons
        </span>
        <Pagination currentPage={page} totalPages={3} onPageChange={setPage} />
      </div>
    </div>
  );
}
