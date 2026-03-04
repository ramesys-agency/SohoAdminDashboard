import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ReviewsSection from "./components/ReviewsSection";

export default function ViewProduct() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageHeader
        title="View Product"
        description={
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-1 text-[#1325ec] text-sm font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Products
          </button>
        }
        actions={
          <>
            <button
              onClick={() => navigate("/products/edit")}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Product
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 font-bold text-sm rounded-lg border border-rose-200 hover:bg-rose-100">
              <span className="material-symbols-outlined text-sm">delete</span>
              Delete
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProductGallery />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ProductInfo />
        </div>
      </div>

      <ReviewsSection />
    </PageWrapper>
  );
}
