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
): Promise<CollectionsResponse> => {
  const { data } = await api.get<CollectionsResponse>(
    apiEndpoint.collections.base,
    {
      params: { page, limit },
    },
  );
  return data;
};
