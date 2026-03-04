import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import BasicInfoForm from "./components/BasicInfoForm";
import MediaUpload from "./components/MediaUpload";
import VariantsTable from "./components/VariantsTable";
import SeoSection from "./components/SeoSection";
import StatusCard from "./components/StatusCard";
import PricingCard from "./components/PricingCard";
import OrganizationCard from "./components/OrganizationCard";

export default function ProductEditor() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Classic Cotton T-Shirt");
  const [status, setStatus] = useState("active");
  const [visible, setVisible] = useState(true);
  const [basePrice, setBasePrice] = useState("25.00");
  const [comparePrice, setComparePrice] = useState("35.00");

  return (
    <PageWrapper>
      <PageHeader
        title={title}
        description={
          <>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-1 text-[#1325ec] text-sm font-semibold hover:underline"
            >
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
              Back to Products
            </button>
          </>
        }
        actions={
          <>
            <button
              onClick={() => navigate("/products")}
              className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Discard
            </button>
            <button className="px-4 py-2 text-sm font-bold bg-[#1325ec] text-white rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#1325ec]/20">
              Save Changes
            </button>
          </>
        }
      />

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Left Column */}
        <div className="xl:col-span-2 space-y-6">
          <BasicInfoForm title={title} onTitleChange={setTitle} />
          <MediaUpload />
          <VariantsTable />
          <SeoSection />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <StatusCard
            status={status}
            onStatusChange={setStatus}
            visible={visible}
            onVisibilityToggle={() => setVisible(!visible)}
          />
          <PricingCard
            basePrice={basePrice}
            comparePrice={comparePrice}
            onBasePriceChange={setBasePrice}
            onComparePriceChange={setComparePrice}
          />
          <OrganizationCard />
        </div>
      </div>
    </PageWrapper>
  );
}
