import { useState } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import Button from "../../../../components/ui/Button";
import { resolveStatusConflict, type Order } from "../../../../api/orders";

interface StatusConflictBannerProps {
  order: Order;
  onResolved: () => Promise<void> | void;
}

/**
 * Shown when our status and RoadRush's disagree.
 *
 * The backend deliberately does not settle these on its own — an admin
 * cancelled an order the courier is still delivering, or the courier called off
 * a delivery we think is fine. Both have consequences for stock and money that
 * only a human should sign off, so the disagreement is put in front of one
 * instead of being resolved by whoever wrote last.
 */
export default function StatusConflictBanner({
  order,
  onResolved,
}: StatusConflictBannerProps) {
  const [busy, setBusy] = useState<"accept" | "keep" | null>(null);

  if (!order.statusConflict) return null;

  const reviewed = Boolean(order.statusConflictAckAt);

  const resolve = async (choice: "accept" | "keep") => {
    try {
      setBusy(choice);
      await resolveStatusConflict(order.id, choice);
      toast.success(
        choice === "accept"
          ? "RoadRush's status applied"
          : "Status kept — this conflict is marked as reviewed",
      );
      await onResolved();
    } catch (error: any) {
      console.error("Failed to resolve the status conflict:", error);
      toast.error(
        error?.response?.data?.message || "Could not resolve this conflict",
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      className={`mb-6 rounded-xl border p-4 ${
        reviewed
          ? "border-slate-200 bg-slate-50"
          : "border-rose-200 bg-rose-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`material-symbols-outlined ${
            reviewed ? "text-slate-500" : "text-rose-600"
          }`}
        >
          {reviewed ? "history" : "sync_problem"}
        </span>

        <div className="flex-1">
          <p
            className={`text-sm font-bold ${
              reviewed ? "text-slate-900" : "text-rose-900"
            }`}
          >
            Status conflict
            {reviewed && " — reviewed"}
          </p>
          <p
            className={`text-sm ${reviewed ? "text-slate-700" : "text-rose-800"}`}
          >
            {order.statusConflictReason}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
            <span className="text-slate-600">
              <span className="font-bold uppercase tracking-wider text-slate-500">
                Ours:
              </span>{" "}
              <span className="font-bold">{order.status}</span>
              {order.adminStatusPinned && " (pinned)"}
            </span>
            <span className="text-slate-600">
              <span className="font-bold uppercase tracking-wider text-slate-500">
                RoadRush:
              </span>{" "}
              <span className="font-bold">
                {order.logisticsStatusName || order.logisticsStatus || "—"}
              </span>
            </span>
            {reviewed && (
              <span className="text-slate-500 italic">
                Reviewed {dayjs(order.statusConflictAckAt).format("MMM DD, hh:mm A")}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            isLoading={busy === "keep"}
            disabled={busy !== null || reviewed}
            onClick={() => resolve("keep")}
          >
            Keep ours
          </Button>
          <Button
            size="sm"
            isLoading={busy === "accept"}
            disabled={busy !== null || !order.logisticsStatus}
            onClick={() => resolve("accept")}
          >
            Accept RoadRush
          </Button>
        </div>
      </div>

      {!reviewed && (
        <p className="mt-3 text-xs text-rose-700">
          Accepting applies RoadRush's status and everything that follows from
          it — a cancellation puts the units back on the shelf. Keeping ours pins
          the status against the courier; it comes back here if RoadRush reports
          something new.
        </p>
      )}
    </div>
  );
}
