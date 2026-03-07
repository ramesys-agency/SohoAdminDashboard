import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import ProductFilters from "./components/ProductFilters";
import ProductsTable from "../../components/ui/ProductsTable";
import { mockProducts } from "../../mocks/products";
import Button from "../../components/ui/Button";

export default function Products() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageHeader
        title="Products"
        description="View and manage your store inventory."
        actions={
          <Button
            onClick={() => navigate("/products/edit")}
            leftIcon={
              <span className="material-symbols-outlined text-xl">add</span>
            }
          >
            Add Product
          </Button>
        }
      />
      <ProductFilters />
      <ProductsTable products={mockProducts} />
    </PageWrapper>
  );
}
