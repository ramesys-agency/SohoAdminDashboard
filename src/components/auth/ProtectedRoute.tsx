import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // A customer's credentials are valid credentials — they just aren't staff.
  // The API enforces this too; this only keeps a non-admin out of a dashboard
  // that would otherwise render and then fail every request with a 403.
  if (user?.role !== "admin") {
    return <Navigate to="/login" replace state={{ reason: "not-admin" }} />;
  }

  return <Outlet />;
}
