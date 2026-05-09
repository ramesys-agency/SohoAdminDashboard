import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import BasicInfoForm from "./components/BasicInfoForm";
import VariantsTable, { type ColorGroupData } from "./components/VariantsTable";
// import SeoSection from "./components/SeoSection";
import StatusCard from "./components/StatusCard";
import OrganizationCard from "./components/OrganizationCard";
import Button from "../../../components/ui/Button";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../../api/products";
import { getCategoryById } from "../../../api/categories";
import { uploadFile } from "../../../api/upload";
import { generateUUID } from "../../../utils/uuid";

export default function ProductEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // State mapping to Prisma schema
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [isPublished, setIsPublished] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [gender, setGender] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [colorGroups, setColorGroups] = useState<ColorGroupData[]>([]);
  const [categoryAttributes, setCategoryAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  /*
  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
  });
  */

  // Load real data if Edit Mode
  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      getProductById(id)
        .then((res) => {
          const product = res.data || res; // Handle varying response wrappers
          setName(product.name || "");
          setDescription(product.description || "");
          setAttributes(product.attributes || {});
          setIsPublished(product.isPublished || false);
          setGender(product.gender || []);
          if (product.category) {
            setCategoryId(product.category.id);
          } else if (product.categoryId) {
            setCategoryId(product.categoryId);
          }

          // Assuming collections is populated later or handle if present
          if (product.collections) {
            setCollections(
              product.collections.map(
                (c: { id?: string; [key: string]: unknown }) =>
                  c.id || (c as unknown as string),
              ),
            );
          }

          if (product.variants && product.variants.length > 0) {
            const colorGroupsMap = new Map<string, ColorGroupData>();
            for (const v of product.variants) {
              const colorVal = v.colorValue || "#000000";
              const colorNm = (v.colorName as string) || "";
              const key = `${colorVal}-${colorNm}`;
              if (!colorGroupsMap.has(key)) {
                colorGroupsMap.set(key, {
                  id: generateUUID(),
                  colorName: colorNm,
                  colorValue: colorVal,
                  isDefault: false,
                  images:
                    (v.images as Array<Record<string, unknown>>)?.map(
                      (img) => ({
                        id: (img.id as string) || generateUUID(),
                        imageUrl: (img.imageUrl as string) || "",
                        isPrimary: (img.isPrimary as boolean) || false,
                        colorRef: (img.colorRef as string) || "#f8fafc",
                      }),
                    ) || [],
                  sizes: [],
                });
              }
              const group = colorGroupsMap.get(key)!;
              if (v.isDefault) group.isDefault = true;
              group.sizes.push({
                id: (v.id as string) || generateUUID(),
                size: (v.size as string) || "",
                sku: (v.sku as string) || "",
                stockQty: (v.stockQty as number) || 0,
                basePrice: v.basePrice?.toString() || "0.00",
                originalPrice: v.originalPrice?.toString() || "0.00",
              });
            }
            setColorGroups(Array.from(colorGroupsMap.values()));
          } else {
            setColorGroups([]);
          }
        })
        .catch((err) => {
          console.error("Failed to load product:", err);
          toast.error(
            err?.response?.data?.error ||
              err?.response?.data?.message ||
              err?.message ||
              "Failed to load product details.",
          );
        })
        .finally(() => setLoading(false));
    } else {
      // Initialize with one empty variant for new products
      setColorGroups([
        {
          id: generateUUID(),
          colorName: "",
          colorValue: "#000000",
          isDefault: true,
          images: [],
          sizes: [
            {
              id: generateUUID(),
              size: "",
              sku: "",
              stockQty: 0,
              basePrice: "0.00",
              originalPrice: "0.00",
            },
          ],
        },
      ]);
    }
  }, [isEditMode, id]);

  // Track previous category attributes to clean up when switching
  const [prevCategoryAttributes, setPrevCategoryAttributes] = useState<
    string[]
  >([]);

  // Fetch aggregated category attributes when category change
  useEffect(() => {
    if (categoryId) {
      getCategoryById(categoryId)
        .then((res) => {
          const category = res.data || res;
          const attrs = category.attributes || [];

          const attrKeys = attrs.map((a: any) =>
            typeof a === "string" ? a : a.key,
          );

          setAttributes((prev) => {
            const next = { ...prev };
            let changed = false;

            // 1. Remove empty attributes that were from previous category but not in current one
            prevCategoryAttributes.forEach((key) => {
              if (!attrKeys.includes(key) && next[key] === "") {
                delete next[key];
                changed = true;
              }
            });

            // 2. Add new category attributes if they don't exist
            attrKeys.forEach((key: string) => {
              if (next[key] === undefined) {
                next[key] = "";
                changed = true;
              }
            });

            return changed ? next : prev;
          });

          setCategoryAttributes(
            attrs.map((a: any) =>
              typeof a === "string" ? { key: a, label: a, type: "text" } : a,
            ),
          );
          setPrevCategoryAttributes(attrKeys);
        })
        .catch((err) => {
          console.error("Failed to load category attributes:", err);
        });
    } else {
      setCategoryAttributes([]);
    }
  }, [categoryId]);

  const handleSave = async () => {
    try {
      setLoading(true);

      // Frontend Validation
      if (!name.trim()) {
        toast.error("Product name is required");
        setLoading(false);
        return;
      }

      if (!categoryId) {
        toast.error("Category is required");
        setLoading(false);
        return;
      }

      if (colorGroups.length === 0) {
        toast.error("At least one product variant is required");
        setLoading(false);
        return;
      }

      for (const group of colorGroups) {
        if (!group.colorName.trim()) {
          toast.error("Please fill all the compulsory fields: Color Name is missing.");
          setLoading(false);
          return;
        }
        if (group.images.length === 0) {
          toast.error(`Please fill all the compulsory fields: Images are missing for ${group.colorName}.`);
          setLoading(false);
          return;
        }
        if (group.sizes.length === 0) {
          toast.error(`Please fill all the compulsory fields: At least one size is required for ${group.colorName}.`);
          setLoading(false);
          return;
        }
        for (const sz of group.sizes) {
          const missingFields = [];
          if (!sz.sku.trim()) missingFields.push("SKU");
          if (!sz.basePrice || parseFloat(sz.basePrice) <= 0) missingFields.push("Price");
          if (!sz.originalPrice || parseFloat(sz.originalPrice) <= 0) missingFields.push("MRP");

          if (missingFields.length > 0) {
            toast.error(`Please fill all the compulsory fields: ${missingFields.join(", ")} is missing/invalid for ${group.colorName} variant.`);
            setLoading(false);
            return;
          }
          if (sz.stockQty === undefined || sz.stockQty === null) {
            toast.error(`Please fill all the compulsory fields: Stock quantity is missing for ${group.colorName} variant.`);
            setLoading(false);
            return;
          }
        }
      }

      const productFolderName = name.toLowerCase().trim().replace(/\s+/g, "-");
      const uploadFolder = `products/${productFolderName}`;

      // Process all color groups and their variants
      const processedVariants: any[] = [];
      await Promise.all(
        colorGroups.map(async (cg) => {
          const processedImages = await Promise.all(
            (cg.images || []).map(async (img: any, i: number) => {
              if (img.file) {
                const fileExt = img.file.name.split(".").pop();
                const uniqueName = `color-${cg.id}-${i}-${Date.now()}.${fileExt}`;
                try {
                  const res = await uploadFile(
                    img.file,
                    uploadFolder,
                    uniqueName,
                  );
                  return {
                    imageUrl: res.data.url,
                    isPrimary: img.isPrimary,
                    displayOrder: i + 1,
                    colorRef: img.colorRef,
                  };
                } catch (error: any) {
                  console.error(
                    `Failed to upload image for color group ${cg.colorName}:`,
                    error,
                  );
                  throw new Error(
                    `Failed to upload image for color group ${cg.colorName}: ${error?.message || "Unknown error"}`,
                  );
                }
              }
              return {
                imageUrl: img.imageUrl,
                isPrimary: img.isPrimary,
                displayOrder: i + 1,
                colorRef: img.colorRef,
              };
            }),
          );

          const validImages = processedImages.filter(
            (img): img is any => img !== null && !!img.imageUrl,
          );

          for (let idx = 0; idx < cg.sizes.length; idx++) {
            const sizeData = cg.sizes[idx];
            processedVariants.push({
              sku: sizeData.sku,
              size: sizeData.size,
              colorName: cg.colorName,
              colorValue: cg.colorValue,
              stockQty: Number(sizeData.stockQty) || 0,
              basePrice: Number(sizeData.basePrice) || 0,
              originalPrice: Number(sizeData.originalPrice) || 0,
              isDefault: cg.isDefault && idx === 0, // only the first size is marked as default to avoid multiple defaults
              images: validImages,
            });
          }
        }),
      );

      const payload = {
        name,
        description,
        categoryIds: categoryId ? [categoryId] : [],
        collectionIds: collections.length > 0 ? collections : undefined,
        gender,
        isPublished,
        attributes,
        variants: processedVariants,
      };

      if (isEditMode && id) {
        await updateProduct(id, payload);
        toast.success("Product updated successfully!");
        navigate("/products");
      } else {
        await createProduct(payload);
        toast.success("Product created successfully!");
        navigate("/products");
      }
    } catch (err: any) {
      console.error(err);
      const errorData = err?.response?.data?.error;
      
      if (Array.isArray(errorData)) {
        errorData.forEach((e: any) => {
          toast.error(e.message || "Validation error occurred");
        });
      } else {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            (isEditMode ? "Failed to update product." : "Failed to save product."),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title={isEditMode ? "Edit Product" : "Create Product"}
        description={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/products")}
            leftIcon={
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
            }
            className=""
          >
            Back to Products
          </Button>
        }
        actions={
          <>
            <Button variant="outline" onClick={() => navigate("/products")}>
              Discard
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Product"}
            </Button>
          </>
        }
      />

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Left Column */}
        <div className="xl:col-span-2 space-y-6">
          <OrganizationCard
            categoryId={categoryId}
            onCategoryIdChange={setCategoryId}
            collections={collections}
            onCollectionsChange={setCollections}
          />
          <BasicInfoForm
            name={name}
            onNameChange={setName}
            description={description}
            onDescriptionChange={setDescription}
            gender={gender}
            onGenderChange={setGender}
            attributes={attributes}
            onAttributesChange={setAttributes}
            categoryAttributes={categoryAttributes}
          />
          <VariantsTable
            colorGroups={colorGroups}
            onColorGroupsChange={setColorGroups}
          />
          {/* <SeoSection seo={seo} onSeoChange={setSeo} /> */}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <StatusCard
            isPublished={isPublished}
            onIsPublishedChange={setIsPublished}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
