import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import { getProducts } from "../../api/products";
import { getCollections } from "../../api/collections";
import { getHomePromo, updateHomePromo } from "../../api/homePromo";
import type { HomePromoPayload } from "../../api/homePromo";

export default function HomePromoPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<"PRODUCT" | "COLLECTION">("COLLECTION");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch current Home Promo config
  const { data: configData, isLoading: isLoadingConfig } = useQuery({
    queryKey: ["home-promo"],
    queryFn: getHomePromo,
  });

  // Fetch products list
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["all-products-list"],
    queryFn: () => getProducts({ limit: 100 }),
  });

  // Fetch collections list
  const { data: collectionsData, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["all-collections-list"],
    queryFn: () => getCollections(1, 100),
  });

  // Set form state when data is loaded
  useEffect(() => {
    if (configData?.success && configData.data) {
      const config = configData.data;
      setTitle(config.title || "");
      setDescription(config.description || "");
      setContentType(config.contentType || "COLLECTION");
      setSelectedProductId(config.productId || "");
      setSelectedCollectionId(config.collectionId || "");
      setIsActive(config.isActive !== false);
      setImageUrl(config.imageUrl || "");
    }
  }, [configData]);

  // Handle local image file selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImageFile(file);
    }
  };

  // Mutator for updating the settings
  const mutation = useMutation({
    mutationFn: (payload: HomePromoPayload) => updateHomePromo(payload),
    onSuccess: () => {
      toast.success("Homepage Promo section updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["home-promo"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update configuration.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (contentType === "PRODUCT" && !selectedProductId) {
      toast.error("Please select a product");
      return;
    }
    if (contentType === "COLLECTION" && !selectedCollectionId) {
      toast.error("Please select a collection");
      return;
    }

    mutation.mutate({
      title,
      description,
      contentType,
      productId: contentType === "PRODUCT" ? selectedProductId : null,
      collectionId: contentType === "COLLECTION" ? selectedCollectionId : null,
      image: imageFile,
      isActive,
    });
  };

  const selectedProduct = productsData?.data?.find(p => p.id === selectedProductId);
  const selectedCollection = collectionsData?.data?.find(c => c.id === selectedCollectionId);

  const previewImage = imageUrl || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop";

  const isLoading = isLoadingConfig || isLoadingProducts || isLoadingCollections;

  return (
    <PageWrapper>
      <PageHeader
        title="Homepage Promo Section"
        description="Configure the dynamic interactive promo section displayed directly below the Best Sellers list on the homepage."
      />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary">
              sync
            </span>
            <p className="text-slate-500 text-sm font-semibold">Loading data...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
          {/* Settings Form - 3 cols */}
          <div className="xl:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">tune</span>
                Section Configuration
              </h3>

              {/* Title & Description */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Section Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sustainable Summer Collection"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    Section Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a compelling description for this section."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Content Type Selector */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 block">
                  Link Target Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setContentType("COLLECTION")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm transition-all ${
                      contentType === "COLLECTION"
                        ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                        : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">layers</span>
                    Collection
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType("PRODUCT")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-sm transition-all ${
                      contentType === "PRODUCT"
                        ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                        : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">shopping_bag</span>
                    Product
                  </button>
                </div>
              </div>

              {/* Dynamic Target Selection Dropdown */}
              {contentType === "COLLECTION" ? (
                <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="text-sm font-bold text-slate-700">
                    Select Collection <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCollectionId}
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white transition-all"
                  >
                    <option value="">-- Choose a Collection --</option>
                    {collectionsData?.data?.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name} ({col.slug})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="text-sm font-bold text-slate-700">
                    Select Product <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none bg-white transition-all"
                  >
                    <option value="">-- Choose a Product --</option>
                    {productsData?.data?.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} (Price: ৳{prod.price})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Banner Image Upload */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <label className="text-sm font-bold text-slate-700">
                  Custom Banner Image <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="size-24 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 hover:border-primary transition-all cursor-pointer bg-slate-50 group flex-shrink-0 overflow-hidden relative shadow-sm">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-2xl">
                        add_photo_alternate
                      </span>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-bold text-slate-700">
                      Upload Custom Banner Image
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                      Recommended size: 800x1000px (Vertical Layout) or 1200x630px.
                      If not provided, the selected product or collection first image will be used.
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Section Status</h4>
                  <p className="text-xs text-slate-500">Show or hide this section in the mobile application.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  fullWidth
                  isLoading={mutation.isPending}
                  leftIcon={
                    <span className="material-symbols-outlined text-lg">save</span>
                  }
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Visual Live Mobile Preview - 2 cols */}
          <div className="xl:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
              Live App Homepage Preview
            </h4>
            <div className="bg-slate-900 rounded-[40px] p-4 shadow-xl border-4 border-slate-800 max-w-sm mx-auto overflow-hidden relative">
              {/* Phone Speaker & Camera Bar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-900 w-36 h-5 rounded-b-xl z-20 flex items-center justify-center gap-1.5">
                <div className="w-12 h-1 bg-slate-700 rounded-full" />
                <div className="w-2.5 h-2.5 bg-slate-700 rounded-full" />
              </div>

              {/* Screen Content Wrapper */}
              <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 flex flex-col h-[640px] select-none text-slate-800 font-sans">
                {/* App Status Bar spacer */}
                <div className="h-6 bg-white w-full shrink-0" />

                {/* Simulated Top Navigation Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-50 shrink-0">
                  <span className="material-symbols-outlined text-[20px]">menu</span>
                  <span className="font-bold tracking-widest text-[15px]" style={{ fontFamily: "serif" }}>SOHO</span>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                    <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  </div>
                </div>

                {/* Simulated Scrollable Homepage */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5 scrollbar-thin">
                  {/* Faded Top Slider Banner */}
                  <div className="h-28 bg-slate-100 rounded-xl flex items-center justify-center opacity-60 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200/50 to-transparent" />
                    <p className="text-slate-400 text-xs font-bold tracking-wider">HERO SLIDER BANNER</p>
                  </div>

                  {/* Best Sellers Header */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-slate-800 tracking-wide">Best Sellers</h4>
                      <span className="text-[10px] text-primary font-bold">See All</span>
                    </div>
                    {/* Horizontal scroll items */}
                    <div className="flex gap-3 overflow-x-hidden">
                      <div className="w-1/2 bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <div className="aspect-square bg-slate-200 rounded-md mb-1.5" />
                        <div className="h-3 w-3/4 bg-slate-300 rounded mb-1" />
                        <div className="h-3 w-1/2 bg-slate-200 rounded" />
                      </div>
                      <div className="w-1/2 bg-slate-50 rounded-lg p-2 border border-slate-100">
                        <div className="aspect-square bg-slate-200 rounded-md mb-1.5" />
                        <div className="h-3 w-3/4 bg-slate-300 rounded mb-1" />
                        <div className="h-3 w-1/2 bg-slate-200 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* THE CUSTOMIZABLE SECTION BELOW BEST SELLER */}
                  {isActive ? (
                    <div className="border-t border-slate-100 pt-5 animate-in fade-in zoom-in-95 duration-300">
                      <div className="rounded-xl overflow-hidden shadow-sm border border-slate-100 relative bg-white">
                        {/* Custom Banner Image */}
                        <div className="h-64 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          {/* Banner Floating Badge showing Target */}
                          <div className="absolute top-3 left-3 bg-black/75 px-3 py-1 rounded-full text-[9px] text-white font-bold tracking-wider uppercase flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">link</span>
                            {contentType === "COLLECTION" 
                              ? `Collection: ${selectedCollection?.name || "None Selected"}`
                              : `Product: ${selectedProduct?.name || "None Selected"}`
                            }
                          </div>
                        </div>

                        {/* Title and Description */}
                        <div className="p-4 bg-white border-t border-slate-50">
                          <h4 
                            className="text-lg text-slate-900 leading-snug font-semibold"
                            style={{ fontFamily: "serif" }}
                          >
                            {title || "Featured Title"}
                          </h4>
                          <p className="text-slate-500 text-[11px] leading-relaxed mt-1 font-medium">
                            {description || "Section description will appear here on your live mobile application store home screen."}
                          </p>
                          <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-800 group cursor-pointer border-t border-slate-50 pt-2.5">
                            <span>SHOP THE LOOK</span>
                            <span className="material-symbols-outlined text-[14px] text-primary transition-transform group-hover:translate-x-0.5">
                              arrow_forward_ios
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-slate-100 pt-4 flex flex-col items-center justify-center py-6 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      <span className="material-symbols-outlined text-lg mb-1">visibility_off</span>
                      <p className="text-[10px] font-bold uppercase tracking-wider">Dynamic Section Hidden</p>
                      <p className="text-[9px] max-w-[200px] mt-0.5">Toggle 'Active' status to display this section below Best Sellers.</p>
                    </div>
                  )}

                  {/* Faded Lower Content */}
                  <div className="h-16 bg-slate-50 rounded-xl opacity-40 flex items-center justify-center">
                    <p className="text-slate-300 text-[10px] font-bold">ADDITIONAL FOOTER ROWS</p>
                  </div>
                </div>

                {/* Simulated Bottom Navigation Spacer */}
                <div className="h-14 bg-slate-950 flex items-center justify-around text-slate-500 shrink-0">
                  <span className="material-symbols-outlined text-primary text-[20px]">home</span>
                  <span className="material-symbols-outlined text-[20px]">category</span>
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
