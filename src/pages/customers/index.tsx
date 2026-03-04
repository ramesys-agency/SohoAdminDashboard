import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import CustomerStats from "./components/CustomerStats";
import CustomerTable from "./components/CustomerTable";

export default function Customers() {
  return (
    <PageWrapper>
      <PageHeader
        title="Customers"
        description="Manage and engage with your customer base."
        actions={
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1325ec] text-white rounded-lg font-bold text-sm shadow-lg shadow-[#1325ec]/20 hover:bg-[#1325ec]/90 transition-all">
            <span className="material-symbols-outlined text-lg">
              person_add
            </span>
            Add Customer
          </button>
        }
      />
      <CustomerStats />
      <CustomerTable />
    </PageWrapper>
  );
}
