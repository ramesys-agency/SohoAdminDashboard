import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";
import type { ReturnStatus } from "./returns";

/** Return rows embedded in an order item by the orders endpoints. */
export interface OrderItemReturn {
  id: string;
  reason: string;
  status: ReturnStatus;
  quantity: number;
  note?: string | null;
  refundAmount?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  priceAtBuy: string;
  product: {
    name: string;
  };
  variant: {
    size: string;
    colorName: string;
  };
  returns?: OrderItemReturn[];
}

export interface OrderPayment {
  id: string;
  amount: string;
  status: string;
  provider: string;
}

export interface Order {
  id: string;
  orderCode: string;
  totalAmount: string;
  status: string;
  cod: boolean;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  payments: OrderPayment[];
  address: {
    street: string;
    city: string;
    district: string;
    division: string;
    thana: string;
  };
  statusLogs: Array<{
    status: string;
    note: string;
    /** Raw RoadRush status name; null for admin-generated entries. */
    logisticsStatusName?: string | null;
    /** Who caused this entry — makes the timeline auditable after the fact. */
    source?: StatusSource;
    createdAt: string;
  }>;
  customerMobileNumber?: string;
  customerFullName?: string;
  customerEmail?: string;
  dropAddress?: string;
  receiverDivision?: string;
  receiverDistrict?: string;
  receiverThana?: string;
  lastLogisticsSync?: string;
  /** Raw RoadRush status name, e.g. "Rider Accepted". */
  logisticsStatusName?: string | null;

  // Status arbitration. `status` above is derived from the two opinions below —
  // see order-status.resolver.ts on the backend.
  /** Which opinion the resolver sided with. */
  statusSource?: StatusSource;
  /** The two sides disagree in a way a human has to settle. */
  statusConflict?: boolean;
  statusConflictReason?: string | null;
  /** Set once an admin has chosen a side. Null means it is still in the queue. */
  statusConflictAckAt?: string | null;
  /** The last status a human asked for. */
  adminStatus?: OrderStatus | null;
  adminStatusAt?: string | null;
  adminStatusReason?: string | null;
  /** An admin took ownership — RoadRush can flag but no longer move the status. */
  adminStatusPinned?: boolean;
  /** RoadRush's status collapsed onto our enum. */
  logisticsStatus?: OrderStatus | null;

  // Manual shipping fallback
  orderType?: OrderType;
  manualReason?: string | null;
  manualFlaggedAt?: string | null;
  manualHandledAt?: string | null;
  manualHandledBy?: string | null;
  /** Retry-queue state for the courier hand-off. Admin responses only. */
  logisticsJob?: {
    id: string;
    status: string;
    attempts: number;
    maxAttempts: number;
    nextRunAt: string;
    lastError?: string | null;
    lastAttempt?: string | null;
  } | null;

  // Logistics & COD figures mirrored from RoadRush order_details
  cashCollectAmount?: string | null;
  deliveryFee?: string | null;
  codCharge?: string | null;
  vat?: string | null;
  tax?: string | null;
  distanceKm?: string | null;
  deliveryPriority?: string | null;
  otp?: string | null;
  requestDeliveryDate?: string | null;
}

export interface OrderFilterParams {
  search?: string;
  startDate?: string;
  endDate?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  orderType?: OrderType;
}

/** `manual_shipping` orders need a human to arrange the delivery. */
export type OrderType = "standard" | "manual_shipping";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

/** Who decided an order's effective status. */
export type StatusSource = "admin" | "roadrush" | "system";

export interface ManualOrderFilterParams {
  /** "false" (default) = still needs attention, "true" = already arranged. */
  handled?: "true" | "false" | "all";
  search?: string;
}

export const getManualOrders = async (
  params?: ManualOrderFilterParams
): Promise<Order[]> => {
  const { data } = await api.get(apiEndpoint.orders.manual, { params });
  return data.data;
};

export const getManualOrdersCount = async (): Promise<number> => {
  const { data } = await api.get(apiEndpoint.orders.manualCount);
  return data.data?.pending ?? 0;
};

export const setManualHandled = async (
  id: string,
  handled: boolean
): Promise<any> => {
  const { data } = await api.post(
    handled
      ? apiEndpoint.orders.manualHandled(id)
      : apiEndpoint.orders.manualUnhandled(id)
  );
  return data;
};

/** Reset the retry counter and run the courier hand-off again right now. */
export const retryOrderSync = async (id: string): Promise<any> => {
  const { data } = await api.post(apiEndpoint.orders.retrySync(id));
  return data;
};

export const getAllOrders = async (params?: OrderFilterParams): Promise<Order[]> => {
  const { data } = await api.get(apiEndpoint.orders.adminAll, { params });
  return data.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const { data } = await api.get(apiEndpoint.orders.byId(id));
  return data.data;
};

export interface UpdateOrderStatusOptions {
  /** Bypass the normal status ladder — the "edit status" correction path. */
  override?: boolean;
  /** Put the payment back to unpaid when pulling an order back before delivery. */
  resetPayment?: boolean;
}

export const updateOrderStatus = async (
  id: string,
  status: string,
  note?: string,
  options?: UpdateOrderStatusOptions
): Promise<any> => {
  const { data } = await api.patch(apiEndpoint.orders.updateStatus(id), {
    status,
    note,
    ...options,
  });
  return data;
};

export const updatePaymentStatus = async (id: string, status: string): Promise<any> => {
  const { data } = await api.patch(apiEndpoint.orders.updatePayment(id), { status });
  return data;
};

export const syncOrderWithRoadRush = async (id: string): Promise<any> => {
  const { data } = await api.post(apiEndpoint.orders.syncRoadRush(id));
  return data;
};

export const refreshOrderStatus = async (id: string): Promise<any> => {
  const { data } = await api.post(apiEndpoint.orders.refreshStatus(id));
  return data;
};

/** Orders whose status disagrees with RoadRush's and nobody has looked yet. */
export const getStatusConflicts = async (params?: {
  search?: string;
}): Promise<Order[]> => {
  const { data } = await api.get(apiEndpoint.orders.conflicts, { params });
  return data.data;
};

export const getStatusConflictCount = async (): Promise<number> => {
  const { data } = await api.get(apiEndpoint.orders.conflictsCount);
  return data.data?.pending ?? 0;
};

/**
 * Settle a status conflict. `accept` takes RoadRush's word — including the
 * cancellations that restock units — and `keep` pins ours and marks it reviewed.
 */
export const resolveStatusConflict = async (
  id: string,
  choice: "accept" | "keep",
  note?: string,
): Promise<any> => {
  const { data } = await api.post(
    choice === "accept"
      ? apiEndpoint.orders.acceptLogisticsStatus(id)
      : apiEndpoint.orders.keepAdminStatus(id),
    { note },
  );
  return data;
};
