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
  genderImages?: CategoryGenderPlacement[];
}

/** Per-gender catalog placement row as returned by the API. */
export interface CategoryGenderPlacement {
  id?: string;
  gender: string;
  imageUrl: string | null;
  isActive: boolean;
  displayOrder: number;
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
