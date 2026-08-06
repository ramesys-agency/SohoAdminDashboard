import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createReturns, liveReturnedUnits } from "../../../../api/returns";
import type { Order } from "../../../../api/orders";

interface RecordReturnModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}

interface LineState {
  selected: boolean;
  quantity: number;
  reason: string;
}

/** Reasons that cover most of what customers report over WhatsApp. */
const COMMON_REASONS = [
  "Wrong size",
  "Damaged on arrival",
  "Wrong item sent",
  "Not as described",
  "Changed mind",
];

export default function RecordReturnModal({
  isOpen,
  order,
  onClose,
  onSuccess,
}: RecordReturnModalProps) {
  const [lines, setLines] = useState<Record<string, LineState>>({});
  const [note, setNote] = useState("");
  const [markOrderReturned, setMarkOrderReturned] = useState(true);
  const [saving, setSaving] = useState(false);

  /** Units still eligible per item — what's left after existing live returns. */
  const remainingByItem = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of order.items) {
      map[item.id] = item.quantity - liveReturnedUnits(item.returns);
    }
    return map;
  }, [order.items]);

  const eligibleItems = order.items.filter(
    (item) => (remainingByItem[item.id] ?? 0) > 0,
  );

  if (!isOpen) return null;

  const getLine = (itemId: string): LineState =>
    lines[itemId] ?? { selected: false, quantity: 1, reason: "" };

  const setLine = (itemId: string, patch: Partial<LineState>) =>
    setLines((prev) => ({
      ...prev,
      [itemId]: { ...getLine(itemId), ...patch },
    }));

  const selectedIds = Object.keys(lines).filter((id) => lines[id]?.selected);

  const reset = () => {
    setLines({});
    setNote("");
    setMarkOrderReturned(true);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedIds.length === 0) {
      toast.error("Select at least one item to return");
      return;
    }

    const missingReason = selectedIds.find((id) => !getLine(id).reason.trim());
    if (missingReason) {
      toast.error("Every selected item needs a reason");
      return;
    }

    try {
      setSaving(true);
      await createReturns(order.id, {
        items: selectedIds.map((id) => ({
          orderItemId: id,
          quantity: getLine(id).quantity,
          reason: getLine(id).reason.trim(),
        })),
        ...(note.trim() ? { note: note.trim() } : {}),
        markOrderReturned,
      });
      toast.success("Return recorded — the customer has been notified");
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to record return",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Record Return</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Order {order.orderCode || order.id.slice(0, 8).toUpperCase()} —
              pick what the customer is sending back
            </p>
          </div>
          <button
            onClick={handleClose}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {eligibleItems.length === 0 ? (
          <div className="p-10 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300">
              assignment_turned_in
            </span>
            <p className="text-sm font-bold text-slate-700 mt-3">
              Nothing left to return
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Every unit on this order is already covered by a return.
            </p>
            <button
              onClick={handleClose}
              className="mt-5 px-5 py-2.5 text-sm font-bold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="p-6 space-y-3 overflow-y-auto flex-1">
              {eligibleItems.map((item) => {
                const line = getLine(item.id);
                const remaining = remainingByItem[item.id] ?? 0;
                const alreadyReturned = item.quantity - remaining;

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-4 transition-colors ${
                      line.selected
                        ? "border-primary/40 bg-primary/5"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={line.selected}
                        onChange={(e) =>
                          setLine(item.id, {
                            selected: e.target.checked,
                            quantity: Math.min(line.quantity, remaining),
                          })
                        }
                        className="mt-1 size-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">
                          {item.product?.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.variant?.size || "N/A"} /{" "}
                          {item.variant?.colorName || "N/A"} · ৳
                          {parseFloat(item.priceAtBuy).toLocaleString()} each
                        </p>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                          {remaining} of {item.quantity} returnable
                          {alreadyReturned > 0 &&
                            ` · ${alreadyReturned} already returned`}
                        </p>
                      </div>
                    </label>

                    {line.selected && (
                      <div className="mt-4 pl-7 space-y-3">
                        <div className="flex items-center gap-3">
                          <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Quantity
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={remaining}
                            value={line.quantity}
                            onChange={(e) =>
                              setLine(item.id, {
                                quantity: Math.max(
                                  1,
                                  Math.min(
                                    remaining,
                                    parseInt(e.target.value, 10) || 1,
                                  ),
                                ),
                              })
                            }
                            className="w-20 rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                          <span className="text-xs text-slate-400">
                            max {remaining}
                          </span>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={line.reason}
                            onChange={(e) =>
                              setLine(item.id, { reason: e.target.value })
                            }
                            placeholder="Reason for return (required)"
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {COMMON_REASONS.map((reason) => (
                              <button
                                key={reason}
                                type="button"
                                onClick={() => setLine(item.id, { reason })}
                                className="px-2.5 py-1 text-[11px] font-bold rounded-full border border-slate-200 text-slate-600 hover:border-primary hover:text-primary transition-colors"
                              >
                                {reason}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-2 space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Internal note{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="e.g. Customer sent photos on WhatsApp — sleeve seam torn"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
                <p className="text-[11px] text-slate-400">
                  Shown to the customer alongside the return in the app.
                </p>
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={markOrderReturned}
                  onChange={(e) => setMarkOrderReturned(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="text-xs text-slate-600">
                  Mark the whole order as{" "}
                  <span className="font-bold">Returned</span> if this covers
                  every remaining item
                </span>
              </label>
            </div>

            <div className="flex gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 text-sm font-bold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || selectedIds.length === 0}
                className="flex-1 py-3 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
              >
                {saving
                  ? "Recording..."
                  : `Record Return${selectedIds.length > 1 ? ` (${selectedIds.length} items)` : ""}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
