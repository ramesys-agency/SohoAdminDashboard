interface StatusBadgeProps {
  status: string;
}

const variants: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
  draft: "bg-slate-100 text-slate-600",
  archived: "bg-amber-100 text-amber-700",
  scheduled: "bg-slate-100 text-slate-600",
  delivered: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  cancelled: "bg-red-100 text-red-700",
  returned: "bg-orange-100 text-orange-700",
  fulfilled: "bg-blue-100 text-blue-700",
  unfulfilled: "bg-slate-100 text-slate-600",
  paid: "bg-green-100 text-green-700",
  success: "bg-green-100 text-green-700",
  cod_pending: "bg-amber-100 text-amber-700",
  cod_collected: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
  vip: "bg-emerald-100 text-emerald-700",
  regular: "bg-blue-100 text-blue-700",
  "new lead": "bg-amber-100 text-amber-700",
  "churn risk": "bg-red-100 text-red-700",
  completed: "bg-emerald-100 text-emerald-700",
  manual_shipping: "bg-amber-100 text-amber-700",
  standard: "bg-slate-100 text-slate-600",
};

const dotVariants: Record<string, string> = {
  active: "bg-emerald-500",
  inactive: "bg-slate-400",
  draft: "bg-slate-400",
  archived: "bg-amber-500",
  scheduled: "bg-slate-400",
  delivered: "bg-emerald-500",
  pending: "bg-amber-500",
  processing: "bg-blue-500",
  shipped: "bg-indigo-500",
  cancelled: "bg-red-500",
  returned: "bg-orange-500",
  fulfilled: "bg-blue-500",
  unfulfilled: "bg-slate-400",
  paid: "bg-green-500",
  success: "bg-green-500",
  cod_pending: "bg-amber-500",
  cod_collected: "bg-green-500",
  failed: "bg-red-500",
  refunded: "bg-purple-500",
  vip: "bg-emerald-500",
  regular: "bg-blue-500",
  "new lead": "bg-amber-500",
  "churn risk": "bg-red-500",
  completed: "bg-emerald-500",
  manual_shipping: "bg-amber-500",
  standard: "bg-slate-400",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const colorClass = variants[key] ?? "bg-slate-100 text-slate-600";
  const dotClass = dotVariants[key] ?? "bg-slate-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${colorClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
      {status}
    </span>
  );
}
