import { NavLink, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { to: "/", icon: "dashboard", label: "Dashboard" },
  { to: "/products", icon: "inventory_2", label: "Products" },
  { to: "/categories", icon: "category", label: "Categories" },
  // { to: "/collections", icon: "layers", label: "Collections" },
  { to: "/placements", icon: "view_quilt", label: "App Placements" },
  { to: "/home-promo", icon: "ad_units", label: "Homepage Promo" },
  { to: "/orders", icon: "shopping_cart", label: "Orders" },
  { to: "/customers", icon: "group", label: "Customers" },
  { to: "/offers", icon: "sell", label: "Offers" },
  { to: "/shipping", icon: "local_shipping", label: "Shipping" },
  // { to: "/analytics", icon: "monitoring", label: "Analytics" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
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
          </NavLink>
        ))}
      </nav>

      {/* Bottom Nav + View Store */}
      <div className="p-4 border-t border-slate-200 space-y-1">
        <Button
          fullWidth
          className="mt-2"
          onClick={handleLogout}
          leftIcon={
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
          }
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
