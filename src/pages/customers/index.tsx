import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import CustomerStats from "./components/CustomerStats";
import CustomerTable from "./components/CustomerTable";
import CreateAdminModal from "./components/CreateAdminModal";

export default function Customers() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Customers"
        description="All registered users of the application."
        actions={
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Create Admin
          </button>
        }
      />
      <CustomerStats />
      <CustomerTable />
      <CreateAdminModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
      />
    </PageWrapper>
  );
}
