interface OrganizationCardProps {
  categoryId: string;
  onCategoryIdChange: (v: string) => void;
  collections: string[];
  onCollectionsChange: (v: string[]) => void;
}

export default function OrganizationCard({
  categoryId,
  onCategoryIdChange,
  collections,
  onCollectionsChange,
}: OrganizationCardProps) {
  const availableCollections = [
    "Summer Essentials",
    "All-Season Basics",
    "New Arrivals",
  ];

  const toggleCollection = (c: string) => {
    if (collections.includes(c)) {
      onCollectionsChange(collections.filter((item) => item !== c));
    } else {
      onCollectionsChange([...collections, c]);
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 mb-4">Organization</h3>
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => onCategoryIdChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] outline-none text-slate-900"
          >
            <option value="">Select a category</option>
            <option value="cat_1">Clothing</option>
            <option value="cat_2">Accessories</option>
            <option value="cat_3">Footwear</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Collections
          </label>
          <div className="flex flex-wrap gap-2">
            {availableCollections.map((c) => (
              <button
                key={c}
                onClick={() => toggleCollection(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  collections.includes(c)
                    ? "bg-[#1325ec] border-[#1325ec] text-white"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
          <span className="material-symbols-outlined text-sm">history</span>
          <span>
            Last edited 2 hours ago by <b>Admin</b>
          </span>
        </div>
      </div>
    </section>
  );
}
