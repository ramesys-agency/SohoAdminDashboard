interface CollectionFormProps {
  isEdit?: boolean;
}

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

            <div className="flex flex-col gap-2 pt-2">
              <label className="text-sm font-semibold text-slate-700">
                Collection Image
              </label>
              <div className="flex items-center gap-4">
                <div className="size-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 hover:border-[#1325ec] transition-colors cursor-pointer bg-slate-50 group flex-shrink-0">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-[#1325ec]">
                    add_photo_alternate
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-semibold text-slate-700">
                    Upload Image
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Recommended size: 1200x630px.
                  </p>
                </div>
              </div>
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
      </div>
    </div>
  );
}
