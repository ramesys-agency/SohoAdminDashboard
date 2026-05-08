import React, { useRef } from "react";
import { type ProductVariantImageData } from "../../view/components/ProductGallery";
import { generateUUID } from "../../../../utils/uuid";

export interface SizeVariantData {
  id: string;
  size: string;
  sku: string;
  stockQty: number;
  basePrice: string;
  originalPrice: string;
}

export interface ColorGroupData {
  id: string;
  colorName: string;
  colorValue: string;
  isDefault: boolean;
  images: ProductVariantImageData[];
  sizes: SizeVariantData[];
}

interface VariantsTableProps {
  colorGroups: ColorGroupData[];
  onColorGroupsChange: (groups: ColorGroupData[]) => void;
}

function ColorGroupCard({
  group,
  onUpdate,
  onRemove,
  isOnly,
}: {
  group: ColorGroupData;
  onUpdate: (field: keyof ColorGroupData, value: any) => void;
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
        isPrimary: group.images.length === 0 && i === 0,
        colorRef: group.colorValue || "#f1f5f9",
      }));
      onUpdate("images", [...group.images, ...newImages]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id: string) => {
    const remaining = group.images.filter((img) => img.id !== id);
    if (remaining.length > 0 && !remaining.some((img) => img.isPrimary)) {
      remaining[0].isPrimary = true;
    }
    onUpdate("images", remaining);
  };

  const setPrimary = (id: string) => {
    onUpdate(
      "images",
      group.images.map((img) => ({ ...img, isPrimary: img.id === id })),
    );
  };

  const addSize = () => {
    onUpdate("sizes", [
      ...group.sizes,
      {
        id: generateUUID(),
        size: "",
        sku: "",
        stockQty: 0,
        basePrice: "",
        originalPrice: "",
      },
    ]);
  };

  const updateSize = (
    sizeId: string,
    field: keyof SizeVariantData,
    value: any,
  ) => {
    onUpdate(
      "sizes",
      group.sizes.map((s) => (s.id === sizeId ? { ...s, [field]: value } : s)),
    );
  };

  const removeSize = (sizeId: string) => {
    onUpdate(
      "sizes",
      group.sizes.filter((s) => s.id !== sizeId),
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={group.colorValue}
            onChange={(e) => onUpdate("colorValue", e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-slate-200 p-0"
            title="Pick variant color"
          />
          <input
            type="text"
            value={group.colorName}
            onChange={(e) => onUpdate("colorName", e.target.value)}
            placeholder="Color Name (e.g. Navy Blue)"
            className="rounded-lg border border-slate-200 px-3 py-1 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-slate-900 min-w-[200px]"
          />
          {group.isDefault && (
            <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
              Default
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!group.isDefault && (
            <button
              onClick={() => onUpdate("isDefault", true)}
              className="text-xs text-slate-500 hover:text-primary font-medium"
              title="Set as default color"
            >
              Set Default
            </button>
          )}
          {!isOnly && (
            <button
              onClick={onRemove}
              className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
              title="Remove color group"
            >
              <span className="material-symbols-outlined text-[18px]">
                delete
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 border-r border-slate-100 pr-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">
              Sizes & Pricing
            </h4>
            <button
              onClick={addSize}
              className="text-xs text-primary px-2 py-1 hover:bg-primary/10 rounded transition-colors duration-200 font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span> Add
              Size
            </button>
          </div>

          <div className="space-y-3">
            {group.sizes.map((sz) => (
              <div
                key={sz.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 relative group"
              >
                <button
                  onClick={() => removeSize(sz.id)}
                  className="absolute -top-2 -right-2 bg-white text-slate-400 hover:text-red-500 border border-slate-200 rounded-full w-5 h-5 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[12px]">
                    close
                  </span>
                </button>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      Size
                    </label>
                    <select
                      value={sz.size}
                      onChange={(e) =>
                        updateSize(sz.id, "size", e.target.value)
                      }
                      className="w-full rounded text-xs border border-slate-200 px-2 py-1.5 focus:border-primary outline-none"
                    >
                      <option value="">Select</option>
                      {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={sz.sku}
                      onChange={(e) => updateSize(sz.id, "sku", e.target.value)}
                      placeholder="SKU"
                      className="w-full rounded text-xs border border-slate-200 px-2 py-1.5 focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={
                        sz.basePrice === "0.00" || sz.basePrice === "0"
                          ? ""
                          : sz.basePrice
                      }
                      onChange={(e) =>
                        updateSize(sz.id, "basePrice", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-full rounded text-xs border border-slate-200 px-2 py-1.5 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      MRP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={
                        sz.originalPrice === "0.00" || sz.originalPrice === "0"
                          ? ""
                          : sz.originalPrice
                      }
                      onChange={(e) =>
                        updateSize(sz.id, "originalPrice", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-full rounded text-xs border border-slate-200 px-2 py-1.5 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={sz.stockQty === 0 ? "" : sz.stockQty}
                      onChange={(e) =>
                        updateSize(
                          sz.id,
                          "stockQty",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="0"
                      className="w-full rounded text-xs border border-slate-200 px-2 py-1.5 focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            {group.sizes.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-2">
                No sizes added yet.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Color Images <span className="text-red-500">*</span>
          </label>
          <p className="text-[10px] text-slate-400 -mt-1 mb-1">
            These images apply to all sizes in this color.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {group.images.map((img) => (
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
                      className="bg-white rounded-full p-1 text-primary shadow-md hover:scale-110 transition-transform"
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
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors group text-slate-400 hover:text-primary"
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
  colorGroups,
  onColorGroupsChange,
}: VariantsTableProps) {
  const addColorGroup = () => {
    const newGroup: ColorGroupData = {
      id: generateUUID(),
      colorName: "",
      colorValue: "#000000",
      isDefault: colorGroups.length === 0,
      images: [],
      sizes: [
        {
          id: generateUUID(),
          size: "",
          sku: "",
          stockQty: 0,
          basePrice: "",
          originalPrice: "",
        },
      ],
    };
    onColorGroupsChange([...colorGroups, newGroup]);
  };

  const updateColorGroup = (
    id: string,
    field: keyof ColorGroupData,
    value: any,
  ) => {
    let updated = colorGroups.map((g) =>
      g.id === id ? { ...g, [field]: value } : g,
    );
    if (field === "isDefault" && value === true) {
      updated = updated.map((g) => ({ ...g, isDefault: g.id === id }));
    }
    onColorGroupsChange(updated);
  };

  const removeColorGroup = (id: string) => {
    const remaining = colorGroups.filter((g) => g.id !== id);
    if (remaining.length > 0 && !remaining.some((g) => g.isDefault)) {
      remaining[0].isDefault = true;
    }
    onColorGroupsChange(remaining);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Product Variants</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Group your product sizes by color, and assign images to each color.
          </p>
        </div>
        <button
          onClick={addColorGroup}
          className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Variant
        </button>
      </div>

      {colorGroups.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-300">
            palette
          </span>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            No colors added
          </p>
          <p className="text-slate-400 text-xs">
            Click "Add Color" to start adding size and pricing options.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {colorGroups.map((g) => (
            <ColorGroupCard
              key={g.id}
              group={g}
              onUpdate={(field, value) => updateColorGroup(g.id, field, value)}
              onRemove={() => removeColorGroup(g.id)}
              isOnly={colorGroups.length === 1}
            />
          ))}
        </div>
      )}
    </section>
  );
}
