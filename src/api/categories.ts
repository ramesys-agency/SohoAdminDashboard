import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";
import type { CategoryHierarchyResponse } from "../pages/categories/category.interface";

export const getCategoryHierarchy = async (
  page: number = 1,
  limit: number = 5,
): Promise<CategoryHierarchyResponse> => {
  const { data } = await api.get<CategoryHierarchyResponse>(
    apiEndpoint.categories.hierarchy,
    {
      params: {
        page,
        limit,
      },
    },
  );
  return data;
};

export interface GetCategoriesParams {
  isActive?: boolean;
  gender?: string;
  parentId?: string | null;
  page?: number;
  limit?: number;
}

export const getCategories = async (params?: GetCategoriesParams) => {
  const { data } = await api.get(apiEndpoint.categories.base, {
    params,
  });
  return data;
};


export interface CreateCategoryPayload {
  name: string;
  attributes: any[];
  parentId?: string | null;
  isActive?: boolean;
  imageUrl?: string | null;
}

export const createCategory = async (payload: CreateCategoryPayload) => {
  const { data } = await api.post(apiEndpoint.categories.base, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const getParentCategories = async () => {
  const { data } = await api.get(apiEndpoint.categories.parents);
  return data;
};

/** Shape returned by getParentCategories: roots with one level of children. */
export interface CategoryTreeNode {
  id: string;
  name: string;
  children?: { id: string; name: string }[];
}

export interface UpdateCategoryPayload {
  name?: string;
  attributes?: any[];
  parentId?: string | null;
  isActive?: boolean;
  displayOrder?: number;
  imageUrl?: string | null;
}

export const updateCategory = async (
  id: string,
  payload: UpdateCategoryPayload,
) => {
  const { data } = await api.put(apiEndpoint.categories.byId(id), payload);
  return data;
};

export const getCategoryById = async (id: string) => {
  const { data } = await api.get(apiEndpoint.categories.byId(id));
  return data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await api.delete(apiEndpoint.categories.byId(id));
  return data;
};
