import React, { useState } from "react";
import MediaUpload from "./MediaUpload";
import { type ProductVariantImageData } from "../../view/components/ProductGallery";

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

export default function VariantsTable({
  variants,
  onVariantsChange,
}: VariantsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addVariant = () => {
    const newId = crypto.randomUUID();
    const newVariant: ProductVariantData = {
      id: newId,
      sku: "",
      size: "",
      colorName: "",
      colorValue: "#000000",
      stockQty: 0,
      basePrice: "0.00",
      originalPrice: "0.00",
      isDefault: variants.length === 0,
      images: [],
    };
    onVariantsChange([...variants, newVariant]);
    setExpandedId(newId);
  };

  const updateVariant = (
    id: string,
    field: keyof ProductVariantData,
    value: string | number | boolean | ProductVariantImageData[],
  ) => {
    onVariantsChange(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );
  };

  const removeVariant = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onVariantsChange(variants.filter((v) => v.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">Variants</h3>
        <button
          onClick={addVariant}
          className="flex items-center gap-1 bg-[#1325ec]/10 text-[#1325ec] px-3 py-1.5 rounded-lg text-sm font-bold"
        >
          <span className="material-symbols-outlined text-sm">add</span> Add
          Variant
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              <th className="px-4 py-3 w-8"></th>
              <th className="px-4 py-3">Color</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Base Price</th>
              <th className="px-4 py-3">Original Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {variants.map((v) => (
              <React.Fragment key={v.id}>
                <tr
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${expandedId === v.id ? "bg-slate-50" : ""}`}
                  onClick={() => toggleExpand(v.id)}
                >
                  <td className="px-4 py-3 text-slate-400">
                    <span
                      className={`material-symbols-outlined transition-transform duration-200 ${expandedId === v.id ? "rotate-90" : ""}`}
                    >
                      chevron_right
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={v.colorValue}
                        onChange={(e) =>
                          updateVariant(v.id, "colorValue", e.target.value)
                        }
                        className="w-8 h-8 rounded shrink-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={v.colorName}
                        onChange={(e) =>
                          updateVariant(v.id, "colorName", e.target.value)
                        }
                        placeholder="Color"
                        className="w-24 bg-transparent border-b border-slate-200 px-1 py-1 text-sm focus:outline-none focus:border-[#1325ec] text-slate-900"
                      />
                    </div>
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) =>
                        updateVariant(v.id, "size", e.target.value)
                      }
                      placeholder="Size"
                      className="w-16 bg-transparent border-b border-slate-200 px-1 py-1 text-sm focus:outline-none focus:border-[#1325ec] text-slate-900"
                    />
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) =>
                        updateVariant(v.id, "sku", e.target.value)
                      }
                      placeholder="SKU"
                      className="w-24 bg-transparent border-b border-slate-200 px-1 py-1 text-sm focus:outline-none focus:border-[#1325ec] text-slate-900"
                    />
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="number"
                      value={v.basePrice}
                      onChange={(e) =>
                        updateVariant(v.id, "basePrice", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-20 bg-transparent border-b border-slate-200 px-1 py-1 text-sm focus:outline-none focus:border-[#1325ec] text-slate-900"
                    />
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="number"
                      value={v.originalPrice}
                      onChange={(e) =>
                        updateVariant(v.id, "originalPrice", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-20 bg-transparent border-b border-slate-200 px-1 py-1 text-sm focus:outline-none focus:border-[#1325ec] text-slate-900"
                    />
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="number"
                      value={v.stockQty}
                      onChange={(e) =>
                        updateVariant(
                          v.id,
                          "stockQty",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="0"
                      className="w-16 bg-transparent border-b border-slate-200 px-1 py-1 text-sm focus:outline-none focus:border-[#1325ec] text-slate-900"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => removeVariant(v.id, e)}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Remove variant"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        delete
                      </span>
                    </button>
                  </td>
                </tr>
                {expandedId === v.id && (
                  <tr className="bg-slate-50/50 border-t border-slate-100">
                    <td colSpan={8} className="px-6 py-4">
                      <div className="pl-6 border-l-2 border-indigo-200">
                        <MediaUpload
                          images={v.images}
                          onImagesChange={(images) =>
                            updateVariant(v.id, "images", images)
                          }
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {variants.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-8 text-center text-slate-500 text-sm"
                >
                  No variants added yet. Click "Add Variant" to start.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
