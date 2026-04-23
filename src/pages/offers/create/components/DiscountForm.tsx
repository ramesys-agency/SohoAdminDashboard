import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getCollections, type Collection } from "../../../../api/collections";
import { createCoupon, updateCoupon, type Coupon } from "../../../../api/coupons";

interface DiscountFormProps {
  initialData?: Coupon;
}

export default function DiscountForm({ initialData }: DiscountFormProps) {
  const navigate = useNavigate();
  const [code, setCode] = useState(initialData?.code || "");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">(
    (initialData?.type as any) === "percentage" ? "percentage" : "flat",
  );
  const [discountValue, setDiscountValue] = useState(
    initialData?.value?.toString() || "",
  );
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialData?.collections?.map((c) => c.collection.id) || [],
  );
  const [minReq, setMinReq] = useState<"none" | "amount" | "quantity">(
    Number(initialData?.minOrderAmount) > 0 ? "amount" : "none",
  );
  const [minReqValue, setMinReqValue] = useState(
    initialData?.minOrderAmount?.toString() || "",
  );
  const [status, setStatus] = useState(
    initialData?.isActive === false ? "Inactive" : "Active",
  );
  const [usageLimit, setUsageLimit] = useState(
    initialData?.usageLimit?.toString() || "",
  );
  const [isOnePerCustomer, setIsOnePerCustomer] = useState(
    (initialData?.userUsageLimit || 1) === 1,
  );
  const [startDate, setStartDate] = useState(
    initialData?.validFrom
      ? new Date(initialData.validFrom).toISOString().slice(0, 16)
      : "",
  );
  const [endDate, setEndDate] = useState(
    initialData?.validTo
      ? new Date(initialData.validTo).toISOString().slice(0, 16)
      : "",
  );

  const [appliesTo, setAppliesTo] = useState<"all" | "collections">(
    initialData?.collections?.length ? "collections" : "all",
  );

  const { data: collectionsData } = useQuery({
    queryKey: ["collections-all"],
    queryFn: () => getCollections(1, 100),
  });

  const { mutate: handleSave } = useMutation({
    mutationFn: (payload: any) =>
      initialData
        ? updateCoupon(initialData.id, payload)
        : createCoupon(payload),
    onSuccess: () => {
      toast.success("Coupon saved successfully!");
      navigate("/offers");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to save coupon");
    },
  });

  const collections = (collectionsData?.data || []).filter(
    (c: Collection) => c.isActive,
  );

  const handleGenerateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const toggleCollection = (id: string) => {
    setSelectedCollections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !code ||
      !discountValue ||
      !startDate ||
      (appliesTo === "collections" && selectedCollections.length === 0)
    ) {
      toast.error(
        "Please fill all mandatory fields (Code, Value, Start Date, and at least one collection if Specific Collections is selected)",
      );
      return;
    }

    const payload = {
      code,
      type: discountType,
      value: Number(discountValue),
      minOrderAmount: minReq === "amount" ? Number(minReqValue) : 0,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      userUsageLimit: isOnePerCustomer ? 1 : undefined,
      validFrom: startDate,
      validTo: endDate || undefined,
      isActive: status === "Active",
      collectionIds: appliesTo === "collections" ? selectedCollections : [],
    };

    handleSave(payload);
  };

  return (
    <form
      id="create-offer-form"
      onSubmit={onSubmit}
      className="grid grid-cols-1 xl:grid-cols-3 gap-8"
    >
      {/* Left: Main form */}
      <div className="xl:col-span-2 space-y-6">
        {/* Coupon Code */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-4 text-slate-900">
            Discount Code <span className="text-red-500">*</span>
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER24"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 font-mono font-bold uppercase tracking-wider text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
            <button
              onClick={handleGenerateCode}
              type="button"
              className="px-4 py-2.5 border border-slate-200 bg-slate-50 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Generate
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Customers enter this code at checkout.
          </p>
        </section>

        {/* Discount Type */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-4 text-slate-900">
            Discount Type & Value <span className="text-red-500">*</span>
          </h3>
          <div className="flex gap-2 mb-6">
            {(
              [
                ["percentage", "Percentage"],
                ["flat", "Fixed Amount"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setDiscountType(val)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold border transition-colors ${discountType === val ? "bg-[#1325ec] border-[#1325ec] text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              {discountType === "percentage" ? "Percentage Off" : "Amount Off"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                {discountType === "percentage" ? "%" : "$"}
              </span>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "percentage" ? "20" : "10.00"}
                className="w-full pl-8 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-bold focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
              />
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <label className="text-sm font-semibold text-slate-700">
                Applies to <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {(
                  [
                    ["all", "All Products"],
                    ["collections", "Specific Collections"],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAppliesTo(val)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold border transition-all ${
                      appliesTo === val
                        ? "bg-[#1325ec]/10 border-[#1325ec] text-[#1325ec]"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {appliesTo === "collections" && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {collections.map((coll: Collection) => (
                      <button
                        key={coll.id}
                        type="button"
                        onClick={() => toggleCollection(coll.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                          selectedCollections.includes(coll.id)
                            ? "bg-[#1325ec] border-[#1325ec] text-white shadow-md shadow-[#1325ec]/10"
                            : "bg-white border-slate-200 text-slate-600 hover:border-[#1325ec]/30"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {selectedCollections.includes(coll.id)
                            ? "check_circle"
                            : "circle"}
                        </span>
                        <span className="truncate">{coll.name}</span>
                      </button>
                    ))}
                  </div>
                  {collections.length === 0 && (
                    <p className="text-xs text-slate-400 italic">
                      Loading collections or none found...
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Minimum Requirements */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-4 text-slate-900">
            Minimum Requirements
          </h3>
          <div className="space-y-4">
            {(
              [
                ["none", "No minimum requirements"],
                ["amount", "Minimum purchase amount ($)"],
                ["quantity", "Minimum quantity of items"],
              ] as const
            ).map(([val, label]) => (
              <div key={val} className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="minReq"
                    checked={minReq === val}
                    onChange={() => setMinReq(val)}
                    className="size-4 text-[#1325ec] focus:ring-[#1325ec]"
                  />
                  <span
                    className={`text-sm font-medium transition-colors ${minReq === val ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"}`}
                  >
                    {label}
                  </span>
                </label>

                {minReq === val && val !== "none" && (
                  <div className="ml-7 animate-in fade-in slide-in-from-top-1 duration-200">
                    <input
                      type="number"
                      value={minReqValue}
                      onChange={(e) => setMinReqValue(e.target.value)}
                      placeholder={val === "amount" ? "0.00" : "1"}
                      className="w-full max-w-[200px] rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] outline-none"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right sidebar */}
      <div className="space-y-6">
        {/* Status */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Status</h3>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none font-medium"
          >
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
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="Unlimited"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isOnePerCustomer}
                onChange={(e) => setIsOnePerCustomer(e.target.checked)}
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
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                End Date
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none"
              />
              <p className="text-xs text-slate-400">
                Leave empty for no expiry.
              </p>
            </div>
          </div>
          <button type="submit" className="hidden" />
        </section>
      </div>
    </form>
  );
}
