import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  createCategory,
  updateCategory,
  getParentCategories,
} from "../../../../api/categories";
import { uploadFile } from "../../../../api/upload";
import Button from "../../../../components/ui/Button";
import type { Category } from "../../category.interface";

export default function CategoryForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const editCategory: Category | undefined = location.state?.editCategory;
  const isEditMode = Boolean(editCategory);

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [attributes, setAttributes] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Pre-populate from state when editing
  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name);
      setParentId(editCategory.parentId ?? "");
      setSelectedGender(editCategory.gender ?? "");
      setAttributes(editCategory.attributes ?? []);
      setIsActive(editCategory.isActive);
      setImageUrl(editCategory.imageUrl);
      if (editCategory.imageUrl) {
        setImagePreview(editCategory.imageUrl);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addAttribute = () => {
    setAttributes([...attributes, ""]);
  };

  const removeAttribute = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const updateAttribute = (index: number, value: string) => {
    const newAttributes = [...attributes];
    newAttributes[index] = value;
    setAttributes(newAttributes);
  };

  const setGender = (g: string) => {
    setSelectedGender(g);
  };

  const { data: parentsResponse } = useQuery({
    queryKey: ["parent-categories", selectedGender],
    queryFn: () => getParentCategories({ gender: selectedGender }),
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
      toast.error(error?.response?.data?.message || error?.message || "Failed to create category");
    },
  });

  const { mutate: handleUpdate } = useMutation({
    mutationFn: (payload: Parameters<typeof updateCategory>[1]) =>
      updateCategory(editCategory!.id, payload),
    onSuccess: () => {
      toast.success("Category updated successfully");
      navigate("/categories");
    },
    onError: (error: any) => {
      console.error("Failed to update category", error);
      toast.error(error?.response?.data?.message || error?.message || "Failed to update category");
    },
  });

  const onSubmit = async () => {
    if (!name) {
      toast.error("Please enter a category name");
      return;
    }
    if (!selectedGender) {
      toast.error("Please select a gender");
      return;
    }

    let finalImageUrl = imageUrl;

    // Handle image upload if a new file is selected
    if (imageFile) {
      try {
        const uploadRes = await uploadFile(imageFile, "category", name);
        finalImageUrl = uploadRes.data.url;
      } catch (error) {
        console.error("Image upload failed", error);
        toast.error("Failed to upload image. Please try again.");
        return;
      }
    }

    if (isEditMode) {
      handleUpdate({
        name,
        gender: selectedGender,
        attributes: attributes.filter((a) => a.trim() !== ""),
        parentId: parentId || null,
        isActive,
        imageUrl: finalImageUrl || undefined,
      });
    } else {
      handleCreate({
        name,
        gender: selectedGender,
        attributes: attributes.filter((a) => a.trim() !== ""),
        parentId: parentId || undefined,
        imageUrl: finalImageUrl || undefined,
      });
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
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Gender
              </label>
              <div className="flex gap-2 flex-wrap">
                {["MEN", "WOMEN", "KIDS"].map((g) => (
                  <Button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    variant={
                      selectedGender === g ? "primary" : "outline"
                    }
                    size="sm"
                  >
                    {g}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <label className="text-sm font-semibold text-slate-700">
                Cover Image
              </label>
              <div className="flex items-center gap-4">
                <div
                  onClick={() => document.getElementById("category-image")?.click()}
                  className="size-24 rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 hover:border-[#1325ec] transition-colors cursor-pointer bg-slate-50 group flex-shrink-0 overflow-hidden"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-[#1325ec]">
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
                    {imageFile ? imageFile.name : "Upload Category Cover"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Recommended size: 800x800px. Max 2MB.
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Square images work best for full rounded display.
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
              <div className="space-y-2">
                {attributes.map((attr, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <input
                      type="text"
                      placeholder="e.g. Fabric, Size, Material..."
                      value={attr}
                      onChange={(e) => updateAttribute(index, e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] outline-none text-slate-900"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttribute(index)}
                      className="text-slate-400 hover:text-red-500 flex-shrink-0"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </Button>
                  </div>
                ))}
                {attributes.length === 0 && (
                  <p className="text-xs text-slate-400 italic">
                    No attributes added yet.
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none"
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
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-[#1325ec] outline-none font-medium"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </section>
      </div>
    </form>
  );
}
