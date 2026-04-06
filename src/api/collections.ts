import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";

export interface CollectionPlacement {
  id: string;
  collectionId: string;
  isBanner: boolean;
  imageUrl: string;
  page: string;
  section: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  gender: string[];
  createdAt: string;
  collectionPlacements: CollectionPlacement[];
  productCount: number;
}

export interface CollectionsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CollectionsResponse {
  success: boolean;
  data: Collection[];
  meta: CollectionsMeta;
}

export const getCollections = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  placementPage?: string,
): Promise<CollectionsResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (search) params.search = search;
  if (placementPage) params.placementPage = placementPage;

  const { data } = await api.get<CollectionsResponse>(
    apiEndpoint.collections.base,
    {
      params,
    },
  );
  return data;
};

export interface CollectionByIdResponse {
  success: boolean;
  data: Collection;
}

export const getCollectionById = async (
  id: string,
): Promise<CollectionByIdResponse> => {
  const { data } = await api.get<CollectionByIdResponse>(
    apiEndpoint.collections.byId(id),
  );
  return data;
};

export const addProductsToCollection = async (
  id: string,
  productIds: string[],
) => {
  const { data } = await api.post(
    `${apiEndpoint.collections.byId(id)}/products`,
    { productIds },
  );
  return data;
};

export const removeProductsFromCollection = async (
  id: string,
  productIds: string[],
) => {
  const { data } = await api.delete(
    `${apiEndpoint.collections.byId(id)}/products`,
    { data: { productIds } },
  );
  return data;
};
