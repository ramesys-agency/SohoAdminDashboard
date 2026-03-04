import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import ProductFilters from "./components/ProductFilters";
import ProductsTable from "./components/ProductsTable";

export default function Products() {
  const navigate = useNavigate();
  return (
    <PageWrapper>
      <PageHeader
        title="Products"
        description="View and manage your store inventory."
        actions={
          <button
            onClick={() => navigate("/products/edit")}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1325ec] text-white font-bold text-sm rounded-lg shadow-lg shadow-[#1325ec]/20 hover:opacity-90"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Add Product
          </button>
        }
      />
      <ProductFilters />
      <ProductsTable />
    </PageWrapper>
  );
}
