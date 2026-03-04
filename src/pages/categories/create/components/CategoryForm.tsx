interface CategoryFormProps {
  isEdit?: boolean;
}

export default function CategoryForm({ isEdit = false }: CategoryFormProps) {
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
            <div className="flex flex-col gap-1.5">
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

        {/* Icon */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Icon</h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Material Icon Name
            </label>
            <input
              type="text"
              defaultValue={isEdit ? "devices" : ""}
              placeholder="e.g. devices, apparel"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
            <p className="text-xs text-slate-400">
              From Material Symbols library
            </p>
          </div>
          <div className="mt-3 size-12 rounded-lg bg-[#1325ec]/10 flex items-center justify-center text-[#1325ec]">
            <span className="material-symbols-outlined">
              {isEdit ? "devices" : "category"}
            </span>
          </div>
        </section>

        {/* Image */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Cover Image</h3>
          <div className="aspect-video rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 hover:border-[#1325ec] transition-colors cursor-pointer bg-slate-50 group">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-[#1325ec]">
              add_photo_alternate
            </span>
            <span className="text-xs text-slate-500">Upload image</span>
          </div>
        </section>
      </div>
    </div>
  );
}
