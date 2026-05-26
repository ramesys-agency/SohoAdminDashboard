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
  homePromo: {
    base: "/v1/home-promo",
  },
  users: {
    profile: "/v1/users/profile",
    avatar: "/v1/users/avatar",
    updatePassword: "/v1/users/password",
    byId: (id: string) => `/v1/users/${id}`,
    adminAll: "/v1/users/admin/all",
    adminCreate: "/v1/users/admin/create",
  },
  stats: {
    dashboard: "/v1/stats/dashboard",
  },
  orders: {
    adminAll: "/v1/orders/admin/all",
    byId: (id: string) => `/v1/orders/${id}`, // Reuse the specific byId if needed
    updateStatus: (id: string) => `/v1/orders/admin/${id}/status`,
    updatePayment: (id: string) => `/v1/orders/admin/${id}/payment`,
    syncRoadRush: (id: string) => `/v1/orders/admin/${id}/sync-roadrush`,
    refreshStatus: (id: string) => `/v1/orders/admin/${id}/refresh-status`,
  },
  coupons: {
    base: "/v1/coupons",
    byId: (id: string) => `/v1/coupons/${id}`,
    validate: "/v1/coupons/validate",
  },
  logistics: {
    aggregators: "/v1/logistics/aggregators",
    pickupAddresses: "/v1/logistics/pickup-addresses",
  },
  upload: {
    base: "/v1/upload",
  },
};
