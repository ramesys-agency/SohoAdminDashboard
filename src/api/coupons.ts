import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed_amount";
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  userUsageLimit: number;
  createdAt: string;
  updatedAt: string;
  collections?: {
    collection: {
      id: string;
      title: string;
    };
  }[];
}

export const getAllCoupons = async (): Promise<Coupon[]> => {
  const { data } = await api.get<{ data: Coupon[] }>(apiEndpoint.coupons.base);
  return data.data;
};

export const getCouponById = async (id: string): Promise<Coupon> => {
  const { data } = await api.get<{ data: Coupon }>(apiEndpoint.coupons.byId(id));
  return data.data;
};

export interface CreateCouponPayload {
  code: string;
  type: "percentage" | "fixed_amount";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  isActive?: boolean;
  usageLimit?: number;
  userUsageLimit?: number;
  collectionIds?: string[];
}

export const createCoupon = async (payload: CreateCouponPayload) => {
  const { data } = await api.post(apiEndpoint.coupons.base, payload);
  return data;
};

export const updateCoupon = async (id: string, payload: Partial<CreateCouponPayload>) => {
  const { data } = await api.put(apiEndpoint.coupons.byId(id), payload);
  return data;
};

export const deleteCoupon = async (id: string) => {
  const { data } = await api.delete(apiEndpoint.coupons.byId(id));
  return data;
};

export const expireCoupon = async (id: string) => {
  const { data } = await api.put(`${apiEndpoint.coupons.byId(id)}/expire`);
  return data;
};
