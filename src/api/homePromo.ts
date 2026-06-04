import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";
import type { ApiProduct } from "./products";
import type { Collection } from "./collections";

export interface HomePromo {
  id: string;
  title: string;
  description: string;
  contentType: "PRODUCT" | "COLLECTION";
  productId: string | null;
  product: ApiProduct | null;
  collectionId: string | null;
  collection: Collection | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomePromoResponse {
  success: boolean;
  data: HomePromo[];
}

export interface HomePromoSingleResponse {
  success: boolean;
  data: HomePromo;
  message?: string;
}

export const getHomePromos = async (isActive?: boolean): Promise<HomePromoResponse> => {
  const params: Record<string, any> = {};
  if (isActive !== undefined) {
    params.isActive = isActive;
  }
  const { data } = await api.get<HomePromoResponse>(apiEndpoint.homePromo.base, { params });
  return data;
};

export const getHomePromoById = async (id: string): Promise<HomePromoSingleResponse> => {
  const { data } = await api.get<HomePromoSingleResponse>(apiEndpoint.homePromo.byId(id));
  return data;
};

export interface CreateHomePromoPayload {
  title: string;
  description: string;
  contentType: "PRODUCT" | "COLLECTION";
  productId?: string | null;
  collectionId?: string | null;
  image?: File | string | null;
  isActive?: boolean;
}

export const createHomePromo = async (payload: CreateHomePromoPayload): Promise<HomePromoSingleResponse> => {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("description", payload.description);
  form.append("contentType", payload.contentType);
  if (payload.productId) form.append("productId", payload.productId);
  if (payload.collectionId) form.append("collectionId", payload.collectionId);
  if (payload.isActive !== undefined) form.append("isActive", String(payload.isActive));
  if (payload.image instanceof File) {
    form.append("image", payload.image);
  } else if (typeof payload.image === "string") {
    form.append("image", payload.image);
  }

  const { data } = await api.post<HomePromoSingleResponse>(apiEndpoint.homePromo.base, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export interface UpdateHomePromoPayload {
  title?: string;
  description?: string;
  contentType?: "PRODUCT" | "COLLECTION";
  productId?: string | null;
  collectionId?: string | null;
  image?: File | string | null;
  isActive?: boolean;
}

export const updateHomePromo = async (
  id: string,
  payload: UpdateHomePromoPayload
): Promise<HomePromoSingleResponse> => {
  const form = new FormData();
  if (payload.title !== undefined) form.append("title", payload.title);
  if (payload.description !== undefined) form.append("description", payload.description);
  if (payload.contentType !== undefined) form.append("contentType", payload.contentType);
  if (payload.productId !== undefined) form.append("productId", payload.productId || "");
  if (payload.collectionId !== undefined) form.append("collectionId", payload.collectionId || "");
  if (payload.isActive !== undefined) form.append("isActive", String(payload.isActive));
  if (payload.image instanceof File) {
    form.append("image", payload.image);
  } else if (typeof payload.image === "string") {
    form.append("image", payload.image);
  }

  const { data } = await api.put<HomePromoSingleResponse>(apiEndpoint.homePromo.byId(id), form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deleteHomePromo = async (id: string): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete<{ success: boolean; message: string }>(apiEndpoint.homePromo.byId(id));
  return data;
};
