import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import ProductsTable from "../../../components/ui/ProductsTable";
import Button from "../../../components/ui/Button";
import { mockProducts, type Product } from "../../../mocks/products";

export default function AddProductsToCollection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productFilter, setProductFilter] = useState<
    "All" | "Added" | "Not Added"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

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

  const handleSave = () => {
    console.log(
      `Adding products ${Array.from(addedProducts)} to collection ${id}`,
    );
    // In a real app, you'd call an API here
    navigate("/collections");
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Add Products to Collection"
        description={
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate("/collections")}
            leftIcon={
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
            }
            className="hover:underline"
          >
            Back to Collections
          </Button>
        }
        actions={
          <>
            <Button variant="outline" onClick={() => navigate("/collections")}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={addedProducts.size === 0}>
              Save Changes
            </Button>
          </>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col min-h-[600px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">Products</h3>
            <span className="px-2 py-0.5 rounded-full bg-[#1325ec]/10 text-[#1325ec] text-xs font-bold">
              {addedProducts.size} selected
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
            itemsPerPage={10}
            hideActions={true}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
