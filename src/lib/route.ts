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
    byId: (id: string) => `/v1/collections/${id}`,
  },
  products: {
    base: "/v1/products",
    byId: (id: string) => `/v1/products/${id}`,
  },
  placements: {
    base: "/v1/app-placement",
    byId: (id: string) => `/v1/app-placement/${id}`,
  },
  users: {
    profile: "/v1/users/profile",
    byId: (id: string) => `/v1/users/${id}`,
    adminAll: "/v1/users/admin/all",
  },
  orders: {
    adminAll: "/v1/orders/admin/all",
    byId: (id: string) => `/v1/orders/${id}`, // Reuse the specific byId if needed
    updateStatus: (id: string) => `/v1/orders/admin/${id}/status`,
    updatePayment: (id: string) => `/v1/orders/admin/${id}/payment`,
  },
  coupons: {
    base: "/v1/coupons",
    byId: (id: string) => `/v1/coupons/${id}`,
    validate: "/v1/coupons/validate",
  },
};
