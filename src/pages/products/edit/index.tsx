import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function ProductEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // State mapping to Prisma schema
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState<string[]>(["UNISEX"]);
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [isPublished, setIsPublished] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [collections, setCollections] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariantData[]>([]);
  /*
  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
  });
  */

  // Load mock data if Edit Mode
  useEffect(() => {
    if (isEditMode) {
      // Mock fetch
      setName("Classic Cotton T-Shirt");
      setDescription("Premium organic cotton.");
      setGender(["UNISEX"]);
      setAttributes({ Material: "100% Cotton", Fit: "Relaxed" });
      setIsPublished(true);
      setCategoryId("cat_clothing");
      setCollections(["Summer Essentials"]);
      setVariants([
        {
          id: crypto.randomUUID(),
          sku: "TSH-WHT-S",
          size: "S",
          colorName: "White",
          colorValue: "#f8fafc",
          stockQty: 42,
          basePrice: "25.00",
          originalPrice: "35.00",
          isDefault: true,
          images: [
            {
              id: "img1",
              imageUrl: "",
              isPrimary: true,
              colorRef: "#f8fafc",
            },
          ],
        },
      ]);
      /*
      setSeo({
        metaTitle: "Classic Cotton T-Shirt | Shop Name",
        metaDescription: "Buy the ultimate Classic Cotton T-Shirt.",
        canonicalUrl: "",
      });
      */
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
  }, [isEditMode]);

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
            <Button>{isEditMode ? "Save Changes" : "Create Product"}</Button>
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
