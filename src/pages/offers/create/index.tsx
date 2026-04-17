import { useNavigate, useLocation } from "react-router-dom";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import DiscountForm from "./components/DiscountForm";

export default function CreateOffer() {
  const navigate = useNavigate();
  const location = useLocation();
  const editCoupon = location.state?.editCoupon;
  const isEditMode = !!editCoupon;

  return (
    <PageWrapper>
      <PageHeader
        title={isEditMode ? "Edit Discount" : "Create Discount"}
        description={
          <button
            onClick={() => navigate("/offers")}
            className="inline-flex items-center gap-1 text-[#1325ec] text-sm font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Offers
          </button>
        }
        actions={
          <>
            <button
              onClick={() => navigate("/offers")}
              className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Discard
            </button>
            <button
              form="create-offer-form"
              type="submit"
              className="px-4 py-2 text-sm font-bold bg-[#1325ec] text-white rounded-lg shadow-lg shadow-[#1325ec]/20 hover:opacity-90"
            >
              {isEditMode ? "Update Discount" : "Save Discount"}
            </button>
          </>
        }
      />
      <DiscountForm initialData={editCoupon} />
    </PageWrapper>
  );
}
