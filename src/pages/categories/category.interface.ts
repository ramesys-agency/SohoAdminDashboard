export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  level: number;
  attributes: string[];
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalProducts: number;
  children?: Category[];
  genderImages?: { gender: string; imageUrl: string }[];
}

export interface CategoryHierarchyResponse {
  data: Category[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
