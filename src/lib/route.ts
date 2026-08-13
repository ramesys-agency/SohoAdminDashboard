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
    duplicate: (id: string) => `/v1/app-placement/${id}/duplicate`,
    reorder: "/v1/app-placement/reorder",
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
    // Manual shipping — orders the automated courier hand-off gave up on
    manual: "/v1/orders/admin/manual",
    manualCount: "/v1/orders/admin/manual/count",
    manualHandled: (id: string) => `/v1/orders/admin/${id}/manual/handled`,
    manualUnhandled: (id: string) => `/v1/orders/admin/${id}/manual/unhandled`,
    retrySync: (id: string) => `/v1/orders/admin/${id}/retry-sync`,
    // Status reconciliation — orders where our status and RoadRush's disagree
    conflicts: "/v1/orders/admin/conflicts",
    conflictsCount: "/v1/orders/admin/conflicts/count",
    acceptLogisticsStatus: (id: string) => `/v1/orders/admin/${id}/conflict/accept`,
    keepAdminStatus: (id: string) => `/v1/orders/admin/${id}/conflict/keep`,
  },
  returns: {
    adminAll: "/v1/returns/admin/all",
    byOrder: (orderId: string) => `/v1/returns/order/${orderId}`,
    create: (orderId: string) => `/v1/returns/admin/order/${orderId}`,
    update: (returnId: string) => `/v1/returns/admin/${returnId}`,
    remove: (returnId: string) => `/v1/returns/admin/${returnId}`,
  },
  coupons: {
    base: "/v1/coupons",
    byId: (id: string) => `/v1/coupons/${id}`,
    validate: "/v1/coupons/validate",
  },
  upload: {
    base: "/v1/upload",
  },
  notifications: {
    adminSend: "/v1/notifications/admin/send",
  },
};
