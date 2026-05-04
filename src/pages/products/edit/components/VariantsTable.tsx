import React, { useRef } from "react";
import { type ProductVariantImageData } from "../../view/components/ProductGallery";
import { generateUUID } from "../../../../utils/uuid";

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

interface VariantsTableProps {
  variants: ProductVariantData[];
  onVariantsChange: (variants: ProductVariantData[]) => void;
}

function VariantCard({
  variant,
  onUpdate,
  onRemove,
  isOnly,
}: {
  variant: ProductVariantData;
  onUpdate: (
    field: keyof ProductVariantData,
    value: string | number | boolean | ProductVariantImageData[],
  ) => void;
  onRemove: () => void;
  isOnly: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file, i) => ({
        id: generateUUID(),
        imageUrl: URL.createObjectURL(file),
        file,
        isPrimary: variant.images.length === 0 && i === 0,
        colorRef: variant.colorValue || "#f1f5f9",
      }));
      onUpdate("images", [...variant.images, ...newImages]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    const remaining = variant.images.filter((img) => img.id !== id);
    // Re-assign primary to first if removed was primary
    if (remaining.length > 0 && !remaining.some((img) => img.isPrimary)) {
      remaining[0].isPrimary = true;
    }
    onUpdate("images", remaining);
  };

  const setPrimary = (id: string) => {
    onUpdate(
      "images",
      variant.images.map((img) => ({ ...img, isPrimary: img.id === id })),
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={variant.colorValue}
            onChange={(e) => onUpdate("colorValue", e.target.value)}
            className="w-6 h-6 rounded cursor-pointer border border-slate-200 p-0"
            title="Pick variant color"
          />
          <span className="text-sm font-semibold text-slate-700">
            {variant.colorName || variant.sku || "New Variant"}
          </span>
          {variant.isDefault && (
            <span className="text-[10px] bg-[#1325ec]/10 text-[#1325ec] font-bold px-2 py-0.5 rounded-full">
              Default
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!variant.isDefault && (
            <button
              onClick={() => onUpdate("isDefault", true)}
              className="text-xs text-slate-500 hover:text-[#1325ec] font-medium"
              title="Set as default variant"
            >
              Set Default
            </button>
          )}
          {!isOnly && (
            <button
              onClick={onRemove}
              className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
              title="Remove variant"
            >
              <span className="material-symbols-outlined text-[18px]">
                delete
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Color Name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Color Name
              </label>
              <input
                type="text"
                value={variant.colorName}
                onChange={(e) => onUpdate("colorName", e.target.value)}
                placeholder="e.g. Navy Blue"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none text-slate-900"
              />
            </div>
            {/* Size */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Size
              </label>
              <select
                value={variant.size}
                onChange={(e) => onUpdate("size", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none text-slate-900 bg-white"
              >
                <option value="">Select Size</option>
                {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SKU */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={variant.sku}
              onChange={(e) => onUpdate("sku", e.target.value)}
              placeholder="e.g. PROD-001-NVY-M"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none text-slate-900"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Base Price */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Base Price (SP) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  ৳
                </span>
                <input
                  type="number"
                  value={variant.basePrice === "0.00" || variant.basePrice === "0" ? "" : variant.basePrice}
                  onChange={(e) => onUpdate("basePrice", e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-slate-200 pl-6 pr-3 py-2 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none text-slate-900"
                />
              </div>
            </div>
            {/* Original Price */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                MRP
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  ৳
                </span>
                <input
                  type="number"
                  value={variant.originalPrice === "0.00" || variant.originalPrice === "0" ? "" : variant.originalPrice}
                  onChange={(e) => onUpdate("originalPrice", e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-slate-200 pl-6 pr-3 py-2 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none text-slate-900"
                />
              </div>
            </div>
            {/* Stock */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Stock
              </label>
              <input
                type="number"
                value={variant.stockQty === 0 ? "" : variant.stockQty}
                onChange={(e) =>
                  onUpdate("stockQty", parseInt(e.target.value) || 0)
                }
                placeholder="0"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Right: Images */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Images <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {variant.images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden group"
              >
                <img
                  src={img.imageUrl}
                  alt="Variant"
                  className="w-full h-full object-cover"
                />
                {img.isPrimary && (
                  <div className="absolute bottom-0 left-0 right-0 bg-slate-900/60 text-white text-[9px] font-bold text-center py-0.5">
                    Primary
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {!img.isPrimary && (
                    <button
                      onClick={() => setPrimary(img.id)}
                      className="bg-white rounded-full p-1 text-[#1325ec] shadow-md hover:scale-110 transition-transform"
                      title="Set as primary"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        star
                      </span>
                    </button>
                  )}
                  <button
                    onClick={() => removeImage(img.id)}
                    className="bg-white rounded-full p-1 text-red-500 shadow-md hover:scale-110 transition-transform"
                    title="Remove"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
            {/* Upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 hover:border-[#1325ec] hover:bg-[#1325ec]/5 transition-colors group text-slate-400 hover:text-[#1325ec]"
            >
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
                add_a_photo
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider">
                Add
              </span>
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

export default function VariantsTable({
  variants,
  onVariantsChange,
}: VariantsTableProps) {
  const addVariant = () => {
    const newVariant: ProductVariantData = {
      id: generateUUID(),
      sku: "",
      size: "",
      colorName: "",
      colorValue: "#000000",
      stockQty: 0,
      basePrice: "",
      originalPrice: "",
      isDefault: variants.length === 0,
      images: [],
    };
    onVariantsChange([...variants, newVariant]);
  };

  const updateVariant = (
    id: string,
    field: keyof ProductVariantData,
    value: string | number | boolean | ProductVariantImageData[],
  ) => {
    let updated = variants.map((v) =>
      v.id === id ? { ...v, [field]: value } : v,
    );
    // If setting a variant as default, unset others
    if (field === "isDefault" && value === true) {
      updated = updated.map((v) => ({ ...v, isDefault: v.id === id }));
    }
    onVariantsChange(updated);
  };

  const removeVariant = (id: string) => {
    const remaining = variants.filter((v) => v.id !== id);
    // Ensure at least one default
    if (remaining.length > 0 && !remaining.some((v) => v.isDefault)) {
      remaining[0].isDefault = true;
    }
    onVariantsChange(remaining);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Variants</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add size/color combinations with pricing and images
          </p>
        </div>
        <button
          onClick={addVariant}
          className="flex items-center gap-1.5 bg-[#1325ec] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1325ec]/90 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Variant
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-300">
            checkroom
          </span>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            No variants yet
          </p>
          <p className="text-slate-400 text-xs">
            Click "Add Variant" to add size/color options
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {variants.map((v) => (
            <VariantCard
              key={v.id}
              variant={v}
              onUpdate={(field, value) => updateVariant(v.id, field, value)}
              onRemove={() => removeVariant(v.id)}
              isOnly={variants.length === 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}
