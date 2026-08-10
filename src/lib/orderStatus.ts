/**
 * The order lifecycle as the admin dashboard is allowed to drive it.
 *
 * This mirrors ADMIN_STATUS_TRANSITIONS in the backend's orders.service.ts — the
 * API is the authority and rejects anything else, this map is what keeps the UI
 * from ever offering a move that would be rejected.
 */

export type OrderStatusKey =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

/** Every status, for the override picker — which is not bound by the ladder. */
export const ALL_ORDER_STATUSES: OrderStatusKey[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

/** The happy path, in order. Cancelled and returned sit outside it. */
export const FULFILMENT_LADDER: OrderStatusKey[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatusKey, OrderStatusKey[]> =
  {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered", "cancelled"],
    delivered: ["returned"],
    cancelled: [],
    returned: [],
  };

export interface StatusAction {
  status: OrderStatusKey;
  label: string;
  icon: string;
  tone: "primary" | "danger" | "warning";
  /**
   * Only a cancellation asks for a reason. Moving an order along its normal
   * course needs no explanation, and prompting for one on every step just
   * trained everyone to click straight past it.
   */
  reason: "required" | "none";
  /** Shown in the confirmation dialog so the consequences are explicit. */
  consequence: string;
}

/** How each reachable status is presented as an action the admin can take. */
export const STATUS_ACTIONS: Record<
  Exclude<OrderStatusKey, "pending">,
  StatusAction
> = {
  processing: {
    status: "processing",
    label: "Start Processing",
    icon: "inventory_2",
    tone: "primary",
    reason: "none",
    consequence:
      "The customer is told their order is being prepared. It can still be cancelled after this.",
  },
  shipped: {
    status: "shipped",
    label: "Mark Shipped",
    icon: "local_shipping",
    tone: "primary",
    reason: "none",
    consequence:
      "The customer is told the order is on its way. It can still be cancelled until it is delivered.",
  },
  delivered: {
    status: "delivered",
    label: "Mark Delivered",
    icon: "task_alt",
    tone: "primary",
    reason: "none",
    consequence:
      "Delivered counts as paid — the payment is settled automatically. The order can no longer be cancelled, only returned.",
  },
  cancelled: {
    status: "cancelled",
    label: "Cancel Order",
    icon: "cancel",
    tone: "danger",
    reason: "required",
    consequence:
      "Stock goes back on the shelf and the customer is notified with your reason. This cannot be undone.",
  },
  returned: {
    status: "returned",
    label: "Mark Returned",
    icon: "assignment_return",
    tone: "warning",
    reason: "none",
    consequence:
      "Marks the whole order as come back to us. Stock is not restocked automatically. You can then record the refund. Per-item reasons belong in the Returns panel below.",
  },
};

/** Actions available on an order in `status`, in the order they should appear. */
export function nextStatusActions(status: string): StatusAction[] {
  const key = status as OrderStatusKey;
  return (ORDER_STATUS_TRANSITIONS[key] ?? [])
    .filter((next): next is Exclude<OrderStatusKey, "pending"> => next !== "pending")
    .map((next) => STATUS_ACTIONS[next]);
}

/** Terminal states — nothing left for an admin to change. */
export function isFinalStatus(status: string): boolean {
  return (ORDER_STATUS_TRANSITIONS[status as OrderStatusKey] ?? []).length === 0;
}

/** One-line explanation of where the order stands, shown above the actions. */
export const STATUS_SUMMARY: Record<OrderStatusKey, string> = {
  pending:
    "Order placed and awaiting confirmation. Check stock, then start processing — or cancel with a reason.",
  processing: "Being prepared for hand-off to the courier.",
  shipped:
    "With the courier. Mark it delivered once the customer has it — or cancel it if it never gets there.",
  delivered:
    "The customer has the goods. It can no longer be cancelled — if they send it back, mark it returned.",
  cancelled: "Cancelled. Stock was returned to inventory.",
  returned: "Returned to us. Record the refund once the money is sent back.",
};
