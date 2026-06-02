import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";

export interface PlacementPayload {
  collectionId?: string;
  collectionName?: string;
  page: string;
  section?: string;
  isBanner: boolean;
  isActive: boolean;
  image?: File | null;
}

export interface PlacementUpdatePayload {
  collectionId?: string;
  collectionName?: string;
  page?: string;
  section?: string;
  isBanner?: boolean;
  isActive?: boolean;
  image?: File | null;
}

export interface PlacementProduct {
  placementId: string;
  productId: string;
  displayOrder: number;
  product: {
    id: string;
    name: string;
    [key: string]: unknown;
  };
}

export interface PlacementDetail {
  id: string;
  collectionId: string;
  collection: { id: string; name: string; gender: string[] };
  isBanner: boolean;
  imageUrl: string | null;
  page: string;
  section: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  products: PlacementProduct[];
  _count: { products: number };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createPlacement = async (payload: PlacementPayload): Promise<any> => {
  const form = new FormData();
  if (payload.collectionId) form.append("collectionId", payload.collectionId);
  if (payload.collectionName) form.append("collectionName", payload.collectionName);
  form.append("page", payload.page);
  if (payload.section) form.append("section", payload.section);
  form.append("isBanner", String(payload.isBanner));
  form.append("isActive", String(payload.isActive));
  if (payload.image) form.append("image", payload.image);

  const { data } = await api.post(apiEndpoint.placements.base, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updatePlacement = async (id: string, payload: PlacementUpdatePayload): Promise<any> => {
  const form = new FormData();
  if (payload.collectionId) form.append("collectionId", payload.collectionId);
  if (payload.collectionName) form.append("collectionName", payload.collectionName);
  if (payload.page !== undefined) form.append("page", payload.page);
  if (payload.section !== undefined) form.append("section", payload.section);
  if (payload.isBanner !== undefined) form.append("isBanner", String(payload.isBanner));
  if (payload.isActive !== undefined) form.append("isActive", String(payload.isActive));
  if (payload.image) form.append("image", payload.image);

  const { data } = await api.put(apiEndpoint.placements.byId(id), form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deletePlacement = async (id: string): Promise<any> => {
  const { data } = await api.delete(apiEndpoint.placements.byId(id));
  return data;
};

export const getPlacementById = async (id: string): Promise<{ success: boolean; data: PlacementDetail }> => {
  const { data } = await api.get(`${apiEndpoint.placements.byId(id)}`);
  return data;
};

export const addProductsToPlacement = async (id: string, productIds: string[]) => {
  const { data } = await api.post(`${apiEndpoint.placements.byId(id)}/products`, { productIds });
  return data;
};

export const removeProductsFromPlacement = async (id: string, productIds: string[]) => {
  const { data } = await api.delete(`${apiEndpoint.placements.byId(id)}/products`, { data: { productIds } });
  return data;
};
