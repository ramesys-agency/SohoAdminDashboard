import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";

export interface HomePromoPayload {
  title: string;
  description: string;
  contentType: "PRODUCT" | "COLLECTION";
  productId?: string | null;
  collectionId?: string | null;
  image?: File | null;
  isActive?: boolean;
}

export interface HomePromoResponse {
  success: boolean;
  data: {
    id: string;
    title: string;
    description: string;
    contentType: "PRODUCT" | "COLLECTION";
    productId: string | null;
    collectionId: string | null;
    imageUrl: string | null;
    isActive: boolean;
    product?: {
      id: string;
      name: string;
    } | null;
    collection?: {
      id: string;
      name: string;
    } | null;
  } | null;
}

export const getHomePromo = async (): Promise<HomePromoResponse> => {
  const { data } = await api.get<HomePromoResponse>(apiEndpoint.homePromo.base);
  return data;
};

export const updateHomePromo = async (payload: HomePromoPayload): Promise<HomePromoResponse> => {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("description", payload.description);
  form.append("contentType", payload.contentType);
  if (payload.productId) form.append("productId", payload.productId);
  if (payload.collectionId) form.append("collectionId", payload.collectionId);
  if (payload.isActive !== undefined) form.append("isActive", String(payload.isActive));
  if (payload.image) form.append("image", payload.image);

  const { data } = await api.put<HomePromoResponse>(apiEndpoint.homePromo.base, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
