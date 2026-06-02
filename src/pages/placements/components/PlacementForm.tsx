import React, { useEffect, useMemo, useRef } from "react";
import {
  AppPage,
  PageSection,
  PAGE_SECTION_MAP,
  PAGE_DISPLAY_LABEL,
  SECTION_PREVIEW_MAP,
  isBannerSection,
  SECTION_GUIDANCE_MAP,
} from "../types";

type CollectionMode = "new" | "existing";

interface PlacementFormProps {
  collectionMode: CollectionMode;
  collectionId: string;
  setCollectionId: (id: string) => void;
  pageName: string;
  setPageName: (name: string) => void;
  sectionName: string;
  setSectionName: (name: string) => void;
  setIsBanner: (isBanner: boolean) => void;
  isActive: boolean;
  setIsActive: (v: boolean) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  setImageFile: (file: File | null) => void;
  collections?: { id: string; name: string }[];
  isLoadingCollections?: boolean;
}

export default function PlacementForm({
  collectionMode,
  collectionId,
  setCollectionId,
  pageName,
  setPageName,
  sectionName,
  setSectionName,
  setIsBanner,
  isActive,
  setIsActive,
  imageUrl,
  setImageUrl,
  setImageFile,
  collections = [],
  isLoadingCollections = false,
}: PlacementFormProps) {
  const [showPreview, setShowPreview] = React.useState(false);
  const [collectionSearch, setCollectionSearch] = React.useState("");
  const [collectionDropdownOpen, setCollectionDropdownOpen] = React.useState(false);
  const collectionDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (collectionDropdownRef.current && !collectionDropdownRef.current.contains(e.target as Node)) {
        setCollectionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Derive available sections based on selected page (memoized)
  const availableSections = useMemo(() => {
    return pageName ? PAGE_SECTION_MAP[pageName as AppPage] || [] : [];
  }, [pageName]);

  // Auto-derive isBanner from section and notify parent
  const autoBanner = isBannerSection(sectionName);
  useEffect(() => {
    setIsBanner(autoBanner);
  }, [autoBanner, setIsBanner]);

  // Reset section if page changes and current section is not in the new available list
  useEffect(() => {
    if (pageName && !availableSections.includes(sectionName as PageSection)) {
      setSectionName(availableSections.length > 0 ? availableSections[0] : "");
    } else if (!pageName) {
      setSectionName("");
    }
  }, [pageName, availableSections, sectionName, setSectionName]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImageFile(file);
    }
  };

  return (
    <div className="xl:col-span-2 space-y-6">
      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold mb-4 text-slate-900">
          Placement Configuration
        </h3>
        <div className="space-y-4">
          {/* Collection selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              {collectionMode === "new"
                ? "New Collection Name"
                : "Select Collection"}{" "}
              <span className="text-red-500">*</span>
            </label>
            {collectionMode === "new" ? (
              <input
                type="text"
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                placeholder="e.g. Summer Sale 2025"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            ) : (
              <div ref={collectionDropdownRef} className="relative">
                {/* Trigger button */}
                <button
                  type="button"
                  disabled={isLoadingCollections}
                  onClick={() => {
                    setCollectionDropdownOpen((v) => !v);
                    setCollectionSearch("");
                  }}
                  className="w-full flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-slate-50 disabled:text-slate-400 text-left"
                >
                  <span className={collectionId ? "text-slate-900" : "text-slate-400"}>
                    {isLoadingCollections
                      ? "Loading..."
                      : collectionId
                        ? (collections.find((c) => c.id === collectionId)?.name ?? "-- Choose a Collection --")
                        : "-- Choose a Collection --"}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-400 flex-shrink-0">
                    {collectionDropdownOpen ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {/* Dropdown panel */}
                {collectionDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                    {/* Search input */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
                      <span className="material-symbols-outlined text-[18px] text-slate-400 flex-shrink-0">search</span>
                      <input
                        type="text"
                        autoFocus
                        value={collectionSearch}
                        onChange={(e) => setCollectionSearch(e.target.value)}
                        placeholder="Search collections..."
                        className="flex-1 text-sm outline-none placeholder:text-slate-400"
                      />
                      {collectionSearch && (
                        <button
                          type="button"
                          onClick={() => setCollectionSearch("")}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      )}
                    </div>

                    {/* Options list */}
                    <ul className="max-h-52 overflow-y-auto py-1">
                      {collections
                        .filter((c) =>
                          c.name.toLowerCase().includes(collectionSearch.toLowerCase())
                        )
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
                                <span className="material-symbols-outlined text-[16px] text-primary flex-shrink-0">check</span>
                              )}
                              <span className={collectionId === c.id ? "" : "ml-[22px]"}>{c.name}</span>
                            </button>
                          </li>
                        ))}
                      {collections.filter((c) =>
                        c.name.toLowerCase().includes(collectionSearch.toLowerCase())
                      ).length === 0 && (
                        <li className="px-3 py-3 text-sm text-slate-400 text-center">
                          No collections found
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Page + Section selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Target App Page <span className="text-red-500">*</span>
              </label>
              <select
                value={pageName}
                onChange={(e) => {
                  setPageName(e.target.value);
                  setShowPreview(false);
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">-- Choose a Page --</option>
                {Object.values(AppPage).map((p) => (
                  <option key={p} value={p}>
                    {PAGE_DISPLAY_LABEL[p as AppPage]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Page Section{" "}
                  {availableSections.length > 0 && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                {sectionName &&
                  SECTION_PREVIEW_MAP[sectionName as PageSection] && (
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 text-xs"
                      title="Toggle Layout Preview"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {showPreview ? "visibility_off" : "visibility"}
                      </span>
                      {showPreview ? "Hide" : "View"}
                    </button>
                  )}
              </div>
              <select
                value={sectionName}
                onChange={(e) => {
                  setSectionName(e.target.value);
                  setShowPreview(false);
                }}
                disabled={!pageName || availableSections.length === 0}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none disabled:bg-slate-50 disabled:text-slate-400"
              >
                {availableSections.length === 0 ? (
                  <option value="">No sections available</option>
                ) : (
                  <>
                    <option value="">-- Choose a Section --</option>
                    {availableSections.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </>
                )}
              </select>

              {sectionName && SECTION_GUIDANCE_MAP[sectionName as PageSection] && (
                <p className="mt-1.5 text-xs text-indigo-600 font-semibold bg-indigo-50/50 p-2 rounded border border-indigo-100 leading-normal">
                  💡 {SECTION_GUIDANCE_MAP[sectionName as PageSection]}
                </p>
              )}

              {/* Section Preview Helper */}
              {showPreview &&
                sectionName &&
                SECTION_PREVIEW_MAP[sectionName as PageSection] && (
                  <div className="mt-2 text-center text-slate-500 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                    Section Layout Reference
                    <img
                      src={SECTION_PREVIEW_MAP[sectionName as PageSection]}
                      alt="Section Preview"
                      className="mt-1 w-full rounded border border-slate-200 shadow-sm"
                    />
                  </div>
                )}
            </div>
          </div>

          {/* Auto-banner indicator — shown once a section is selected */}
          {sectionName && (
            <div className="flex items-center gap-2 pt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  autoBanner
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {autoBanner ? "panorama_wide_angle" : "crop_portrait"}
                </span>
                {autoBanner ? "Banner (Landscape)" : "Not a Banner (Portrait)"}
              </span>
              <span className="text-xs text-slate-400">
                Auto-determined by section
              </span>
            </div>
          )}

          {/* Active toggle */}
          <div className="flex items-center gap-2 pt-1 pb-1">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-semibold text-slate-700 cursor-pointer"
            >
              Active
            </label>
          </div>

          {/* Image upload */}
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <label className="text-sm font-semibold text-slate-700">
              Placement Image
            </label>
            <div className="flex items-center gap-4">
              <label className="size-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors cursor-pointer bg-slate-50 group flex-shrink-0 overflow-hidden relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">
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
                <p className="text-xs font-semibold text-slate-700">
                  Upload Image
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {autoBanner
                    ? "Recommended size: 1200x630px (Landscape)."
                    : "Recommended size: 600x800px (Portrait)."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
