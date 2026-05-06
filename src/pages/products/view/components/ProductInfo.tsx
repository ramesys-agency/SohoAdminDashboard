import StatusBadge from "../../../../components/ui/StatusBadge";
import type { ProductVariantImageData } from "./ProductGallery";

export interface ProductVariantData {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorValue: string;
  stockQty: number;
  basePrice: string;
  originalPrice: string;
  isDefault: boolean;
  images: ProductVariantImageData[];
}

interface ProductInfoProps {
  product: {
    name: string;
    description: string;
    categoryId: string; // we can show ID or lookup name
    attributes: Record<string, string>;
    overallRating: number;
    reviewCount: number;
    isPublished: boolean;
    gender: string[];
    collections: string[];
    variants: ProductVariantData[];
  };
  selectedVariantId?: string;
  onVariantSelect?: (variantId: string) => void;
}

export default function ProductInfo({
  product,
  selectedVariantId,
  onVariantSelect,
}: ProductInfoProps) {
  // Find default variant or first variant for pricing if needed
  const displayVariant = selectedVariantId
    ? product.variants.find((v) => v.id === selectedVariantId)
    : product.variants.find((v) => v.isDefault) || product.variants[0];

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-black text-slate-900">
              {product.name}
            </h2>
            <StatusBadge status={product.isPublished ? "Active" : "Draft"} />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span className="flex items-center text-amber-500">
              <span className="material-symbols-outlined text-[16px] mr-0.5">
                star
              </span>
              {product.overallRating}
            </span>
            <span>({product.reviewCount} reviews)</span>
          </div>
          <p className="text-sm text-slate-500">
            Category ID: {product.categoryId || "None"}
            {product.collections.length > 0 &&
              ` · Collections: ${product.collections.join(", ")}`}
            {product.gender.length > 0 &&
              ` · Gender: ${product.gender.join(", ")}`}
          </p>
        </div>

        {displayVariant && (
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black text-primary">
              ${displayVariant.basePrice}
            </span>
            {parseFloat(displayVariant.originalPrice) >
              parseFloat(displayVariant.basePrice) && (
              <span className="text-lg text-slate-400 line-through">
                ${displayVariant.originalPrice}
              </span>
            )}
          </div>
        )}
      </div>

      <p className="text-sm text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">
        {product.description}
      </p>

      {/* Variants */}
      <div className="border-t border-slate-100 pt-6">
        <h4 className="text-sm font-bold text-slate-700 mb-3">Variants</h4>
        <div className="space-y-3">
          {product.variants.map((v) => (
            <div
              key={v.id}
              onClick={() => onVariantSelect?.(v.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedVariantId === v.id
                  ? "border-primary bg-primary/5"
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              <div
                className="size-8 rounded flex-shrink-0 border border-slate-200"
                style={{ backgroundColor: v.colorValue }}
              ></div>
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium text-slate-800">
                  {v.colorName} / {v.size}
                  {v.isDefault && (
                    <span className="ml-2 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                      Default
                    </span>
                  )}
                </span>
                <span className="text-xs text-slate-500">
                  SKU: {v.sku} · Price: ${v.basePrice}
                </span>
              </div>
              <span
                className={`text-xs font-bold ${v.stockQty < 10 ? "text-rose-500" : "text-emerald-600"}`}
              >
                {v.stockQty} in stock
              </span>
            </div>
          ))}
          {product.variants.length === 0 && (
            <p className="text-sm text-slate-500 italic">
              No variants available.
            </p>
          )}
        </div>
      </div>

      {/* Attributes */}
      {Object.keys(product.attributes).length > 0 && (
        <div className="border-t border-slate-100 pt-6 mt-6">
          <h4 className="text-sm font-bold text-slate-700 mb-2">Attributes</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(product.attributes).map(([key, value]) => (
              <span
                key={key}
                className="px-2.5 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600"
              >
                <span className="font-bold mr-1">{key}:</span>
                {value}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
