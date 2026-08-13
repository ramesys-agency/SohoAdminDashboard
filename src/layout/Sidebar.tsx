import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import ConfirmModal from "../components/ui/ConfirmModal";
import { useAuthStore } from "../store/authStore";
import { getManualOrdersCount } from "../api/orders";

const navItems = [
  { to: "/", icon: "dashboard", label: "Dashboard" },
  { to: "/products", icon: "inventory_2", label: "Products" },
  { to: "/categories", icon: "category", label: "Categories" },
  // { to: "/collections", icon: "layers", label: "Collections" },
  { to: "/placements", icon: "view_quilt", label: "App Placements" },
  { to: "/orders", icon: "shopping_cart", label: "Orders" },
  { to: "/customers", icon: "group", label: "Customers" },
  { to: "/notifications", icon: "notifications", label: "Notifications" },
  { to: "/offers", icon: "sell", label: "Offers" },
  // { to: "/analytics", icon: "monitoring", label: "Analytics" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // Orders that fell back to manual shipping need a human today, so the count
  // follows the admin around instead of hiding on the Orders page.
  const [manualCount, setManualCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchCount = async () => {
      try {
        const count = await getManualOrdersCount();
        if (!cancelled) setManualCount(count);
      } catch {
        // A failed poll should never break navigation — leave the last count.
      }
    };

    fetchCount();
    const timer = setInterval(fetchCount, 60_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col fixed h-full z-20">
      {/* Logo */}
      <div className="p-6 flex flex-col items-center gap-3 border-b border-slate-100">
        <div className="rounded-lg p-2 flex items-center justify-center text-white">
          <img src="/logo.png" alt="" />
        </div>
        <p className="text-md text-slate-500 mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">
              {item.icon}
            </span>
            <span>{item.label}</span>
            {item.to === "/orders" && manualCount > 0 && (
              <span
                title={`${manualCount} order(s) need manual shipping`}
                className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold"
              >
                {manualCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Nav + View Store */}
      <div className="p-4 border-t border-slate-200 space-y-1">
        <Button
          fullWidth
          className="mt-2"
          onClick={() => setShowLogoutConfirm(true)}
          leftIcon={
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
          }
        >
          Logout
        </Button>
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Log out?"
        message="You'll be signed out of the admin dashboard and returned to the login page."
        confirmText="Log out"
        cancelText="Stay signed in"
        variant="warning"
        icon="logout"
      />
    </aside>
  );
}
