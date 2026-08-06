import { useState, useEffect } from "react";
import {
  getParentCategories,
  type CategoryTreeNode,
} from "../../../../api/categories";
import CategorySelectOptions from "../../../../components/ui/CategorySelectOptions";

interface OrganizationCardProps {
  categoryId: string;
  onCategoryIdChange: (v: string) => void;
  collections: string[];
  onCollectionsChange: (v: string[]) => void;
}

export default function OrganizationCard({
  categoryId,
  onCategoryIdChange,
  // collections,
  // onCollectionsChange,
}: OrganizationCardProps) {
  const [categories, setCategories] = useState<CategoryTreeNode[]>([]);

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
      <h3 className="text-lg font-bold text-slate-900 mb-4">
        Category <span className="text-red-500">*</span>
      </h3>
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Select a category
          </label>
          <div className="relative">
            <select
              value={categoryId}
              onChange={(e) => onCategoryIdChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
            >
              <option value="">Select a category</option>
              <CategorySelectOptions categories={categories} />
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-lg">
                expand_more
              </span>
            </div>
          </div>
          {!categoryId && (
            <p className="text-[10px] text-amber-600 font-medium italic">
              Category is required
            </p>
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
                    ? "bg-primary border-primary text-white"
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
