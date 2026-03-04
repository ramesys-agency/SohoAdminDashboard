import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import ProductFilters from "./components/ProductFilters";
import ProductsTable from "./components/ProductsTable";

export default function Products() {
  return (
    <PageWrapper>
      <PageHeader
        title="Products"
        description="View and manage your store inventory."
      />
      <ProductFilters />
      <ProductsTable />
    </PageWrapper>
  );
}
