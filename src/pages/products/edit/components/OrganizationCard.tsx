import { useState, useEffect } from "react";
import { getParentCategories } from "../../../../api/categories";

interface OrganizationCardProps {
  categoryId: string;
  onCategoryIdChange: (v: string) => void;
  collections: string[];
  onCollectionsChange: (v: string[]) => void;
}

interface ParentCategory {
  id: string;
  name: string;
}

export default function OrganizationCard({
  categoryId,
  onCategoryIdChange,
  // collections,
  // onCollectionsChange,
}: OrganizationCardProps) {
  const [categories, setCategories] = useState<ParentCategory[]>([]);

  useEffect(() => {
    getParentCategories()
      .then((res) => setCategories(res?.data ?? []))
      .catch(() => {});
  }, []);

  // const availableCollections = [
  //   "Summer Essentials",
  //   "All-Season Basics",
  //   "New Arrivals",
  // ];

  // const toggleCollection = (c: string) => {
  //   if (collections.includes(c)) {
  //     onCollectionsChange(collections.filter((item) => item !== c));
  //   } else {
  //     onCollectionsChange([...collections, c]);
  //   }
  // };

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Category <span className="text-red-500">*</span></h3>
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Select a category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-100 rounded-lg">
            {categories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryIdChange(cat.id)}
                  className={`flex items-center px-3 py-2 rounded-lg border text-sm transition-all text-left ${
                    isSelected
                      ? "bg-[#1325ec]/10 border-[#1325ec] text-[#1325ec] font-semibold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className={`material-symbols-outlined text-sm mr-2 ${isSelected ? "text-[#1325ec]" : "text-slate-400"}`}>
                    {isSelected ? "check_circle" : "circle"}
                  </span>
                  {cat.name}
                </button>
              );
            })}
          </div>
          {!categoryId && (
            <p className="text-[10px] text-amber-600 font-medium italic">Category is required</p>
          )}
        </div>

        {/* <div className="flex flex-col gap-1.5">
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
        </div> */}
      </div>
    </section>
  );
}
