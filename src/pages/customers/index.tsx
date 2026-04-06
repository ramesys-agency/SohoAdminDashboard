import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import CustomerStats from "./components/CustomerStats";
import CustomerTable from "./components/CustomerTable";

export default function Customers() {
  return (
    <PageWrapper>
      <PageHeader
        title="Customers"
        description="All registered users of the application."
      />
      <CustomerStats />
      <CustomerTable />
    </PageWrapper>
  );
}
