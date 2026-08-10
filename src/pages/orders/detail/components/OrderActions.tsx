import { useMemo, useState } from "react";
import dayjs from "dayjs";
import StatusBadge from "../../../../components/ui/StatusBadge";
import type { Order, UpdateOrderStatusOptions } from "../../../../api/orders";
import {
  ALL_ORDER_STATUSES,
  FULFILMENT_LADDER,
  STATUS_SUMMARY,
  isFinalStatus,
  nextStatusActions,
  type OrderStatusKey,
  type StatusAction,
} from "../../../../lib/orderStatus";

interface OrderActionsProps {
  order: Order;
  onUpdateStatus: (
    status: string,
    note?: string,
    options?: UpdateOrderStatusOptions,
  ) => Promise<void> | void;
  onUpdatePayment: (status: string) => Promise<void> | void;
}

const LADDER_LABELS: Record<string, { label: string; icon: string }> = {
  pending: { label: "Placed", icon: "receipt_long" },
  processing: { label: "Processing", icon: "inventory_2" },
  shipped: { label: "Shipped", icon: "local_shipping" },
  delivered: { label: "Delivered", icon: "task_alt" },
};

const TONE_STYLES: Record<StatusAction["tone"], string> = {
  primary:
    "bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 border border-transparent",
  danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
  warning:
    "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100",
};

/** Payment states where the money is in and there is nothing left to collect. */
const PAID_STATUSES = ["success", "cod_collected", "paid"];

/**
 * Everything an admin can *do* to an order, gated by where the order is in its
 * lifecycle. The status ladder only ever moves forward — an order is confirmed,
 * shipped, then delivered — so the dashboard offers the one or two moves that
 * are actually legal instead of a free-for-all dropdown.
 */
export default function OrderActions({
  order,
  onUpdateStatus,
  onUpdatePayment,
}: OrderActionsProps) {
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [saving, setSaving] = useState(false);

  const actions = nextStatusActions(order.status);
  const final = isFinalStatus(order.status);

  const payment = order.payments?.[0];
  const paymentStatus = (payment?.status ?? "pending").toLowerCase();
  const isPaid = PAID_STATUSES.includes(paymentStatus);
  const isRefunded = paymentStatus === "refunded";
  // Money follows the goods: nothing is collectable until the parcel is with the
  // customer. Collection is the only money action here — refunds are recorded
  // per item in the Returns panel, which flips this payment once they cover the
  // order total.
  const isDelivered = order.status === "delivered";
  const canMarkUnpaid = isDelivered && isPaid;
  const canMarkPaid = isDelivered && !isPaid && !isRefunded;

  /**
   * How far up the ladder this order got. Read from the timeline as well as the
   * current status so a cancelled order still shows where it stopped, and a
   * returned one lights the whole ladder — it can only have got there via
   * delivered, even if the courier never reported the steps in between.
   */
  const reached = useMemo(() => {
    const last = FULFILMENT_LADDER.length - 1;
    if (order.status === "returned") return last;

    const indexes = [
      FULFILMENT_LADDER.indexOf(order.status as OrderStatusKey),
      ...(order.statusLogs ?? []).map((log) =>
        FULFILMENT_LADDER.indexOf(log.status as OrderStatusKey),
      ),
    ];
    return Math.max(0, ...indexes);
  }, [order.status, order.statusLogs]);

  /** The reason the admin gave when they cancelled or accepted the return. */
  const closingNote = useMemo(() => {
    if (order.status !== "cancelled" && order.status !== "returned") return null;
    return (
      (order.statusLogs ?? []).find(
        (log) => log.status === order.status && log.note,
      ) ?? null
    );
  }, [order.status, order.statusLogs]);

  const run = async (task: () => Promise<void> | void) => {
    try {
      setSaving(true);
      await task();
      setPending(null);
    } catch {
      // The page already surfaced the reason as a toast; leaving the dialog open
      // means a rejected move doesn't look like it went through.
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 overflow-hidden">
      {/* Fulfilment */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900">Fulfilment</h3>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              {STATUS_SUMMARY[order.status as OrderStatusKey] ??
                "This order is in an unrecognised state."}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {actions.map((action) => (
              <button
                key={action.status}
                onClick={() => setPending({ kind: "status", action })}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl transition-all ${TONE_STYLES[action.tone]}`}
              >
                <span className="material-symbols-outlined text-lg">
                  {action.icon}
                </span>
                {action.label}
              </button>
            ))}
            {final && (
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Final
              </span>
            )}

            {/* The way back out of the ladder — for a status set by mistake. */}
            <button
              onClick={() => setPending({ kind: "override" })}
              title="Set any status, ignoring the normal order flow"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              Edit status
            </button>
          </div>
        </div>

        <StatusRail status={order.status} reached={reached} />

        {closingNote && (
          <div
            className={`mt-4 rounded-xl border p-3 ${
              order.status === "cancelled"
                ? "border-red-200 bg-red-50"
                : "border-orange-200 bg-orange-50"
            }`}
          >
            <p
              className={`text-[10px] font-bold uppercase tracking-wider ${
                order.status === "cancelled" ? "text-red-700" : "text-orange-700"
              }`}
            >
              {order.status === "cancelled" ? "Cancellation" : "Return"} reason
              shown to the customer
              {closingNote.createdAt
                ? ` · ${dayjs(closingNote.createdAt).format("MMM DD, hh:mm A")}`
                : ""}
            </p>
            <p
              className={`text-sm mt-1 ${
                order.status === "cancelled" ? "text-red-800" : "text-orange-800"
              }`}
            >
              {closingNote.note}
            </p>
          </div>
        )}
      </div>

      {/* Payment */}
      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900">Payment</h3>
            <StatusBadge status={paymentStatus} />
            <span className="text-xs text-slate-400">
              {order.cod ? "COD" : "Online"} · ৳
              {parseFloat(payment?.amount ?? order.totalAmount).toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            {paymentHint({
              orderStatus: order.status,
              paymentStatus,
              isPaid,
              isRefunded,
            })}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canMarkUnpaid && (
            <button
              onClick={() => setPending({ kind: "payment-unpaid" })}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-sm font-bold rounded-xl hover:bg-red-100 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                money_off
              </span>
              Payment not received
            </button>
          )}
          {canMarkPaid && (
            <button
              onClick={() => setPending({ kind: "payment-paid" })}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                payments
              </span>
              Payment received
            </button>
          )}
        </div>
      </div>

      {pending?.kind === "override" && (
        <OverrideDialog
          order={order}
          saving={saving}
          canResetPayment={isPaid}
          onCancel={() => setPending(null)}
          onConfirm={(status, note, resetPayment) =>
            run(() =>
              onUpdateStatus(status, note, { override: true, resetPayment }),
            )
          }
        />
      )}

      {pending && pending.kind !== "override" && (
        <ConfirmPanel
          pending={pending}
          order={order}
          saving={saving}
          onCancel={() => setPending(null)}
          onConfirm={(note) =>
            run(() => {
              if (pending.kind === "status") {
                return onUpdateStatus(pending.action.status, note);
              }
              return onUpdatePayment(
                pending.kind === "payment-paid" ? "success" : "failed",
              );
            })
          }
        />
      )}
    </div>
  );
}

type PendingAction =
  | { kind: "status"; action: StatusAction }
  | { kind: "override" }
  | { kind: "payment-paid" }
  | { kind: "payment-unpaid" };

/**
 * The escape hatch: pick any status, ladder or not.
 *
 * The ladder is right for day-to-day work but wrong as a one-way door — a
 * mis-click on "Mark Delivered" would otherwise be permanent. Cancelling still
 * needs its reason here, and undoing a delivery offers to un-settle the payment
 * the delivery settled.
 */
function OverrideDialog({
  order,
  saving,
  canResetPayment,
  onCancel,
  onConfirm,
}: {
  order: Order;
  saving: boolean;
  /** Whether there is a settled payment that a revert could put back. */
  canResetPayment: boolean;
  onCancel: () => void;
  onConfirm: (status: string, note?: string, resetPayment?: boolean) => void;
}) {
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [resetPayment, setResetPayment] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const current = order.status;
  const reasonRequired = status === "cancelled";

  // Only when the order is being pulled back onto the road. Cancelling a
  // delivered order is not a way back — that money needs refunding, and the
  // Mark Refunded button depends on the payment still reading as paid.
  const showPaymentReset =
    canResetPayment &&
    ["delivered", "returned"].includes(current) &&
    ["pending", "processing", "shipped"].includes(status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!status) {
      setError("Pick a status.");
      return;
    }
    if (reasonRequired && !note.trim()) {
      setError("A cancellation reason is required — the customer is shown it.");
      return;
    }

    onConfirm(
      status,
      note.trim() || undefined,
      showPaymentReset ? resetPayment : false,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Edit status</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Order {order.orderCode || order.id.slice(0, 8).toUpperCase()} ·
              currently {current}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex gap-2">
            <span className="material-symbols-outlined text-amber-600 text-lg">
              warning
            </span>
            <p className="text-xs text-amber-800">
              This ignores the normal order flow. Use it to correct a status set
              by mistake — the customer is notified of whatever you set.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Set status to
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setError(null);
              }}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Choose a status…</option>
              {ALL_ORDER_STATUSES.filter((s) => s !== current).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {current === "cancelled" && status !== "" && (
              <p className="text-[11px] text-slate-400">
                Undoing the cancellation takes the units back off the shelf.
              </p>
            )}
          </div>

          {showPaymentReset && (
            <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 p-3 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={resetPayment}
                onChange={(e) => setResetPayment(e.target.checked)}
                className="mt-0.5 size-4 accent-primary"
              />
              <span className="text-xs text-slate-600">
                <span className="font-bold text-slate-800">
                  Also put the payment back to unpaid.
                </span>{" "}
                Delivering the order settled it. Leave this on unless the money
                really was collected.
              </span>
            </label>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              {reasonRequired ? (
                "Reason for cancelling"
              ) : (
                <>
                  Note{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </>
              )}
            </label>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setError(null);
              }}
              rows={2}
              placeholder={
                reasonRequired
                  ? "e.g. The item is out of stock and we can't restock it in time"
                  : "e.g. Marked delivered by mistake — still with the courier"
              }
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all resize-none focus:ring-2 focus:ring-primary/20 ${
                error
                  ? "border-red-300 focus:border-red-400"
                  : "border-slate-200 focus:border-primary"
              }`}
            />
            {error ? (
              <p className="text-[11px] text-red-600 font-semibold">{error}</p>
            ) : (
              <p className="text-[11px] text-slate-400">
                Shown to the customer in their order timeline.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 text-sm font-bold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
            >
              Keep as is
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 text-sm font-bold text-white rounded-xl shadow-lg bg-slate-800 shadow-slate-800/20 hover:bg-slate-900 transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Set status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function paymentHint({
  orderStatus,
  paymentStatus,
  isPaid,
  isRefunded,
}: {
  orderStatus: string;
  paymentStatus: string;
  isPaid: boolean;
  isRefunded: boolean;
}): string {
  if (isRefunded) return "This payment has been refunded.";

  if (orderStatus === "cancelled") {
    return isPaid
      ? "The order was cancelled after payment — this money is owed back to the customer."
      : "Cancelled before any money was collected.";
  }

  if (orderStatus === "returned") {
    return isPaid
      ? "The order came back. Record the refund against the returned items in the Returns panel below."
      : "The order came back and no money was collected — nothing to refund.";
  }

  if (orderStatus === "delivered") {
    return isPaid
      ? "Delivered orders count as paid — settled automatically. Only use “Payment not received” if the money never arrived."
      : "Flagged as not received. Chase the payment, then mark it received.";
  }

  if (paymentStatus === "failed") {
    return "The online payment failed. It settles when the order is marked delivered.";
  }

  return "Nothing to collect yet — payment settles automatically when the order is marked delivered.";
}

/** pending → processing → shipped → delivered, with where it stopped. */
function StatusRail({
  status,
  reached,
}: {
  status: string;
  reached: number;
}) {
  const derailed = status === "cancelled" || status === "returned";

  return (
    <div className="mt-5 flex items-center gap-1 flex-wrap">
      {FULFILMENT_LADDER.map((step, index) => {
        const done = index <= reached;
        const current = !derailed && index === reached;
        const meta = LADDER_LABELS[step];

        return (
          <div key={step} className="flex items-center gap-1">
            {index > 0 && (
              <span
                className={`h-0.5 w-6 rounded-full ${
                  done ? "bg-primary" : "bg-slate-200"
                }`}
              />
            )}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold ${
                current
                  ? "bg-primary text-white"
                  : done
                    ? "bg-primary/10 text-primary"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {meta?.icon}
              </span>
              {meta?.label}
            </div>
          </div>
        );
      })}

      {derailed && (
        <div className="flex items-center gap-1">
          <span className="h-0.5 w-6 rounded-full bg-slate-200" />
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold ${
              status === "cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {status === "cancelled" ? "cancel" : "assignment_return"}
            </span>
            {status === "cancelled" ? "Cancelled" : "Returned"}
          </div>
        </div>
      )}
    </div>
  );
}

/** The payment dialogs — status moves get their copy from STATUS_ACTIONS. */
type PaymentActionKind = Exclude<PendingAction["kind"], "status" | "override">;

const PAYMENT_COPY: Record<
  PaymentActionKind,
  { title: string; consequence: string; confirmLabel: string; tone: string }
> = {
  "payment-paid": {
    title: "Mark payment received",
    consequence: "Records the full order amount as collected.",
    confirmLabel: "Confirm Payment",
    tone: "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700",
  },
  "payment-unpaid": {
    title: "Payment not received",
    consequence:
      "Flags the payment as failed even though the order was delivered. Use this only when the money never arrived.",
    confirmLabel: "Flag as unpaid",
    tone: "bg-red-600 shadow-red-600/20 hover:bg-red-700",
  },
};

/**
 * One dialog for a ladder move or a payment action — it spells out the
 * consequence and, for a cancellation, insists on the reason the customer will
 * be shown. The override has its own dialog (OverrideDialog).
 */
function ConfirmPanel({
  pending,
  order,
  saving,
  onCancel,
  onConfirm,
}: {
  pending: { kind: "status"; action: StatusAction } | { kind: PaymentActionKind };
  order: Order;
  saving: boolean;
  onCancel: () => void;
  onConfirm: (note?: string) => void;
}) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isStatus = pending.kind === "status";
  const action = isStatus ? pending.action : null;
  const copy = isStatus ? null : PAYMENT_COPY[pending.kind];

  const reasonRequired = action?.reason === "required";
  const title = action ? action.label : copy!.title;
  const consequence = action ? action.consequence : copy!.consequence;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = note.trim();

    if (reasonRequired && !trimmed) {
      setError("A reason is required — the customer is shown it.");
      return;
    }

    onConfirm(trimmed || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Order {order.orderCode || order.id.slice(0, 8).toUpperCase()} · ৳
              {parseFloat(order.totalAmount).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-slate-600">{consequence}</p>

          {/* Only a cancellation needs an explanation — the rest of the ladder is
              self-explanatory to the customer. */}
          {reasonRequired && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Reason for cancelling
              </label>
              <textarea
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setError(null);
                }}
                rows={3}
                autoFocus
                placeholder="e.g. The item is out of stock and we can't restock it in time"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all resize-none focus:ring-2 focus:ring-primary/20 ${
                  error
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-primary"
                }`}
              />
              {error ? (
                <p className="text-[11px] text-red-600 font-semibold">{error}</p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Shown to the customer in their order timeline and notification.
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 text-sm font-bold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
            >
              Keep as is
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 py-3 text-sm font-bold text-white rounded-xl shadow-lg transition-all disabled:opacity-50 ${
                action
                  ? action.tone === "danger"
                    ? "bg-red-600 shadow-red-600/20 hover:bg-red-700"
                    : action.tone === "warning"
                      ? "bg-amber-600 shadow-amber-600/20 hover:bg-amber-700"
                      : "bg-primary shadow-primary/20 hover:opacity-90"
                  : copy!.tone
              }`}
            >
              {saving ? "Saving..." : action ? action.label : copy!.confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
