import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";

export type ReturnStatus = "requested" | "approved" | "rejected" | "refunded";

/** A return row as the API returns it, with its order item joined in. */
export interface OrderReturn {
  id: string;
  orderItemId: string;
  reason: string;
  status: ReturnStatus;
  quantity: number;
  note?: string | null;
  refundAmount?: string | null;
  createdAt: string;
  updatedAt: string;
  orderItem: {
    id: string;
    quantity: number;
    priceAtBuy: string;
    product: { id: string; name: string };
    variant: { id: string; size: string; colorName: string };
    order: {
      id: string;
      orderCode: string | null;
      status: string;
      totalAmount: string;
      createdAt: string;
      userId: string;
      user: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
      };
    };
  };
}

export interface CreateReturnLine {
  orderItemId: string;
  quantity: number;
  reason: string;
}

export interface CreateReturnPayload {
  items: CreateReturnLine[];
  note?: string;
  /** Defaults to true server-side: flips the order to `returned` when fully returned. */
  markOrderReturned?: boolean;
}

export interface ReturnFilterParams {
  status?: string;
  search?: string;
}

export const getAllReturns = async (
  params?: ReturnFilterParams,
): Promise<OrderReturn[]> => {
  const { data } = await api.get(apiEndpoint.returns.adminAll, { params });
  return data.data;
};

export const getReturnsForOrder = async (
  orderId: string,
): Promise<OrderReturn[]> => {
  const { data } = await api.get(apiEndpoint.returns.byOrder(orderId));
  return data.data;
};

export const createReturns = async (
  orderId: string,
  payload: CreateReturnPayload,
): Promise<OrderReturn[]> => {
  const { data } = await api.post(apiEndpoint.returns.create(orderId), payload);
  return data.data;
};

export const updateReturnStatus = async (
  returnId: string,
  status: ReturnStatus,
  extra?: { note?: string; refundAmount?: string | number },
): Promise<OrderReturn> => {
  const { data } = await api.patch(apiEndpoint.returns.update(returnId), {
    status,
    ...extra,
  });
  return data.data;
};

export const deleteReturn = async (returnId: string): Promise<void> => {
  await api.delete(apiEndpoint.returns.remove(returnId));
};

/** Units of an item already spoken for by a live (non-rejected) return. */
export const liveReturnedUnits = (
  returns: Array<Pick<OrderReturn, "status" | "quantity">> | undefined,
): number =>
  (returns ?? [])
    .filter((r) => r.status !== "rejected")
    .reduce((sum, r) => sum + r.quantity, 0);
