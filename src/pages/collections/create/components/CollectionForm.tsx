import { useState } from "react";
import ProductsTable from "../../../../components/ui/ProductsTable";
import { mockProducts, type Product } from "../../../../mocks/products";

interface CollectionFormProps {
  isEdit?: boolean;
}

export default function CollectionForm({
  isEdit = false,
}: CollectionFormProps) {
  const [productFilter, setProductFilter] = useState<
    "All" | "Added" | "Not Added"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedProducts, setAddedProducts] = useState<Set<string>>(
    new Set(mockProducts.slice(0, 4).map((p: Product) => p.id)),
  );

  const toggleProduct = (id: string) => {
    const next = new Set(addedProducts);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setAddedProducts(next);
  };

  const filteredProducts = mockProducts.filter((p: Product) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesToggle =
      productFilter === "All" ||
      (productFilter === "Added" && addedProducts.has(p.id)) ||
      (productFilter === "Not Added" && !addedProducts.has(p.id));
    return matchesSearch && matchesToggle;
  });

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

        {/* Products List */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col min-h-[550px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-slate-900">Products</h3>
              <span className="px-2 py-0.5 rounded-full bg-[#1325ec]/10 text-[#1325ec] text-xs font-bold">
                {addedProducts.size}
              </span>
            </div>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              {(["All", "Added", "Not Added"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setProductFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    productFilter === tab
                      ? "bg-white text-[#1325ec] shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#1325ec]"
              />
            </div>
            <button className="px-3 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              <span className="material-symbols-outlined text-lg">
                filter_list
              </span>
              Filters
            </button>
          </div>

          <div className="flex-1">
            <ProductsTable
              products={filteredProducts}
              selectable={true}
              selectedIds={addedProducts}
              onToggle={toggleProduct}
              itemsPerPage={5}
              hideActions={true}
            />
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
