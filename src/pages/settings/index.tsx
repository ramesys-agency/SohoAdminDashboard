import { useState } from "react";

type Tab = "profile" | "store" | "notifications" | "billing";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "profile", label: "Profile", icon: "person" },
  { id: "store", label: "Store", icon: "storefront" },
  { id: "notifications", label: "Notifications", icon: "notifications" },
  { id: "billing", label: "Billing", icon: "credit_card" },
];

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-6">
          Personal Information
        </h3>
        <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-100">
          <div className="size-20 rounded-full bg-[#1325ec]/10 flex items-center justify-center text-[#1325ec] text-3xl font-bold">
            A
          </div>
          <div>
            <p className="font-bold text-slate-900">Alex Rivera</p>
            <p className="text-sm text-slate-500 mb-3">alex@storeadmin.com</p>
            <button className="px-3 py-1.5 text-xs font-bold bg-[#1325ec]/10 text-[#1325ec] rounded-lg hover:bg-[#1325ec]/20">
              Change Avatar
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              First Name
            </label>
            <input
              type="text"
              defaultValue="Alex"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Last Name
            </label>
            <input
              type="text"
              defaultValue="Rivera"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="alex@storeadmin.com"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Phone
            </label>
            <input
              type="text"
              defaultValue="+1 (555) 000-0000"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Time Zone
            </label>
            <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none">
              <option>UTC−05:00 (Eastern Time)</option>
              <option>UTC+05:30 (India Standard Time)</option>
              <option>UTC+00:00 (GMT)</option>
            </select>
          </div>
        </div>
      </section>
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-6">
          Change Password
        </h3>
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function StoreSettings() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-6">
          Store Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Store Name
            </label>
            <input
              type="text"
              defaultValue="StoreAdmin"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Store URL
            </label>
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
              <span className="px-3 text-slate-400 text-xs">https://</span>
              <input
                type="text"
                defaultValue="mystore.com"
                className="bg-transparent flex-1 py-2.5 px-0 text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Currency
            </label>
            <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none">
              <option>USD — US Dollar</option>
              <option>EUR — Euro</option>
              <option>INR — Indian Rupee</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Language
            </label>
            <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none">
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">
              Store Description
            </label>
            <textarea
              rows={3}
              defaultValue="Your one-stop shop for premium products."
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none resize-none"
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between p-4 rounded-lg border border-rose-200 bg-rose-50">
          <div>
            <p className="text-sm font-bold text-rose-700">Delete Store</p>
            <p className="text-xs text-rose-500">
              This action cannot be undone. All data will be permanently
              deleted.
            </p>
          </div>
          <button className="px-4 py-2 bg-rose-600 text-white text-sm font-bold rounded-lg hover:bg-rose-700">
            Delete Store
          </button>
        </div>
      </section>
    </div>
  );
}

function NotificationSettings() {
  const items = [
    {
      label: "New Order",
      desc: "Notify when a new order is placed",
      email: true,
      push: true,
    },
    {
      label: "Order Shipped",
      desc: "Notify when an order is shipped",
      email: true,
      push: false,
    },
    {
      label: "Low Stock Alert",
      desc: "Notify when product stock falls below threshold",
      email: true,
      push: true,
    },
    {
      label: "New Customer",
      desc: "Notify when a new customer registers",
      email: false,
      push: false,
    },
    {
      label: "Abandoned Cart",
      desc: "Notify when a cart is abandoned",
      email: true,
      push: false,
    },
  ];
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 grid grid-cols-3">
        <span className="text-sm font-bold text-slate-700">Notification</span>
        <span className="text-xs font-bold text-slate-500 uppercase text-center">
          Email
        </span>
        <span className="text-xs font-bold text-slate-500 uppercase text-center">
          Push
        </span>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div
            key={item.label}
            className="px-6 py-4 grid grid-cols-3 items-center"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {item.label}
              </p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
            <div className="flex justify-center">
              <div
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.email ? "bg-[#1325ec]" : "bg-slate-200"}`}
              >
                <div
                  className={`absolute top-0.5 size-4 bg-white rounded-full shadow transition-all ${item.email ? "right-0.5" : "left-0.5"}`}
                ></div>
              </div>
            </div>
            <div className="flex justify-center">
              <div
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.push ? "bg-[#1325ec]" : "bg-slate-200"}`}
              >
                <div
                  className={`absolute top-0.5 size-4 bg-white rounded-full shadow transition-all ${item.push ? "right-0.5" : "left-0.5"}`}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">Current Plan</h3>
          <span className="px-3 py-1 bg-[#1325ec]/10 text-[#1325ec] text-xs font-bold rounded-full">
            Pro Plan
          </span>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-4xl font-black text-slate-900">$49</span>
          <span className="text-slate-500 pb-1">/month</span>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Next billing date: November 1, 2023
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button className="py-2.5 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50">
            Change Plan
          </button>
          <button className="py-2.5 bg-[#1325ec] text-white rounded-lg text-sm font-bold hover:opacity-90">
            Upgrade Now
          </button>
        </div>
      </section>
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Payment Method
        </h3>
        <div className="flex items-center gap-4 p-4 rounded-lg border border-slate-200">
          <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-600">
              credit_card
            </span>
          </div>
          <div>
            <p className="text-sm font-bold">Visa ending in 4242</p>
            <p className="text-xs text-slate-500">Expires 12/2026</p>
          </div>
          <button className="ml-auto text-[#1325ec] text-sm font-bold hover:underline">
            Update
          </button>
        </div>
      </section>
    </div>
  );
}

const tabContent: Record<Tab, React.ReactNode> = {
  profile: <ProfileSettings />,
  store: <StoreSettings />,
  notifications: <NotificationSettings />,
  billing: <BillingSettings />,
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-slate-500 text-sm">
          Manage your account preferences and store configuration.
        </p>
      </div>
      <div className="flex gap-8">
        {/* Sidebar */}
        <nav className="w-52 flex-shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab.id ? "bg-[#1325ec]/10 text-[#1325ec]" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>
        {/* Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {tabContent[activeTab]}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button className="px-4 py-2 text-sm font-bold border border-slate-200 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-bold bg-[#1325ec] text-white rounded-lg shadow-lg shadow-[#1325ec]/20 hover:opacity-90">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
