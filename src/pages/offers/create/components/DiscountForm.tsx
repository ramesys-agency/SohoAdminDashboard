import { useState } from "react";

export default function DiscountForm() {
  const [discountType, setDiscountType] = useState<
    "percentage" | "fixed" | "free_shipping"
  >("percentage");
  const [appliesToType, setAppliesToType] = useState<
    "all" | "collections" | "products"
  >("all");

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left: Main form */}
      <div className="xl:col-span-2 space-y-6">
        {/* Coupon Code */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-4 text-slate-900">
            Discount Code
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. SUMMER24"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 font-mono font-bold uppercase tracking-wider text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
            <button className="px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap">
              Generate
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Customers enter this code at checkout. Leave empty to auto-generate.
          </p>
        </section>

        {/* Discount Type */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-4 text-slate-900">
            Discount Type & Value
          </h3>
          <div className="flex gap-2 mb-6">
            {(
              [
                ["percentage", "Percentage"],
                ["fixed", "Fixed Amount"],
                ["free_shipping", "Free Shipping"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setDiscountType(val)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold border transition-colors ${discountType === val ? "bg-[#1325ec] border-[#1325ec] text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {discountType !== "free_shipping" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                {discountType === "percentage"
                  ? "Percentage Off"
                  : "Amount Off"}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  {discountType === "percentage" ? "%" : "$"}
                </span>
                <input
                  type="number"
                  placeholder={discountType === "percentage" ? "20" : "10.00"}
                  className="w-full pl-8 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-bold focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
                />
              </div>
              {discountType === "percentage" && (
                <div className="mt-3 flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Applies to
                  </label>
                  <div className="flex gap-2">
                    {(
                      [
                        ["all", "All Products"],
                        ["collections", "Specific Collections"],
                        ["products", "Specific Products"],
                      ] as const
                    ).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setAppliesToType(val)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${appliesToType === val ? "bg-[#1325ec]/10 border-[#1325ec] text-[#1325ec]" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {appliesToType !== "all" && (
                    <div className="mt-2 border border-slate-200 rounded-lg p-3 text-sm text-slate-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-slate-400">
                          search
                        </span>
                        <input
                          className="flex-1 border-none bg-transparent outline-none text-sm"
                          placeholder={`Search ${appliesToType}...`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Minimum Requirements */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-4 text-slate-900">
            Minimum Requirements
          </h3>
          <div className="space-y-3">
            {[
              ["none", "No minimum requirements"],
              ["amount", "Minimum purchase amount"],
              ["quantity", "Minimum quantity"],
            ].map(([val, label]) => (
              <label
                key={val}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div
                  className={`size-4 rounded-full border-2 ${val === "none" ? "border-[#1325ec]" : "border-slate-300"} flex items-center justify-center`}
                >
                  {val === "none" && (
                    <div className="size-2 rounded-full bg-[#1325ec]"></div>
                  )}
                </div>
                <span className="text-sm text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </section>
      </div>

      {/* Right sidebar */}
      <div className="space-y-6">
        {/* Status */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Status</h3>
          <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none font-medium">
            <option>Active</option>
            <option>Scheduled</option>
            <option>Inactive</option>
          </select>
        </section>

        {/* Usage Limits */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Usage Limits
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Total Usage Limit
              </label>
              <input
                type="number"
                placeholder="Unlimited"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-[#1325ec]"
              />
              <span className="text-sm text-slate-600">
                Limit to one per customer
              </span>
            </label>
          </div>
        </section>

        {/* Validity Dates */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Validity Period
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Start Date
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                End Date
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none"
              />
              <p className="text-xs text-slate-400">
                Leave empty for no expiry.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
