import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", icon: "dashboard", label: "Dashboard" },
  { to: "/products", icon: "inventory_2", label: "Products" },
  { to: "/categories", icon: "category", label: "Categories" },
  { to: "/collections", icon: "layers", label: "Collections" },
  { to: "/orders", icon: "shopping_cart", label: "Orders" },
  { to: "/customers", icon: "group", label: "Customers" },
  { to: "/offers", icon: "sell", label: "Offers" },
  { to: "/analytics", icon: "monitoring", label: "Analytics" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col fixed h-full z-20">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="bg-[#1325ec] rounded-lg p-2 flex items-center justify-center text-white">
          <span className="material-symbols-outlined">storefront</span>
        </div>
        <div>
          <h1 className="text-base font-bold leading-none text-slate-900">
            StoreAdmin
          </h1>
          <p className="text-xs text-slate-500 mt-1">SaaS Dashboard</p>
        </div>
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
                  ? "bg-[#1325ec]/10 text-[#1325ec] font-semibold"
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

      {/* View Store Button */}
      <div className="p-4 border-t border-slate-200">
        <button className="w-full flex items-center justify-center gap-2 bg-[#1325ec] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#1325ec]/90 transition-all">
          <span className="material-symbols-outlined text-[18px]">
            visibility
          </span>
          View Store
        </button>
      </div>
    </aside>
  );
}
