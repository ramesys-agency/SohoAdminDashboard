import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  createCategory,
  updateCategory,
  getParentCategories,
  getCategoryById,
} from "../../../../api/categories";
import { uploadFile } from "../../../../api/upload";
import Button from "../../../../components/ui/Button";
import type { Category } from "../../category.interface";

export interface AttributeData {
  id?: string;
  key: string;
  label: string;
  type: string;
  options?: any;
  isFilterable: boolean;
}

type GenderKey = "MEN" | "WOMEN" | "KIDS";

/**
 * Per-gender catalog placement. `isActive` controls whether the category shows
 * up in that tab of the mobile catalog at all — the backend treats a missing or
 * inactive placement as "hidden", regardless of what products the category has.
 */
interface PlacementState {
  file: File | null;
  preview: string | null;
  url: string | null;
  isActive: boolean;
  displayOrder: number;
}

const GENDERS: { key: GenderKey; label: string; icon: string }[] = [
  { key: "MEN", label: "Men", icon: "man" },
  { key: "WOMEN", label: "Women", icon: "woman" },
  { key: "KIDS", label: "Kids", icon: "child_care" },
];

const emptyPlacement: PlacementState = {
  file: null,
  preview: null,
  url: null,
  isActive: false,
  displayOrder: 0,
};

const emptyPlacements: Record<GenderKey, PlacementState> = {
  MEN: { ...emptyPlacement },
  WOMEN: { ...emptyPlacement },
  KIDS: { ...emptyPlacement },
};

export default function CategoryForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const editCategory: Category | undefined = location.state?.editCategory;
  const isEditMode = Boolean(id || editCategory);

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [attributes, setAttributes] = useState<AttributeData[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [, setLoading] = useState(false);

  // Per-gender catalog placements (image + visibility + ordering)
  const [placements, setPlacements] =
    useState<Record<GenderKey, PlacementState>>(emptyPlacements);

  const updatePlacement = (
    gender: GenderKey,
    changes: Partial<PlacementState>,
  ) => {
    setPlacements((current) => ({
      ...current,
      [gender]: { ...current[gender], ...changes },
    }));
  };

  // Fetch category data if in edit mode (handles page refreshes)
  const categoryId = id || editCategory?.id;
  const { data: fetchedCategoryRes } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => getCategoryById(categoryId!),
    enabled: isEditMode && Boolean(categoryId),
  });

  const categoryData = fetchedCategoryRes?.data || editCategory;

  // Published product counts per gender, including descendant categories — the
  // same set the "View products" link lands on. Only present on the by-id fetch,
  // so it stays empty until that resolves.
  const genderProductCounts: Partial<Record<GenderKey, number>> =
    fetchedCategoryRes?.data?.genderProductCounts ?? {};

  // Pre-populate from state when editing
  useEffect(() => {
    if (categoryData) {
      setName(categoryData.name);
      setParentId(categoryData.parentId ?? "");
      setAttributes(categoryData.attributes || []);
      setIsActive(categoryData.isActive);
      setImageUrl(categoryData.imageUrl);
      if (categoryData.imageUrl) {
        setImagePreview(categoryData.imageUrl);
      }

      // Pre-populate gender placements. An existing row means the category is
      // already configured for that tab, so default isActive to true when the
      // backend has not sent an explicit value.
      if (categoryData.genderImages) {
        const next: Record<GenderKey, PlacementState> = {
          MEN: { ...emptyPlacement },
          WOMEN: { ...emptyPlacement },
          KIDS: { ...emptyPlacement },
        };

        categoryData.genderImages.forEach((placement: any) => {
          const gender = placement.gender as GenderKey;
          if (!next[gender]) return;

          next[gender] = {
            file: null,
            preview: placement.imageUrl ?? null,
            url: placement.imageUrl ?? null,
            isActive: placement.isActive ?? true,
            displayOrder: placement.displayOrder ?? 0,
          };
        });

        setPlacements(next);
      }
    }
  }, [categoryData]);

  const addAttribute = () => {
    setAttributes([
      ...attributes,
      { key: "", label: "", type: "text", isFilterable: false },
    ]);
  };

  const removeAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const updateAttribute = (
    index: number,
    field: keyof AttributeData,
    value: any,
  ) => {
    const newAttributes = [...attributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setAttributes(newAttributes);
  };

  const { data: parentsResponse } = useQuery({
    queryKey: ["parent-categories"],
    queryFn: () => getParentCategories(),
  });

  const parentOptions = (parentsResponse?.data || []).filter(
    (cat: Category) => cat.id !== editCategory?.id,
  );

  const { mutate: handleCreate } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created successfully");
      navigate("/categories");
    },
    onError: (error: any) => {
      console.error("Failed to create category", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create category",
      );
    },
  });

  const { mutate: handleUpdate } = useMutation({
    mutationFn: (payload: Parameters<typeof updateCategory>[1]) =>
      updateCategory(categoryId!, payload),
    onSuccess: () => {
      toast.success("Category updated successfully");
      navigate("/categories");
    },
    onError: (error: any) => {
      console.error("Failed to update category", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update category",
      );
    },
  });

  const onSubmit = async () => {
    if (!name) {
      toast.error("Please enter a category name");
      return;
    }

    setLoading(true);

    const categoryFolder = `category/${name.toLowerCase().replace(/\s+/g, "-")}`;

    const uploadImages = async () => {
      let mainUrl = imageUrl;

      if (imageFile) {
        const res = await uploadFile(imageFile, categoryFolder, "main");
        mainUrl = res.data.url;
      }

      const placementUrls = {} as Record<GenderKey, string | null>;
      for (const { key } of GENDERS) {
        const placement = placements[key];
        if (placement.file) {
          const res = await uploadFile(
            placement.file,
            categoryFolder,
            key.toLowerCase(),
          );
          placementUrls[key] = res.data.url;
        } else {
          placementUrls[key] = placement.url;
        }
      }

      return { mainUrl, placementUrls };
    };

    try {
      const { mainUrl, placementUrls } = await uploadImages();

      // Send every gender, including disabled ones: the backend upserts by
      // (category, gender), so an explicit isActive false is what hides a
      // category from a tab while keeping its image and ordering on file.
      const genderImages = GENDERS.map(({ key }) => ({
        gender: key,
        imageUrl: placementUrls[key],
        isActive: placements[key].isActive,
        displayOrder: placements[key].displayOrder,
      }));

      const payload = {
        name,
        attributes: attributes.filter((a) => a.key.trim() !== ""),
        parentId: parentId || (isEditMode ? null : undefined),
        isActive,
        imageUrl: mainUrl === null ? null : (mainUrl || undefined),
        genderImages,
      };

      if (isEditMode) {
        handleUpdate(payload);
      } else {
        handleCreate(payload);
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="create-category-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="grid grid-cols-1 xl:grid-cols-3 gap-8"
    >
      {/* Left: Main form */}
      <div className="xl:col-span-2 space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-4 text-slate-900">
            Category Details
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Electronics, Apparel..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            {/* Main Category Image */}
            <div className="flex flex-col gap-2 pt-2">
              <label className="text-sm font-semibold text-slate-700">
                Default Cover Image
              </label>
              <div className="flex items-center gap-4">
                <div
                  onClick={() =>
                    document.getElementById("category-image")?.click()
                  }
                  className="size-24 rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors cursor-pointer bg-slate-50 group shrink-0 overflow-hidden"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">
                      add_photo_alternate
                    </span>
                  )}
                  <input
                    id="category-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-semibold text-slate-700">
                    {imageFile ? imageFile.name : "Upload Default Cover"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Recommended size: 800x800px. Max 2MB.
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Used if gender-specific image is not provided.
                  </p>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        setImageUrl(null);
                      }}
                      className="text-[10px] text-red-500 font-bold hover:underline text-left mt-1"
                    >
                      Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Catalog Placement — controls the mobile app's gender tabs */}
            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase">
                Catalog Placement
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 mb-4">
                Choose which gender tabs this category appears in. A tab that is
                off hides the category from the app, even if it has products.
                Leave the image empty to use the main image above. Counts are
                published products, including sub-categories.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {GENDERS.map(({ key, label, icon }) => {
                  const placement = placements[key];
                  const inputId = `${key.toLowerCase()}-image`;

                  return (
                    <div
                      key={key}
                      className={`space-y-3 flex flex-col items-center rounded-lg border p-4 transition-colors ${
                        placement.isActive
                          ? "border-slate-200 bg-white"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                        {label}
                      </label>

                      <div
                        onClick={() =>
                          document.getElementById(inputId)?.click()
                        }
                        className={`size-20 rounded-full border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary bg-slate-50 overflow-hidden relative group shadow-sm ${
                          placement.isActive ? "" : "opacity-40"
                        }`}
                      >
                        {placement.preview ? (
                          <img
                            src={placement.preview}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-slate-300 text-lg">
                            {icon}
                          </span>
                        )}
                        <input
                          id={inputId}
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              updatePlacement(key, {
                                file,
                                preview: URL.createObjectURL(file),
                              });
                            }
                          }}
                        />
                      </div>

                      {placement.preview && (
                        <button
                          type="button"
                          onClick={() =>
                            updatePlacement(key, {
                              file: null,
                              preview: null,
                              url: null,
                            })
                          }
                          className="text-[10px] text-red-500 font-bold hover:underline"
                        >
                          Remove Image
                        </button>
                      )}

                      <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={placement.isActive}
                          onChange={(e) =>
                            updatePlacement(key, {
                              isActive: e.target.checked,
                            })
                          }
                          className="size-3.5 rounded border-slate-300 accent-primary cursor-pointer"
                        />
                        Show in {label}
                      </label>

                      {isEditMode && (
                        <div className="w-full pt-2 border-t border-slate-100 text-center">
                          <p className="text-[11px] text-slate-500">
                            <span className="font-bold text-slate-700">
                              {genderProductCounts[key] ?? 0}
                            </span>{" "}
                            {genderProductCounts[key] === 1
                              ? "product"
                              : "products"}
                          </p>
                          {(genderProductCounts[key] ?? 0) > 0 && (
                            <Link
                              to={`/products?categoryId=${categoryId}&gender=${key}&isPublished=true`}
                              className="text-[10px] font-bold text-primary hover:underline"
                            >
                              View products
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-slate-200 mt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Attributes
                </label>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={addAttribute}
                  leftIcon={
                    <span className="material-symbols-outlined text-sm">
                      add
                    </span>
                  }
                >
                  Add Attribute
                </Button>
              </div>
              <div className="space-y-4">
                {attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 relative group"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttribute(index)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 h-8 w-8"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        close
                      </span>
                    </Button>

                    <div className="grid grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                          Key <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. fabric_type"
                          value={attr.key}
                          onChange={(e) =>
                            updateAttribute(index, "key", e.target.value)
                          }
                          className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                          Label <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Fabric Type"
                          value={attr.label}
                          onChange={(e) =>
                            updateAttribute(index, "label", e.target.value)
                          }
                          className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-primary outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                          Type
                        </label>
                        <select
                          value={attr.type}
                          onChange={(e) =>
                            updateAttribute(index, "type", e.target.value)
                          }
                          className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-primary outline-none"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                          <option value="select">Select Options</option>
                        </select>
                      </div>
                      {/* <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={attr.isFilterable}
                            onChange={(e) =>
                              updateAttribute(
                                index,
                                "isFilterable",
                                e.target.checked,
                              )
                            }
                            className="rounded text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium text-slate-700">
                            Use for Filtering
                          </span>
                        </label>
                      </div> */}
                    </div>

                    {attr.type === "select" && (
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                          Options (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Cotton, Polyester, Wool"
                          value={
                            Array.isArray(attr.options)
                              ? attr.options.join(", ")
                              : attr.options || ""
                          }
                          onChange={(e) =>
                            updateAttribute(
                              index,
                              "options",
                              e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            )
                          }
                          className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:border-primary outline-none"
                        />
                      </div>
                    )}
                  </div>
                ))}
                {attributes.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    No attributes added yet. Click "Add Attribute" to define
                    custom fields.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Parent Category */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-4 text-slate-900">Hierarchy</h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Parent Category
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary outline-none"
            >
              <option value="">None (Top-level)</option>
              {parentOptions.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500">
              Leave empty to create a top-level category.
            </p>
          </div>
        </section>
      </div>

      {/* Right sidebar */}
      <div className="space-y-6">
        {/* Status */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Status</h3>
          <select
            value={isActive ? "active" : "inactive"}
            onChange={(e) => setIsActive(e.target.value === "active")}
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary outline-none font-medium"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </section>
      </div>
    </form>
  );
}
