import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import CouponsTable from "./components/CouponsTable";
import { getAllCoupons } from "../../api/coupons";
import type { Coupon } from "../../api/coupons";

export default function Offers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: getAllCoupons,
  });

  const getStatus = (coupon: Coupon) => {
    if (!coupon.isActive) return "Inactive";
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);

    if (now < validFrom) return "Scheduled";
    if (coupon.validTo && now > new Date(coupon.validTo)) return "Expired";
    return "Active";
  };

  const counts = {
    Active: coupons.filter((c) => getStatus(c) === "Active").length,
    Scheduled: coupons.filter((c) => getStatus(c) === "Scheduled").length,
    Expired: coupons.filter((c) => getStatus(c) === "Expired").length,
    All: coupons.length,
  };

  const filterTabs = [
    { label: "All", count: counts.All },
    { label: "Active", count: counts.Active },
    { label: "Scheduled", count: counts.Scheduled },
    { label: "Expired", count: counts.Expired },
  ];

  const filteredCoupons = coupons.filter((c) => {
    const tab = filterTabs[activeTab].label;
    if (tab === "All") return true;
    return getStatus(c) === tab;
  });

  return (
    <PageWrapper>
      <PageHeader
        title="Offers & Coupons"
        description="Manage and monitor your promotional campaigns."
        actions={
          <button
            onClick={() => navigate("/offers/create")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Create Discount
          </button>
        }
      />
      <div>
        <div className="mb-6 border-b border-slate-200">
          <div className="flex gap-8">
            {filterTabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`border-b-2 pb-4 px-1 text-sm font-bold transition-colors ${
                  activeTab === i
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span
                    className={`ml-1 text-xs px-2 py-0.5 rounded-full ${activeTab === i ? "bg-primary/10" : "bg-slate-100"}`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <CouponsTable coupons={filteredCoupons} isLoading={isLoading} />
      </div>
    </PageWrapper>
  );
}
