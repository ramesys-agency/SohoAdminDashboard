import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";

/**
 * A placement is one page+section slot on the storefront. It owns its name,
 * slug, cover image and curated product list via a 1:1 collection created
 * behind it — two placements built from the same source stay independent.
 */
export interface Placement {
  id: string;
  name: string;
  slug: string;
  collectionId: string;
  description: string | null;
  /** When set, tapping the placement deep-links to this product. */
  productId: string | null;
  imageUrl: string | null;
  isBanner: boolean;
  page: string;
  section: string;
  displayOrder: number;
  isActive: boolean;
  gender: string[];
  productCount: number;
  /** First two product images — the collage layout draws these. */
  previewImages: string[];
  createdAt: string;
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

export interface PlacementDetail extends Placement {
  collection: { id: string; name: string; slug: string; gender: string[] };
  products: PlacementProduct[];
}

export interface PlacementPayload {
  name: string;
  description?: string;
  page: string;
  section: string;
  productId?: string | null;
  isBanner?: boolean;
  isActive?: boolean;
  image?: File | null;
  /** Copy this placement's curated product list into the new one. */
  sourcePlacementId?: string;
}

export type PlacementUpdatePayload = Partial<Omit<PlacementPayload, "sourcePlacementId">>;

const toForm = (payload: PlacementPayload | PlacementUpdatePayload): FormData => {
  const form = new FormData();
  const entries = Object.entries(payload) as [string, unknown][];

  for (const [key, value] of entries) {
    if (value === undefined) continue;
    if (key === "image") {
      if (value instanceof File) form.append("image", value);
      continue;
    }
    // null clears the deep-link server-side, so send it as an empty string.
    form.append(key, value === null ? "" : String(value));
  }

  return form;
};

export const getPlacements = async (params?: {
  page?: string;
  section?: string;
  isActive?: boolean;
}): Promise<{ success: boolean; data: Placement[] }> => {
  const { data } = await api.get(apiEndpoint.placements.base, { params });
  return data;
};

export const getPlacementById = async (
  id: string,
): Promise<{ success: boolean; data: PlacementDetail }> => {
  const { data } = await api.get(apiEndpoint.placements.byId(id));
  return data;
};

export const createPlacement = async (
  payload: PlacementPayload,
): Promise<{ success: boolean; data: PlacementDetail }> => {
  const { data } = await api.post(apiEndpoint.placements.base, toForm(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updatePlacement = async (
  id: string,
  payload: PlacementUpdatePayload,
): Promise<{ success: boolean; data: PlacementDetail }> => {
  const { data } = await api.put(apiEndpoint.placements.byId(id), toForm(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/** Clones a placement's look and products into a brand-new collection. */
export const duplicatePlacement = async (
  id: string,
  overrides?: { name?: string; page?: string; section?: string; isActive?: boolean },
): Promise<{ success: boolean; data: PlacementDetail }> => {
  const { data } = await api.post(apiEndpoint.placements.duplicate(id), overrides ?? {});
  return data;
};

/** Persists the whole page's order after a drag-and-drop. */
export const reorderPlacements = async (
  placements: { id: string; displayOrder: number }[],
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.patch(apiEndpoint.placements.reorder, { placements });
  return data;
};

export const deletePlacement = async (id: string): Promise<{ success: boolean }> => {
  const { data } = await api.delete(apiEndpoint.placements.byId(id));
  return data;
};

export const addProductsToPlacement = async (id: string, productIds: string[]) => {
  const { data } = await api.post(`${apiEndpoint.placements.byId(id)}/products`, { productIds });
  return data;
};

export const removeProductsFromPlacement = async (id: string, productIds: string[]) => {
  const { data } = await api.delete(`${apiEndpoint.placements.byId(id)}/products`, {
    data: { productIds },
  });
  return data;
};
