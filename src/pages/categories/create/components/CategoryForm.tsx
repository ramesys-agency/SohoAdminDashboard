import { useState } from "react";

interface CategoryFormProps {
  isEdit?: boolean;
}

import Button from "../../../../components/ui/Button";

export default function CategoryForm({ isEdit = false }: CategoryFormProps) {
  const [selectedGenders, setSelectedGenders] = useState<string[]>(["UNISEX"]);

  const toggleGender = (g: string) => {
    if (selectedGenders.includes(g)) {
      setSelectedGenders(selectedGenders.filter((item) => item !== g));
    } else {
      setSelectedGenders([...selectedGenders, g]);
    }
  };
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left: Main form */}
      <div className="xl:col-span-2 space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-4 text-slate-900">
            Category Details
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Category Name
              </label>
              <input
                type="text"
                defaultValue={isEdit ? "Electronics" : ""}
                placeholder="e.g. Electronics, Apparel..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Gender
              </label>
              <div className="flex gap-2 flex-wrap">
                {["MALE", "FEMALE", "UNISEX", "KIDS"].map((g) => (
                  <Button
                    key={g}
                    type="button"
                    onClick={() => toggleGender(g)}
                    variant={
                      selectedGenders.includes(g) ? "primary" : "outline"
                    }
                    size="sm"
                  >
                    {g}
                  </Button>
                ))}
              </div>
            </div>

            {/* 
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Slug / URL Handle
              </label>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
                <span className="px-3 text-slate-400 text-xs">
                  /categories/
                </span>
                <input
                  type="text"
                  defaultValue={isEdit ? "electronics" : ""}
                  placeholder="auto-generated"
                  className="bg-transparent flex-1 py-2.5 px-0 text-sm focus:outline-none"
                />
              </div>
            </div>
            */}
            <div className="flex flex-col gap-2 pt-2">
              <label className="text-sm font-semibold text-slate-700">
                Cover Image
              </label>
              <div className="flex items-center gap-4">
                <div className="size-24 rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 hover:border-[#1325ec] transition-colors cursor-pointer bg-slate-50 group flex-shrink-0">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-[#1325ec]">
                    add_photo_alternate
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-semibold text-slate-700">
                    Upload Category Cover
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Recommended size: 800x800px. Max 2MB.
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Square images work best for full rounded display.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                rows={4}
                defaultValue={
                  isEdit
                    ? "All electronic gadgets, devices, and accessories."
                    : ""
                }
                placeholder="Brief description of this category..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none resize-none"
              />
            </div>
          </div>
        </section>

        {/* Parent Category */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-4 text-slate-900">Hierarchy</h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Parent Category
            </label>
            <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none">
              <option value="">None (Top-level)</option>
              <option value="electronics">Electronics</option>
              <option value="apparel">Apparel</option>
              <option value="home">Home & Living</option>
            </select>
            <p className="text-xs text-slate-500">
              Leave empty to create a top-level category.
            </p>
          </div>
        </section>

        {/* SEO */}
        {/*
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-4 text-slate-900">SEO</h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Meta Title
              </label>
              <input
                type="text"
                defaultValue={isEdit ? "Electronics | Store" : ""}
                placeholder="Page title for search engines"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Meta Description
              </label>
              <textarea
                rows={3}
                defaultValue={
                  isEdit ? "Browse our wide selection of electronics." : ""
                }
                placeholder="Short description for search engines..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none resize-none"
              />
            </div>
          </div>
        </section>
        */}
      </div>

      {/* Right sidebar */}
      <div className="space-y-6">
        {/* Status */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Status</h3>
          <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none font-medium">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </section>
      </div>
    </div>
  );
}
