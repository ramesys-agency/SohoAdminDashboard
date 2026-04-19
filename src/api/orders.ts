import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";

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
}

export const getAllOrders = async (): Promise<Order[]> => {
  const { data } = await api.get(apiEndpoint.orders.adminAll);
  return data.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const { data } = await api.get(apiEndpoint.orders.byId(id));
  return data.data;
};

export const updateOrderStatus = async (id: string, status: string, note?: string): Promise<any> => {
  const { data } = await api.patch(apiEndpoint.orders.updateStatus(id), { status, note });
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
