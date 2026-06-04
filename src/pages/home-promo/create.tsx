import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { getCollections } from "../../api/collections";
import { getProducts } from "../../api/products";
import { createHomePromo, getHomePromoById, updateHomePromo } from "../../api/homePromo";

export default function CreateOrEditHomePromo() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Core Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<"PRODUCT" | "COLLECTION">("COLLECTION");
  const [productId, setProductId] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Search/Dropdown States
  const [collectionSearch, setCollectionSearch] = useState("");
  const [collectionDropdownOpen, setCollectionDropdownOpen] = useState(false);
  const collectionDropdownRef = useRef<HTMLDivElement>(null);

  const [productSearch, setProductSearch] = useState("");
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const productDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (collectionDropdownRef.current && !collectionDropdownRef.current.contains(e.target as Node)) {
        setCollectionDropdownOpen(false);
      }
      if (productDropdownRef.current && !productDropdownRef.current.contains(e.target as Node)) {
        setProductDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch Promo Details if Edit
  const { data: promoData, isLoading: isLoadingPromo } = useQuery({
    queryKey: ["home-promo", id],
    queryFn: () => getHomePromoById(id!),
    enabled: isEdit && Boolean(id),
  });

  // Populate data when details load
  useEffect(() => {
    if (promoData?.data) {
      const p = promoData.data;
      setTitle(p.title);
      setDescription(p.description);
      setContentType(p.contentType);
      setProductId(p.productId || "");
      setCollectionId(p.collectionId || "");
      setIsActive(p.isActive);
      setImageUrl(p.imageUrl || "");
    }
  }, [promoData]);

  // Fetch Collections
  const { data: collectionsRes, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["collections-dropdown"],
    queryFn: () => getCollections(1, 100),
    enabled: contentType === "COLLECTION",
  });
  const collections = collectionsRes?.data || [];

  // Fetch Products
  const { data: productsRes, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products-dropdown", productSearch],
    queryFn: () => getProducts({ search: productSearch, limit: 100 }),
    enabled: contentType === "PRODUCT",
  });
  const products: any[] = Array.isArray((productsRes as any)?.data)
    ? (productsRes as any).data
    : Array.isArray((productsRes as any)?.products)
      ? (productsRes as any).products
      : Array.isArray((productsRes as any)?.items)
        ? (productsRes as any).items
        : Array.isArray(productsRes)
          ? productsRes
          : [];

  // Image Upload Handler (for frontend preview)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImageFile(file);
    }
  };

  const createMutation = useMutation({
    mutationFn: createHomePromo,
    onSuccess: (res) => {
      toast.success(res.message || "Homepage Promo created successfully!");
      queryClient.invalidateQueries({ queryKey: ["home-promos"] });
      navigate("/home-promo");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create Homepage Promo");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ pId, payload }: { pId: string; payload: any }) => updateHomePromo(pId, payload),
    onSuccess: (res) => {
      toast.success(res.message || "Homepage Promo updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["home-promos"] });
      queryClient.invalidateQueries({ queryKey: ["home-promo", id] });
      navigate("/home-promo");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update Homepage Promo");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (contentType === "COLLECTION" && !collectionId) {
      toast.error("Please select a target collection");
      return;
    }
    if (contentType === "PRODUCT" && !productId) {
      toast.error("Please select a target product");
      return;
    }
    if (!imageUrl && !imageFile) {
      toast.error("Please upload a promo image");
      return;
    }

    const payload = {
      title,
      description,
      contentType,
      productId: contentType === "PRODUCT" ? productId : null,
      collectionId: contentType === "COLLECTION" ? collectionId : null,
      image: imageFile || imageUrl || null,
      isActive,
    };

    if (isEdit && id) {
      updateMutation.mutate({ pId: id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isLoadingPromo) {
    return (
      <PageWrapper>
        <div className="p-8 text-center text-slate-500">Loading Promotion details...</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title={isEdit ? "Edit Homepage Promo" : "Create Homepage Promo"}
        description={
          <Button onClick={() => navigate("/home-promo")} variant="ghost" size="sm">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Promotions
          </Button>
        }
        actions={
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/home-promo")}
              className="bg-white! text-slate-700! border border-slate-200 hover:bg-slate-50!"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Update Promotion" : "Save Promotion"}
            </Button>
          </div>
        }
      />

      <div className="mt-6 max-w-3xl bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Women Fashionable Top"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a promotional description..."
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>

          {/* Redirect Content Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Redirect Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
                <input
                  type="radio"
                  name="contentType"
                  value="COLLECTION"
                  checked={contentType === "COLLECTION"}
                  onChange={() => {
                    setContentType("COLLECTION");
                    setProductId("");
                  }}
                  className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                />
                Collection
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 font-medium cursor-pointer">
                <input
                  type="radio"
                  name="contentType"
                  value="PRODUCT"
                  checked={contentType === "PRODUCT"}
                  onChange={() => {
                    setContentType("PRODUCT");
                    setCollectionId("");
                  }}
                  className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                />
                Product
              </label>
            </div>
          </div>

          {/* Collection Select */}
          {contentType === "COLLECTION" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Target Collection <span className="text-red-500">*</span>
              </label>
              <div ref={collectionDropdownRef} className="relative">
                <button
                  type="button"
                  disabled={isLoadingCollections}
                  onClick={() => setCollectionDropdownOpen((v) => !v)}
                  className="w-full flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-slate-50 disabled:text-slate-400 text-left"
                >
                  <span className={collectionId ? "text-slate-900" : "text-slate-400"}>
                    {isLoadingCollections
                      ? "Loading collections..."
                      : collectionId
                      ? collections.find((c) => c.id === collectionId)?.name || "-- Choose a Collection --"
                      : "-- Choose a Collection --"}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-400">
                    {collectionDropdownOpen ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {collectionDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
                      <input
                        type="text"
                        autoFocus
                        value={collectionSearch}
                        onChange={(e) => setCollectionSearch(e.target.value)}
                        placeholder="Search collections..."
                        className="flex-1 text-sm outline-none placeholder:text-slate-400"
                      />
                    </div>
                    <ul className="max-h-52 overflow-y-auto py-1">
                      {collections
                        .filter((c) => c.name.toLowerCase().includes(collectionSearch.toLowerCase()))
                        .map((c) => (
                          <li key={c.id}>
                            <button
                              type="button"
                              onClick={() => {
                                setCollectionId(c.id);
                                setCollectionDropdownOpen(false);
                                setCollectionSearch("");
                              }}
                              className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 ${
                                collectionId === c.id ? "text-primary font-semibold bg-primary/5" : "text-slate-700"
                              }`}
                            >
                              {collectionId === c.id && (
                                <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                              )}
                              <span className={collectionId === c.id ? "" : "ml-[22px]"}>{c.name}</span>
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product Select */}
          {contentType === "PRODUCT" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Target Product <span className="text-red-500">*</span>
              </label>
              <div ref={productDropdownRef} className="relative">
                <button
                  type="button"
                  disabled={isLoadingProducts}
                  onClick={() => setProductDropdownOpen((v) => !v)}
                  className="w-full flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-slate-50 disabled:text-slate-400 text-left"
                >
                  <span className={productId ? "text-slate-900" : "text-slate-400"}>
                    {productId
                      ? products.find((p: any) => p.id === productId)?.name ||
                        promoData?.data?.product?.name ||
                        "-- Choose a Product --"
                      : "-- Choose a Product --"}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-400">
                    {productDropdownOpen ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {productDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
                      <input
                        type="text"
                        autoFocus
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Type to search products..."
                        className="flex-1 text-sm outline-none placeholder:text-slate-400"
                      />
                    </div>
                    <ul className="max-h-52 overflow-y-auto py-1">
                      {products.map((p: any) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setProductId(p.id);
                              setProductDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center gap-2 ${
                              productId === p.id ? "text-primary font-semibold bg-primary/5" : "text-slate-700"
                            }`}
                          >
                            {productId === p.id && (
                              <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                            )}
                            <span className={productId === p.id ? "" : "ml-[22px]"}>{p.name}</span>
                          </button>
                        </li>
                      ))}
                      {products.length === 0 && (
                        <li className="px-3 py-3 text-sm text-slate-400 text-center">
                          Type above to find products
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
              Active on Homepage
            </label>
          </div>

          {/* Image upload */}
          <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
            <label className="text-sm font-semibold text-slate-700">Promo Image</label>
            <div className="flex items-center gap-4">
              <label className="size-32 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors cursor-pointer bg-slate-50 group flex-shrink-0 overflow-hidden relative">
                {imageUrl ? (
                  <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">
                    add_photo_alternate
                  </span>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-semibold text-slate-700">Upload Image</p>
                <p className="text-[10px] text-slate-400 font-medium">
                  Select an image that highlights this collection/product on the homepage.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
