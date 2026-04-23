import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PageWrapper from "../../../components/ui/PageWrapper";
import PageHeader from "../../../components/ui/PageHeader";
import BasicInfoForm from "./components/BasicInfoForm";
import VariantsTable, {
  type ProductVariantData,
} from "./components/VariantsTable";
// import SeoSection from "./components/SeoSection";
import StatusCard from "./components/StatusCard";
import OrganizationCard from "./components/OrganizationCard";
import Button from "../../../components/ui/Button";
import { createProduct, getProductById, updateProduct } from "../../../api/products";
import { getCategoryById } from "../../../api/categories";
import { uploadFile } from "../../../api/upload";

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
  const [collections, setCollections] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariantData[]>([]);
  const [categoryAttributes, setCategoryAttributes] = useState<string[]>([]);
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
          setCategoryId(product.categoryId || product.category?.id || "");
          
          // Assuming collections is populated later or handle if present
          if (product.collections) {
             setCollections(product.collections.map((c: { id?: string; [key: string]: unknown }) => c.id || c as unknown as string));
          }

          if (product.variants && product.variants.length > 0) {
            setVariants(
              product.variants.map((v: Record<string, unknown>) => ({
                id: (v.id as string) || crypto.randomUUID(),
                sku: (v.sku as string) || "",
                size: (v.size as string) || "",
                colorName: (v.colorName as string) || "",
                colorValue: (v.colorValue as string) || "#000000",
                stockQty: (v.stockQty as number) || 0,
                basePrice: v.basePrice?.toString() || "0.00",
                originalPrice: v.originalPrice?.toString() || "0.00",
                isDefault: (v.isDefault as boolean) || false,
                images: (v.images as Array<Record<string, unknown>>)?.map((img) => ({
                  id: (img.id as string) || crypto.randomUUID(),
                  imageUrl: (img.imageUrl as string) || "",
                  isPrimary: (img.isPrimary as boolean) || false,
                  colorRef: (img.colorRef as string) || "#f8fafc",
                })) || [],
              }))
            );
          } else {
             // Initialize with empty array but we already default to length 1 below
             setVariants([]);
          }
        })
        .catch((err) => {
          console.error("Failed to load product:", err);
          toast.error(err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed to load product details.");
        })
        .finally(() => setLoading(false));
    } else {
      // Initialize with one empty variant for new products
      setVariants([
        {
          id: crypto.randomUUID(),
          sku: "",
          size: "",
          colorName: "",
          colorValue: "#000000",
          stockQty: 0,
          basePrice: "0.00",
          originalPrice: "0.00",
          isDefault: true,
          images: [],
        },
      ]);
    }
  }, [isEditMode, id]);

  // Track previous category attributes to clean up when switching
  const [prevCategoryAttributes, setPrevCategoryAttributes] = useState<string[]>([]);

  // Fetch category attributes when category changes
  useEffect(() => {
    if (categoryId) {
      getCategoryById(categoryId)
        .then((res) => {
          const category = res.data || res;
          const attrKeys = (category.attributes || []).map((a: any) => 
            typeof a === "string" ? a : a.key
          );
          
          setAttributes(prev => {
            const next = { ...prev };
            let changed = false;

            // 1. Remove empty attributes that were from the previous category but not in the new one
            prevCategoryAttributes.forEach(key => {
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

          setCategoryAttributes(attrKeys);
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

      const productFolderName = name.toLowerCase().trim().replace(/\s+/g, '-');
      const uploadFolder = `products/${productFolderName}`;

      // Process all variants and their images
      const processedVariants = await Promise.all(variants.map(async (v) => {
        const processedImages = await Promise.all((v.images || []).map(async (img: any, i: number) => {
          if (img.file) {
            // New file to upload
            const fileExt = img.file.name.split('.').pop();
            const uniqueName = `${v.sku || 'variant'}-${i}-${Date.now()}.${fileExt}`;
            try {
              const res = await uploadFile(img.file, uploadFolder, uniqueName);
              return {
                imageUrl: res.data.url,
                isPrimary: img.isPrimary,
                displayOrder: i + 1,
                colorRef: img.colorRef
              };
            } catch (error) {
              console.error(`Failed to upload image for variant ${v.sku}:`, error);
              return null;
            }
          }
          // Already an URL
          return {
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary,
            displayOrder: i + 1,
            colorRef: img.colorRef
          };
        }));

        return {
          sku: v.sku,
          size: v.size,
          colorName: v.colorName,
          colorValue: v.colorValue,
          stockQty: Number(v.stockQty) || 0,
          basePrice: Number(v.basePrice) || 0,
          originalPrice: Number(v.originalPrice) || 0,
          isDefault: v.isDefault,
          images: processedImages.filter((img): img is any => img !== null && !!img.imageUrl)
        };
      }));

      const payload = {
        name,
        description,
        categoryId,
        isPublished,
        attributes,
        variants: processedVariants
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
      toast.error(err?.response?.data?.error || err?.response?.data?.message || err?.message || (isEditMode ? "Failed to update product." : "Failed to save product."));
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
            variant="link"
            size="sm"
            onClick={() => navigate("/products")}
            leftIcon={
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
            }
            className="hover:underline"
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
              {loading ? "Saving..." : isEditMode ? "Save Changes" : "Create Product"}
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
            attributes={attributes}
            onAttributesChange={setAttributes}
            categoryAttributes={categoryAttributes}
          />
          <VariantsTable variants={variants} onVariantsChange={setVariants} />
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
