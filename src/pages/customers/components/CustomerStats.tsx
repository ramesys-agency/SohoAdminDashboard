import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../../../api/users";

export default function CustomerStats() {
  const { data } = useQuery({
    queryKey: ["admin-users-stats"],
    queryFn: () => getAllUsers({ page: 1, limit: 1 }),
  });

  const total = data?.meta?.total;

  return (
    <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 w-fit shadow-sm">
      <div className="size-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined">group</span>
      </div>
      <div>
        <p className="text-slate-500 text-sm">Total Users</p>
        <p className="text-2xl font-bold text-slate-900">
          {total !== undefined ? total.toLocaleString() : "—"}
        </p>
      </div>
    </div>
  );
}
