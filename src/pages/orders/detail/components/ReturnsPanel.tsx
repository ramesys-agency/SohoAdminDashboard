import { useMemo, useState } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";
import StatusBadge from "../../../../components/ui/StatusBadge";
import RecordReturnModal from "./RecordReturnModal";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import {
  deleteReturn,
  updateReturnStatus,
  type ReturnStatus,
} from "../../../../api/returns";
import type { Order, OrderItem, OrderItemReturn } from "../../../../api/orders";

interface ReturnsPanelProps {
  order: Order;
  onChanged: () => void;
}

type ReturnRow = OrderItemReturn & { item: OrderItem };

/** What the admin can do next, mirroring the transitions the API enforces. */
const NEXT_ACTIONS: Record<
  ReturnStatus,
  Array<{ status: ReturnStatus; label: string; tone: "approve" | "reject" | "refund" }>
> = {
  requested: [
    { status: "approved", label: "Approve", tone: "approve" },
    { status: "rejected", label: "Reject", tone: "reject" },
  ],
  approved: [
    { status: "refunded", label: "Mark Refunded", tone: "refund" },
    { status: "rejected", label: "Reject", tone: "reject" },
  ],
  rejected: [],
  refunded: [],
};

const TONE_STYLES: Record<string, string> = {
  approve:
    "bg-emerald-600 text-white hover:bg-emerald-700 border border-transparent",
  reject: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
  refund:
    "bg-purple-600 text-white hover:bg-purple-700 border border-transparent",
};

export default function ReturnsPanel({ order, onChanged }: ReturnsPanelProps) {
  const [recordOpen, setRecordOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<{
    row: ReturnRow;
    status: ReturnStatus;
  } | null>(null);

  /** Flatten item.returns into rows, keeping the item for product context. */
  const rows = useMemo<ReturnRow[]>(
    () =>
      order.items
        .flatMap((item) => (item.returns ?? []).map((r) => ({ ...r, item })))
        .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()),
    [order.items],
  );

  // Nothing can come back before it has gone out, so the API only accepts
  // returns on a delivered (or already partly returned) order.
  const canRecord = order.status === "delivered" || order.status === "returned";

  const refundedTotal = rows
    .filter((r) => r.status === "refunded")
    .reduce((sum, r) => sum + parseFloat(r.refundAmount || "0"), 0);

  const applyStatus = async (
    row: ReturnRow,
    status: ReturnStatus,
    extra?: { note?: string; refundAmount?: string },
  ) => {
    try {
      setBusyId(row.id);
      await updateReturnStatus(row.id, status, extra);
      toast.success(`Return marked ${status}`);
      onChanged();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update return",
      );
    } finally {
      setBusyId(null);
      setPrompt(null);
    }
  };

  const handleAction = (row: ReturnRow, status: ReturnStatus) => {
    // Rejecting and refunding both need one more detail from the admin, so they
    // route through a prompt; approving is a straight transition.
    if (status === "rejected" || status === "refunded") {
      setPrompt({ row, status });
      return;
    }
    void applyStatus(row, status);
  };

  const [deleteTarget, setDeleteTarget] = useState<ReturnRow | null>(null);

  const confirmDeleteReturn = async () => {
    if (!deleteTarget) return;
    try {
      setBusyId(deleteTarget.id);
      await deleteReturn(deleteTarget.id);
      toast.success("Return removed");
      onChanged();
      setDeleteTarget(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to remove return",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-bold text-slate-900">Returns</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {rows.length === 0
              ? "Recorded by an admin after the customer gets in touch"
              : `${rows.length} return${rows.length > 1 ? "s" : ""} on this order${
                  refundedTotal > 0
                    ? ` · ৳${refundedTotal.toLocaleString()} refunded`
                    : ""
                }`}
          </p>
        </div>
        {canRecord ? (
          <button
            onClick={() => setRecordOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-lg">
              assignment_return
            </span>
            Record Return
          </button>
        ) : (
          <p className="text-[11px] text-slate-400 font-semibold max-w-[14rem] text-right">
            Returns can only be recorded once the order is delivered.
          </p>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-300">
            assignment_return
          </span>
          <p className="text-sm text-slate-500 mt-2">
            No returns on this order yet.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {rows.map((row) => {
            const actions = NEXT_ACTIONS[row.status];
            const busy = busyId === row.id;
            const lineValue =
              parseFloat(row.item.priceAtBuy) * row.quantity;

            return (
              <div key={row.id} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900">
                        {row.item.product?.name}
                      </p>
                      <StatusBadge status={row.status} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {row.item.variant?.size || "N/A"} /{" "}
                      {row.item.variant?.colorName || "N/A"} · qty{" "}
                      {row.quantity} of {row.item.quantity} · ৳
                      {lineValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-700 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1.5">
                        Reason
                      </span>
                      {row.reason}
                    </p>
                    {row.note && (
                      <p className="text-xs text-slate-500 mt-1 italic">
                        {row.note}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {dayjs(row.createdAt).format("MMM DD, YYYY - HH:mm")}
                      </span>
                      {row.refundAmount && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Refunded ৳
                          {parseFloat(row.refundAmount).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {actions.map((action) => (
                      <button
                        key={action.status}
                        disabled={busy}
                        onClick={() => handleAction(row, action.status)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors disabled:opacity-50 ${TONE_STYLES[action.tone]}`}
                      >
                        {action.label}
                      </button>
                    ))}
                    {row.status === "requested" && (
                      <button
                        disabled={busy}
                        onClick={() => setDeleteTarget(row)}
                        title="Remove a return recorded by mistake"
                        className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                      </button>
                    )}
                    {actions.length === 0 && (
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Final
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <RecordReturnModal
        isOpen={recordOpen}
        order={order}
        onClose={() => setRecordOpen(false)}
        onSuccess={onChanged}
      />

      {prompt && (
        <ReturnActionPrompt
          row={prompt.row}
          status={prompt.status}
          saving={busyId === prompt.row.id}
          onCancel={() => setPrompt(null)}
          onConfirm={(extra) => applyStatus(prompt.row, prompt.status, extra)}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteReturn}
        isLoading={busyId === deleteTarget?.id}
        title="Remove Return Record"
        message={
          <>
            Are you sure you want to remove this return record for{" "}
            <span className="font-semibold text-slate-900">
              &ldquo;{deleteTarget?.item?.product?.name}&rdquo;
            </span>
            ? This action is intended for returns recorded by mistake.
          </>
        }
      />
    </div>
  );
}

/**
 * Collects the one extra detail a reject or refund needs — the rejection reason
 * (the customer is notified with it) or the refund amount.
 */
function ReturnActionPrompt({
  row,
  status,
  saving,
  onCancel,
  onConfirm,
}: {
  row: ReturnRow;
  status: ReturnStatus;
  saving: boolean;
  onCancel: () => void;
  onConfirm: (extra: { note?: string; refundAmount?: string }) => void;
}) {
  const suggested = (parseFloat(row.item.priceAtBuy) * row.quantity).toString();
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState(suggested);

  const isRefund = status === "refunded";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isRefund) {
      const parsed = parseFloat(amount);
      if (Number.isNaN(parsed) || parsed < 0) {
        toast.error("Enter a valid refund amount");
        return;
      }
      onConfirm({
        refundAmount: amount,
        ...(note.trim() ? { note: note.trim() } : {}),
      });
      return;
    }

    if (!note.trim()) {
      toast.error("Give a reason — the customer sees it in their notification");
      return;
    }
    onConfirm({ note: note.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isRefund ? "Mark Refunded" : "Reject Return"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {row.item.product?.name} · qty {row.quantity}
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
          {isRefund && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Refund amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  ৳
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-8 pr-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Defaults to the line value (৳
                {parseFloat(suggested).toLocaleString()}). The order's payment is
                only marked refunded once refunds cover the full order total.
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              {isRefund ? (
                <>
                  Note{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </>
              ) : (
                "Reason for rejecting"
              )}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={
                isRefund
                  ? "e.g. Refunded via bKash, trx 8FQ22M"
                  : "e.g. Item shows signs of wear beyond the return window"
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
            {!isRefund && (
              <p className="text-[11px] text-slate-400">
                Sent to the customer in their notification.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 text-sm font-bold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 py-3 text-sm font-bold text-white rounded-xl shadow-lg transition-all disabled:opacity-50 ${
                isRefund
                  ? "bg-purple-600 shadow-purple-600/20 hover:bg-purple-700"
                  : "bg-red-600 shadow-red-600/20 hover:bg-red-700"
              }`}
            >
              {saving
                ? "Saving..."
                : isRefund
                  ? "Confirm Refund"
                  : "Reject Return"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
