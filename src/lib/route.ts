export const apiEndpoint = {
  auth: {
    login: "/v1/auth/login",
    refresh: "/v1/auth/refresh",
  },
  categories: {
    base: "/v1/categories",
    parents: "/v1/categories/parents",
    hierarchy: "/v1/categories/hierarchy",
    byId: (id: string) => `/v1/categories/${id}`,
  },
  collections: {
    base: "/v1/collections",
  },
};
