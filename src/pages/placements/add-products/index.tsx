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
  reorderPlacementProducts,
  resetPlacementProducts,
  type ProductOrigin,
} from "../../../api/placements";
import { getParentCategories } from "../../../api/categories";
import { useDragReorder } from "../../../hooks/useDragReorder";

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
  /** The running order shown in the app — dragged in the Added tab. */
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [initialOrder, setInitialOrder] = useState<string[]>([]);
  /** "auto" products come from the source category; "added" were pinned. */
  const [originById, setOriginById] = useState<Map<string, ProductOrigin>>(new Map());
  const [sourceCategoryId, setSourceCategoryId] = useState<string | null>(null);

  const isCategorySourced = Boolean(sourceCategoryId);

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

  // Fetch the placement's *resolved* list — for a category-sourced placement
  // that is the category's products with the admin's overrides applied, not a
  // stored list.
  const loadPlacement = useCallback(() => {
    if (!id) return;
    getPlacementById(id)
      .then((res) => {
        const placement = res.data;
        if (placement.name) {
          setPlacementName(placement.name);
        }
        setSourceCategoryId(placement.sourceCategoryId ?? null);

        const newMap = new Map<string, ApiProduct>();
        const initialSet = new Set<string>();
        const origins = new Map<string, ProductOrigin>();
        const order: string[] = [];

        placement.products?.forEach((pp) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          newMap.set(pp.productId, pp.product as any);
          initialSet.add(pp.productId);
          origins.set(pp.productId, pp.origin ?? "added");
          order.push(pp.productId);
        });

        setSelectedProductsMap(newMap);
        setInitialSelectedIds(initialSet);
        setOriginById(origins);
        setOrderedIds(order);
        setInitialOrder(order);
      })
      .catch(console.error);
  }, [id]);

  useEffect(loadPlacement, [loadPlacement]);

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

    setOrderedIds((prev) =>
      prev.includes(product.id) ? prev.filter((pid) => pid !== product.id) : [...prev, product.id],
    );
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      const currentSelectedIds = Array.from(selectedProductsMap.keys());
      const toAdd = currentSelectedIds.filter((pid) => !initialSelectedIds.has(pid));
      const toRemove = Array.from(initialSelectedIds).filter((pid) => !selectedProductsMap.has(pid));

      if (toAdd.length > 0) await addProductsToPlacement(id, toAdd);
      if (toRemove.length > 0) await removeProductsFromPlacement(id, toRemove);

      // Order is persisted last so it covers whatever the list ended up being.
      const nextOrder = orderedIds.filter((pid) => selectedProductsMap.has(pid));
      if (nextOrder.length > 0 && nextOrder.join() !== initialOrder.join()) {
        await reorderPlacementProducts(id, nextOrder);
      }

      toast.success("Products saved to placement successfully.");
      navigate("/placements");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(e?.response?.data?.message || e?.message || "Failed to save products.");
    }
  };

  /// Throws away every manual add, removal and position for this placement.
  const handleResetToCategory = async () => {
    if (!id) return;
    const confirmed = window.confirm(
      "Reset this list to exactly what the category holds? Every product you added or removed by hand here, and the order you set, will be discarded.",
    );
    if (!confirmed) return;

    try {
      await resetPlacementProducts(id);
      loadPlacement();
      toast.success("List reset to the category's products.");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(e?.response?.data?.message || e?.message || "Failed to reset the list.");
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

  // The Added tab is the running order the app renders, so it follows
  // orderedIds rather than whatever the map happens to iterate as.
  let displayedProducts = products;
  if (productFilter === "Added") {
    displayedProducts = orderedIds
      .map((pid) => selectedProductsMap.get(pid))
      .filter((p): p is ApiProduct => Boolean(p));
  } else if (productFilter === "Not Added") {
    displayedProducts = products.filter((p) => !selectedProductsMap.has(p.id));
  }

  const isOrderable = productFilter === "Added";

  const { dragProps, dropIndicatorClass } = useDragReorder(displayedProducts, (ordered) =>
    setOrderedIds(ordered.map((p) => p.id)),
  );

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
            {isCategorySourced && (
              <Button variant="outline" onClick={handleResetToCategory}>
                Reset to category
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate("/placements")}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </>
        }
      />

      {isCategorySourced && (
        <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50/60 p-3 text-xs text-sky-900 flex items-start gap-2">
          <span className="material-symbols-outlined text-base text-sky-600">category</span>
          <p className="leading-relaxed">
            This list is built from its category automatically — products added to that category
            later appear here on their own. Unticking an <strong>Auto</strong> product hides it from
            this placement only; ticking one from elsewhere pins it as <strong>Added</strong> so it
            stays even if it is recategorised. Open the <strong>Added</strong> tab to drag the
            running order.
          </p>
        </div>
      )}

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
                displayedProducts.map((p, index) => (
                  <tr
                    key={p.id}
                    {...(isOrderable ? dragProps(index) : {})}
                    className={`hover:bg-slate-50/30 transition-all duration-200 group ${
                      isOrderable ? `cursor-grab active:cursor-grabbing ${dropIndicatorClass(index)}` : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isOrderable && (
                          <span
                            className="material-symbols-outlined text-[16px] text-slate-300 group-hover:text-slate-500"
                            title="Drag to reorder"
                          >
                            drag_indicator
                          </span>
                        )}
                        <input
                          type="checkbox"
                          className="size-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                          checked={selectedProductsMap.has(p.id)}
                          onChange={() => toggleProduct(p)}
                        />
                      </div>
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
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900">{p.name}</p>
                            {/* Why this product is here, and so what removing
                                it will actually do. */}
                            {isCategorySourced && selectedProductsMap.has(p.id) && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  originById.get(p.id) === "added"
                                    ? "bg-violet-100 text-violet-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                                title={
                                  originById.get(p.id) === "added"
                                    ? "Pinned by hand — stays even if it leaves the category"
                                    : "Comes from the category — unticking hides it here only"
                                }
                              >
                                {originById.get(p.id) === "added" ? "Added" : "Auto"}
                              </span>
                            )}
                          </div>
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
