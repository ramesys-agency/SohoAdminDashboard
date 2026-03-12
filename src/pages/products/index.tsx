import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Pagination from "../../components/ui/Pagination";
import StatusBadge from "../../components/ui/StatusBadge";
import ProductFilters from "./components/ProductFilters";
import { getProducts, deleteProduct, type ApiProduct } from "../../api/products";
import { getCollections, type Collection } from "../../api/collections";
import { getParentCategories } from "../../api/categories";

interface ParentCategory {
  id: string;
  name: string;
}

const LIMIT = 20;

export default function Products() {
  const navigate = useNavigate();

  // Filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [gender, setGender] = useState("");
  const [isPublished, setIsPublished] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);

  // Data state
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: LIMIT,
    totalPages: 1,
  });
  const [categories, setCategories] = useState<ParentCategory[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  }, []);

  // Reset page when filters change
  const handleGenderChange = (v: string) => {
    setGender(v);
    setPage(1);
  };
  const handleIsPublishedChange = (v: string) => {
    setIsPublished(v);
    setPage(1);
  };
  const handleCategoryChange = (v: string) => {
    setCategoryId(v);
    setPage(1);
  };
  const handleCollectionChange = (v: string) => {
    setCollectionId(v);
    setPage(1);
  };
  const handleSortByChange = (v: string) => {
    setSortBy(v);
    setPage(1);
  };

  // Fetch categories & collections once on mount
  useEffect(() => {
    getParentCategories()
      .then((res) => setCategories(res?.data ?? []))
      .catch(() => {});

    getCollections(1, 100)
      .then((res) => setCollections(res?.data ?? []))
      .catch(() => {});
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    setLoading(true);
    setError(null);

    const params: Record<string, string | number | boolean> = {
      page,
      limit: LIMIT,
    };
    if (debouncedSearch) params.search = debouncedSearch;
    if (gender) params.gender = gender;
    if (isPublished !== "") params.isPublished = isPublished === "true";
    if (categoryId) params.categoryId = categoryId;
    if (collectionId) params.collectionId = collectionId;
    if (sortBy) params.sortBy = sortBy;

    getProducts(params)
      .then((res) => {
        // eslint-disable-next-line no-console
        console.log("[Products API raw response]", res);

        // Handle various possible response shapes from the server
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyRes = res as any;

        const products: ApiProduct[] =
          Array.isArray(anyRes.data)
            ? anyRes.data
            : Array.isArray(anyRes.products)
              ? anyRes.products
              : Array.isArray(anyRes.items)
                ? anyRes.items
                : Array.isArray(anyRes)
                  ? anyRes
                  : [];

        const meta =
          anyRes.meta ??
          anyRes.pagination ??
          anyRes.pageMeta ?? {
            total: products.length,
            page: 1,
            limit: LIMIT,
            totalPages: 1,
          };

        setProducts(products);
        setMeta(meta);
      })
      .catch(() => setError("Failed to load products. Please try again."))
      .finally(() => setLoading(false));
  }, [
    page,
    debouncedSearch,
    gender,
    isPublished,
    categoryId,
    collectionId,
    sortBy,
  ]);

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteProduct(id);
      // Remove product from list
      setProducts(products.filter((p) => p.id !== id));
      setMeta({ ...meta, total: meta.total - 1 });
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const from = (page - 1) * LIMIT + 1;
  const to = Math.min(page * LIMIT, meta.total);

  return (
    <PageWrapper>
      <PageHeader
        title="Products"
        description="View and manage your store inventory."
        actions={
          <Button
            onClick={() => navigate("/products/create")}
            leftIcon={
              <span className="material-symbols-outlined text-xl">add</span>
            }
          >
            Add Product
          </Button>
        }
      />

      <ProductFilters
        search={search}
        onSearchChange={handleSearchChange}
        gender={gender}
        onGenderChange={handleGenderChange}
        isPublished={isPublished}
        onIsPublishedChange={handleIsPublishedChange}
        categoryId={categoryId}
        onCategoryChange={handleCategoryChange}
        collectionId={collectionId}
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
                {[
                  "Product",
                  "Category",
                  "Gender",
                  "Price",
                  "Variants",
                  "Status",
                  "Created",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider ${
                      h === "Actions" ? "text-right" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="size-11 rounded-xl bg-slate-100" />
                        <div className="flex flex-col gap-1.5">
                          <div className="h-3 w-36 rounded bg-slate-100" />
                          <div className="h-2.5 w-20 rounded bg-slate-100" />
                        </div>
                      </div>
                    </td>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-3 w-20 rounded bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <span className="material-symbols-outlined text-4xl">
                        inventory_2
                      </span>
                      <p className="text-sm font-medium">No products found</p>
                      <p className="text-xs">
                        Try adjusting your filters or add a new product.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/30 transition-all duration-200 group"
                  >
                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="size-11 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center group-hover:border-[#1325ec]/20 transition-colors overflow-hidden">
                          {p.primaryImage ? (
                            <img
                              src={p.primaryImage}
                              alt={p.name}
                              className="size-full object-cover rounded-xl"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-slate-300 group-hover:text-[#1325ec]/40">
                              inventory_2
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p
                            className="text-sm font-bold text-slate-900 cursor-pointer hover:text-[#1325ec] transition-colors"
                            onClick={() => navigate(`/products/${p.id}`)}
                          >
                            {p.name}
                          </p>
                          {p.sku && (
                            <p className="text-[11px] text-slate-400 font-medium">
                              SKU: {p.sku}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-600">
                        {p.category?.name ?? "—"}
                      </span>
                    </td>

                    {/* Gender */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 capitalize">
                        {p.gender && p.gender.length > 0
                          ? p.gender.join(", ").toLowerCase()
                          : "—"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900 font-mono tracking-tight">
                        {formatPrice(p.price)}
                      </span>
                    </td>

                    {/* Variants */}
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
                          <span className="text-[10px] font-bold text-slate-400">
                            +{p.availableColors.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={p.isPublished ? "Active" : "Draft"}
                      />
                    </td>

                    {/* Created */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500 font-medium whitespace-nowrap">
                        {formatDate(p.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/products/view/${p.id}`)}
                          title="View"
                        >
                          <span className="material-symbols-outlined text-lg">
                            visibility
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/products/edit/${p.id}`)}
                          className="hover:text-[#1325ec] hover:bg-[#1325ec]/5"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-lg">
                            edit
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="hover:text-red-500 hover:bg-red-50"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          showingText={
            meta.total > 0
              ? `Showing ${from}–${to} of ${meta.total} products`
              : "No products"
          }
        />
      </div>
    </PageWrapper>
  );
}
