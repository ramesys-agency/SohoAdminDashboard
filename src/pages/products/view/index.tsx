import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ReviewsSection from "./components/ReviewsSection";
import {
  getProductById,
  deleteProduct,
  type ApiProduct,
} from "../../../api/products";
import Button from "../../../components/ui/Button";
import ConfirmModal from "../../../components/ui/ConfirmModal";

export default function ViewProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    // Only set loading to true if it's currently false (e.g. when id changes)
    // This avoids the synchronous call on initial mount where loading is already true.
    setLoading(true);

    getProductById(id)
      .then((res) => {
        if (!isMounted) return;
        const data = (res as any).data || res;
        setProduct(data);

        // Auto-select the first variant by default
        if (data?.variants?.length > 0) {
          const defaultVar =
            data.variants.find((v: any) => v.isDefault) || data.variants[0];
          setSelectedVariantId(defaultVar.id);
        } else if (data?.availableColors?.length > 0) {
          setSelectedVariantId("var-0");
        } else {
          setSelectedVariantId("default-var");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!product) return;

    try {
      setIsDeleting(true);
      await deleteProduct(product.id);
      toast.success("Product deleted successfully.");
      navigate("/products");
    } catch (err: any) {
      console.error("Failed to delete product:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete product. Please try again.",
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <span className="material-symbols-outlined text-4xl animate-spin">
              progress_activity
            </span>
            <p>Loading product details...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !product) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3 text-rose-500">
            <span className="material-symbols-outlined text-4xl">error</span>
            <p>{error || "Product not found."}</p>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
            >
              Back to Products
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Transform ApiProduct into the shape expected by the child components.
  // We handle missing standard fields defensively.
  const productData = product as any;
  const safePrice = productData.price ?? 0;
  const safeOriginalPrice = productData.originalPrice ?? safePrice;

  const mappedProduct = {
    name: productData.name || "Unknown Product",
    description: productData.description || "No description provided.",
    categoryId: productData.category?.name || "None",
    attributes: productData.attributes || {},
    overallRating: productData.rating || 0,
    reviewCount: productData.reviewCount || 0,
    isPublished: productData.isPublished ?? false,
    gender: productData.gender || [],
    collections: productData.collections || [],
    variants: productData.variants?.length
      ? productData.variants.map((v: any, i: number) => ({
          ...v,
          basePrice: (v.basePrice ?? safePrice).toString(),
          originalPrice: (v.originalPrice ?? safeOriginalPrice).toString(),
          images: v.images || [],
          isDefault: i === 0,
        }))
      : productData.availableColors?.length
        ? productData.availableColors.map((c: any, i: number) => ({
            id: `var-${i}`,
            sku:
              productData.sku ||
              `${productData.id?.slice(0, 8) || "sku"}-${c.colorName.substring(0, 3).toUpperCase()}`,
            size: "One Size",
            colorName: c.colorName,
            colorValue: c.colorValue,
            stockQty: productData.inStock ? 10 : 0,
            basePrice: safePrice.toString(),
            originalPrice: safeOriginalPrice.toString(),
            isDefault: i === 0,
            images: [],
          }))
        : [
            {
              id: "default-var",
              sku: productData.sku || "N/A",
              size: "Standard",
              colorName: "Standard",
              colorValue: "#f1f5f9",
              stockQty: productData.inStock ? 10 : 0,
              basePrice: safePrice.toString(),
              originalPrice: safeOriginalPrice.toString(),
              isDefault: true,
              images: [],
            },
          ],
    images: productData.primaryImage
      ? [
          {
            id: "img-primary",
            imageUrl: productData.primaryImage,
            isPrimary: true,
            colorRef: null,
          },
        ]
      : [],
    reviews: productData.reviews?.map((r: any) => ({
      id: r.id,
      name: r.user?.fullName || "Anonymous",
      rating: r.rating || 0,
      comment: r.comment || "",
      date: r.createdAt
        ? new Date(r.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A",
    })) || [],
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Product Details"
        description={
          <Button
            onClick={() => navigate("/products")}
            variant="ghost"
            size="sm"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Products
          </Button>
        }
        actions={
          <>
            <button
              onClick={() => navigate(`/products/edit/${product.id}`)}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Product
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-2 border border-rose-500 text-rose-600 font-bold text-sm rounded-lg hover:bg-rose-50"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Delete
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProductGallery
            images={
              selectedVariantId
                ? mappedProduct.variants.find(
                    (v: any) => v.id === selectedVariantId,
                  )?.images.length
                  ? mappedProduct.variants.find(
                      (v: any) => v.id === selectedVariantId,
                    )?.images
                  : mappedProduct.images
                : mappedProduct.images
            }
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ProductInfo
            product={mappedProduct}
            selectedVariantId={selectedVariantId || undefined}
            onVariantSelect={setSelectedVariantId}
          />
        </div>
      </div>

      <ReviewsSection reviews={mappedProduct.reviews} />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Product"
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              &ldquo;{product?.name}&rdquo;
            </span>
            ? This action cannot be undone.
          </>
        }
      />
    </PageWrapper>
  );
}
