interface CollectionFormProps {
  isEdit?: boolean;
}

const conditionOptions = [
  "Product category is equal to",
  "Product price is greater than",
  "Product tag is equal to",
  "Product title contains",
];

export default function CollectionForm({
  isEdit = false,
}: CollectionFormProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left: Main form */}
      <div className="xl:col-span-2 space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-4 text-slate-900">
            Collection Details
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Collection Title
              </label>
              <input
                type="text"
                defaultValue={isEdit ? "Best Sellers" : ""}
                placeholder="e.g. Summer Sale, New Arrivals..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Description
              </label>
              <textarea
                rows={4}
                defaultValue={
                  isEdit
                    ? "Our top-selling products across all categories."
                    : ""
                }
                placeholder="Describe what products belong in this collection..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none resize-none"
              />
            </div>
          </div>
        </section>

        {/* Collection Type */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-4 text-slate-900">
            Collection Type
          </h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="mt-0.5 size-4 rounded-full border-2 border-[#1325ec] flex items-center justify-center">
                <div className="size-2 rounded-full bg-[#1325ec]"></div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Automated
                </p>
                <p className="text-xs text-slate-500">
                  Products matching set conditions are added automatically.
                </p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="mt-0.5 size-4 rounded-full border-2 border-slate-300"></div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Manual</p>
                <p className="text-xs text-slate-500">
                  Add products one by one by searching or browsing.
                </p>
              </div>
            </label>
          </div>

          {/* Conditions */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-slate-700">Conditions</h4>
              <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5">
                <option>Products must match ALL conditions</option>
                <option>Products must match ANY condition</option>
              </select>
            </div>
            <div className="space-y-3">
              {conditionOptions.slice(0, 2).map((condition, i) => (
                <div key={i} className="flex items-center gap-3">
                  <select className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1325ec]">
                    {conditionOptions.map((c) => (
                      <option key={c} selected={c === condition}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    defaultValue={i === 0 ? "Electronics" : "50"}
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1325ec]"
                  />
                  <button className="text-slate-400 hover:text-red-500">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-3 flex items-center gap-1 text-[#1325ec] text-sm font-bold">
              <span className="material-symbols-outlined text-sm">add</span>
              Add Condition
            </button>
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
                defaultValue={isEdit ? "Best Sellers | Shop" : ""}
                placeholder="Page title for search engines"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Meta Description
              </label>
              <textarea
                rows={2}
                defaultValue=""
                placeholder="Short description..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none resize-none"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Right sidebar */}
      <div className="space-y-6">
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Status</h3>
          <select className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none font-medium">
            <option>Active</option>
            <option>Inactive</option>
            <option>Archived</option>
          </select>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Collection Image
          </h3>
          <div className="aspect-video rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 hover:border-[#1325ec] transition-colors cursor-pointer bg-slate-50 group">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-[#1325ec]">
              add_photo_alternate
            </span>
            <span className="text-xs text-slate-500">Upload image</span>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Display Order
          </h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Sort Position
            </label>
            <input
              type="number"
              defaultValue={isEdit ? 1 : ""}
              placeholder="e.g. 1"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
            />
            <p className="text-xs text-slate-400">
              Lower numbers appear first.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
