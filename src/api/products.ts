import api from "../lib/axios";
import { apiEndpoint } from "../lib/route";

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  stock: number;
  price: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductColor {
  colorName: string;
  colorValue: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  isPublished: boolean;
  primaryImage?: string;
  rating?: number;
  reviewCount?: number;
  availableColors?: ProductColor[];
  variantId?: string;
  isWishlisted?: boolean;
  isAddedToCart?: boolean;
  inStock?: boolean;
  gender?: string[];
  createdAt: string;
  updatedAt?: string;
  category?: ProductCategory;
}

export interface ProductsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  success: boolean;
  data: ApiProduct[];
  meta: ProductsMeta;
}

export interface GetProductsParams {
  categoryId?: string;
  categorySlug?: string;
  collectionId?: string;
  collectionSlug?: string;
  /** `"all"` includes drafts; omitting it returns published products only. */
  isPublished?: boolean | "all";
  gender?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  [key: string]: string | string[] | number | boolean | undefined;
}

export const getProducts = async (
  params: GetProductsParams = {},
): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>(apiEndpoint.products.base, {
    params,
  });
  return data;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getProductById = async (id: string): Promise<any> => {
  const { data } = await api.get(apiEndpoint.products.byId(id));
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteProduct = async (id: string): Promise<any> => {
  const { data } = await api.delete(apiEndpoint.products.byId(id));
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createProduct = async (payload: any): Promise<any> => {
  const { data } = await api.post(apiEndpoint.products.base, payload);
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateProduct = async (id: string, payload: any): Promise<any> => {
  const { data } = await api.put(apiEndpoint.products.byId(id), payload);
  return data;
};
