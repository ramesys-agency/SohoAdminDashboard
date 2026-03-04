import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ReviewsSection from "./components/ReviewsSection";

export default function ViewProduct() {
  const navigate = useNavigate();

  // Dummy Product matching schema layout
  const product = {
    name: "Classic Cotton T-Shirt",
    description:
      "Our Classic Cotton T-Shirt is made from 100% premium organic cotton.\nFeatures a relaxed fit, reinforced seams, and a tag-less collar for ultimate comfort.\nPerfect for everyday wear.",
    categoryId: "cat_clothing",
    attributes: {
      Material: "100% Cotton",
      Fit: "Relaxed",
      Care: "Machine wash cold",
    },
    overallRating: 4.67,
    reviewCount: 3,
    isPublished: true,
    gender: ["UNISEX"],
    collections: ["Summer Essentials"],
    variants: [
      {
        id: "v1",
        sku: "TSH-WHT-S",
        size: "S",
        colorName: "White",
        colorValue: "#f8fafc",
        stockQty: 42,
        basePrice: "25.00",
        originalPrice: "35.00",
        isDefault: true,
        images: [],
      },
      {
        id: "v2",
        sku: "TSH-BLK-M",
        size: "M",
        colorName: "Black",
        colorValue: "#0f172a",
        stockQty: 18,
        basePrice: "25.00",
        originalPrice: "35.00",
        isDefault: false,
        images: [],
      },
    ],
    images: [
      {
        id: "img1",
        imageUrl: "",
        isPrimary: true,
        colorRef: "#f8fafc",
      },
      {
        id: "img2",
        imageUrl: "",
        isPrimary: false,
        colorRef: "#0f172a",
      },
    ],
    reviews: [
      {
        id: "r1",
        name: "Sarah J.",
        rating: 5,
        comment: "Great quality! Fits perfectly and very comfortable.",
        date: "Oct 20, 2023",
      },
      {
        id: "r2",
        name: "Mark S.",
        rating: 4,
        comment: "Nice shirt, the fabric is soft. Sizing runs slightly large.",
        date: "Oct 18, 2023",
      },
      {
        id: "r3",
        name: "Emma W.",
        rating: 5,
        comment: "Bought 3 of these in different colors. Excellent value.",
        date: "Oct 15, 2023",
      },
    ],
  };

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
          <ProductGallery images={product.images} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ProductInfo product={product} />
        </div>
      </div>

      <ReviewsSection reviews={product.reviews} />
    </PageWrapper>
  );
}
