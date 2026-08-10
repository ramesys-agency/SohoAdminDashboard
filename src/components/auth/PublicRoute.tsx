import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  // Only bounce a *usable* session away from the login page. Sending a
  // non-admin to "/" would just be bounced back here by ProtectedRoute.
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
