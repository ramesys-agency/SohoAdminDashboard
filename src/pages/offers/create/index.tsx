import { useNavigate, useLocation } from "react-router-dom";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import DiscountForm from "./components/DiscountForm";
import Button from "../../../components/ui/Button";

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
          <Button onClick={() => navigate("/offers")} variant="ghost" size="sm">
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Offers
          </Button>
        }
        actions={
          <>
            <Button onClick={() => navigate("/offers")} variant="outline">
              Discard
            </Button>
            <Button form="create-offer-form" type="submit">
              {isEditMode ? "Update Discount" : "Save Discount"}
            </Button>
          </>
        }
      />
      <DiscountForm initialData={editCoupon} />
    </PageWrapper>
  );
}
