import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import Button from "../../../components/ui/Button";
import Pagination from "../../../components/ui/Pagination";
import StatusBadge from "../../../components/ui/StatusBadge";
import ProductFilters from "../../products/components/ProductFilters";
import { getProducts, type ApiProduct } from "../../../api/products";
import { getCollections, type Collection } from "../../../api/collections";
import {
  getPlacementById,
  addProductsToPlacement,
  removeProductsFromPlacement,
} from "../../../api/placements";
import { getParentCategories } from "../../../api/categories";

interface ParentCategory {
  id: string;
  name: string;
}

const LIMIT = 20;

export default function AddProductsToPlacement() {
  const { id } = useParams(); // placement ID
  const navigate = useNavigate();
  const location = useLocation();
  const placementNameFromState = location.state?.placementName as string | undefined;

  // Filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [gender, setGender] = useState("");
  const [isPublished, setIsPublished] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [filterCollectionId, setFilterCollectionId] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [productFilter, setProductFilter] = useState<"All" | "Added" | "Not Added">("All");

  // Data state
  const [placementName, setPlacementName] = useState(placementNameFromState ?? "");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: LIMIT, totalPages: 1 });
  const [categories, setCategories] = useState<ParentCategory[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selected products tracking
  const [selectedProductsMap, setSelectedProductsMap] = useState<Map<string, ApiProduct>>(new Map());
  const [initialSelectedIds, setInitialSelectedIds] = useState<Set<string>>(new Set());

  // Debounce search
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  }, []);

  const handleGenderChange = (v: string) => { setGender(v); setPage(1); };
  const handleIsPublishedChange = (v: string) => { setIsPublished(v); setPage(1); };
  const handleCategoryChange = (v: string) => { setCategoryId(v); setPage(1); };
  const handleCollectionChange = (v: string) => { setFilterCollectionId(v); setPage(1); };
  const handleSortByChange = (v: string) => { setSortBy(v); setPage(1); };

  // Fetch categories & collections once on mount
  useEffect(() => {
    getParentCategories()
      .then((res) => setCategories(res?.data ?? []))
      .catch(() => {});

    getCollections(1, 100)
      .then((res) => setCollections(res?.data ?? []))
      .catch(() => {});
  }, []);

  // Fetch placement to get its already-added products
  useEffect(() => {
    if (!id) return;
    getPlacementById(id)
      .then((res) => {
        const placement = res.data;
        if (placement.name) {
          setPlacementName(placement.name);
        }
        const newMap = new Map<string, ApiProduct>();
        const initialSet = new Set<string>();
        placement.products?.forEach((pp) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          newMap.set(pp.productId, pp.product as any);
          initialSet.add(pp.productId);
        });
        setSelectedProductsMap(newMap);
        setInitialSelectedIds(initialSet);
      })
      .catch(console.error);
  }, [id]);

  // Fetch products when filters change
  useEffect(() => {
    let isMounted = true;

    const fetchProductsData = async () => {
      if (isMounted) { setLoading(true); setError(null); }

      const params: Record<string, string | number | boolean> = { page, limit: LIMIT };
      if (debouncedSearch) params.search = debouncedSearch;
      if (gender) params.gender = gender;
      if (isPublished !== "") params.isPublished = isPublished === "true";
      if (categoryId) params.categoryId = categoryId;
      if (filterCollectionId) params.collectionId = filterCollectionId;
      if (sortBy) params.sortBy = sortBy;

      try {
        const res = await getProducts(params);
        if (!isMounted) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyRes = res as any;
        const fetchedProducts: ApiProduct[] = Array.isArray(anyRes.data)
          ? anyRes.data
          : Array.isArray(anyRes.products)
            ? anyRes.products
            : Array.isArray(anyRes.items)
              ? anyRes.items
              : Array.isArray(anyRes)
                ? anyRes
                : [];

        const newMeta = anyRes.meta ?? anyRes.pagination ?? anyRes.pageMeta ?? {
          total: fetchedProducts.length,
          page: 1,
          limit: LIMIT,
          totalPages: 1,
        };

        setProducts(fetchedProducts);
        setMeta(newMeta);
      } catch {
        if (isMounted) setError("Failed to load products. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductsData();
    return () => { isMounted = false; };
  }, [page, debouncedSearch, gender, isPublished, categoryId, filterCollectionId, sortBy]);

  const toggleProduct = (product: ApiProduct) => {
    setSelectedProductsMap((prev) => {
      const next = new Map(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.set(product.id, product);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      const currentSelectedIds = Array.from(selectedProductsMap.keys());
      const toAdd = currentSelectedIds.filter((pid) => !initialSelectedIds.has(pid));
      const toRemove = Array.from(initialSelectedIds).filter((pid) => !selectedProductsMap.has(pid));

      if (toAdd.length > 0) await addProductsToPlacement(id, toAdd);
      if (toRemove.length > 0) await removeProductsFromPlacement(id, toRemove);

      toast.success("Products saved to placement successfully.");
      navigate("/placements");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(e?.response?.data?.message || e?.message || "Failed to save products.");
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  let displayedProducts = products;
  if (productFilter === "Added") {
    displayedProducts = Array.from(selectedProductsMap.values());
  } else if (productFilter === "Not Added") {
    displayedProducts = products.filter((p) => !selectedProductsMap.has(p.id));
  }

  const allCurrentPageSelected =
    displayedProducts.length > 0 &&
    displayedProducts.every((p) => selectedProductsMap.has(p.id));

  const someCurrentPageSelected =
    !allCurrentPageSelected &&
    displayedProducts.some((p) => selectedProductsMap.has(p.id));

  const toggleAllCurrentPage = () => {
    setSelectedProductsMap((prev) => {
      const next = new Map(prev);
      if (allCurrentPageSelected) {
        displayedProducts.forEach((p) => next.delete(p.id));
      } else {
        displayedProducts.forEach((p) => next.set(p.id, p));
      }
      return next;
    });
  };

  const from = (page - 1) * LIMIT + 1;
  const to = Math.min(page * LIMIT, meta.total);

  return (
    <PageWrapper>
      <PageHeader
        title={`Add products to ${placementName || "Section"}`}
        description={
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate("/placements")}
            leftIcon={
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            }
            className="hover:underline"
          >
            Back to Placements
          </Button>
        }
        actions={
          <>
            <Button variant="outline" onClick={() => navigate("/placements")}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </>
        }
      />

      <div className="flex items-center justify-between gap-4 mb-4 mt-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          Products
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
            {selectedProductsMap.size} selected
          </span>
        </h3>
        <div className="flex items-center bg-slate-100 p-1 rounded-lg">
          {(["All", "Added", "Not Added"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setProductFilter(tab); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                productFilter === tab
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <ProductFilters
        search={search}
        onSearchChange={handleSearchChange}
        gender={gender}
        onGenderChange={handleGenderChange}
        isPublished={isPublished}
        onIsPublishedChange={handleIsPublishedChange}
        categoryId={categoryId}
        onCategoryChange={handleCategoryChange}
        collectionId={filterCollectionId}
        onCollectionChange={handleCollectionChange}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        categories={categories}
        collections={collections}
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mt-4">
        {error && (
          <div className="px-6 py-4 text-sm text-red-600 bg-red-50 border-b border-red-100 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                    checked={allCurrentPageSelected}
                    ref={(el) => { if (el) el.indeterminate = someCurrentPageSelected; }}
                    onChange={toggleAllCurrentPage}
                    disabled={displayedProducts.length === 0 || loading}
                    title={allCurrentPageSelected ? "Deselect all on this page" : "Select all on this page"}
                  />
                </th>
                {["Product", "Category", "Gender", "Price", "Variants", "Status", "Created"].map((h) => (
                  <th key={h} className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && productFilter !== "Added" ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={8} className="px-6 py-4">
                      <div className="h-10 bg-slate-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : displayedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <span className="material-symbols-outlined text-4xl">inventory_2</span>
                      <p className="text-sm font-medium">No products found</p>
                      <p className="text-xs">Try adjusting your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/30 transition-all duration-200 group">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                        checked={selectedProductsMap.has(p.id)}
                        onChange={() => toggleProduct(p)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="size-11 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center group-hover:border-primary/20 transition-colors overflow-hidden">
                          {p.primaryImage ? (
                            <img src={p.primaryImage} alt={p.name} className="size-full object-cover rounded-xl" />
                          ) : (
                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary/40">inventory_2</span>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-bold text-slate-900">{p.name}</p>
                          {p.sku && <p className="text-[11px] text-slate-400 font-medium">SKU: {p.sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-600">{p.category?.name ?? "—"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 capitalize">
                        {p.gender && p.gender.length > 0 ? p.gender.join(", ").toLowerCase() : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900 font-mono tracking-tight">{formatPrice(p.price)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {p.availableColors && p.availableColors.length > 0 ? (
                          p.availableColors.slice(0, 3).map((c, i) => (
                            <div
                              key={i}
                              className="size-4 rounded-full border border-slate-200"
                              style={{ backgroundColor: c.colorValue }}
                              title={c.colorName}
                            />
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">No variants</span>
                        )}
                        {p.availableColors && p.availableColors.length > 3 && (
                          <span className="text-[10px] font-bold text-slate-400">+{p.availableColors.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.isPublished ? "Active" : "Draft"} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 font-medium whitespace-nowrap">{formatDate(p.createdAt)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {productFilter !== "Added" && (
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
            showingText={meta.total > 0 ? `Showing ${from}–${to} of ${meta.total} products` : "No products"}
          />
        )}
      </div>
    </PageWrapper>
  );
}
