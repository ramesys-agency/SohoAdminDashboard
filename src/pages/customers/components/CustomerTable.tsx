import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers, type AdminUser } from "../../../api/users";
import Pagination from "../../../components/ui/Pagination";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700 border border-purple-200",
    customer: "bg-blue-50 text-blue-600 border border-blue-200",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
        styles[role] ?? "bg-slate-100 text-slate-600 border border-slate-200"
      }`}
    >
      {role}
    </span>
  );
}

export default function CustomerTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [role, setRole] = useState("customer");
  const [showDeleted, setShowDeleted] = useState("active");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-users", page, search, region, role, showDeleted],
    queryFn: () =>
      getAllUsers({
        page,
        limit: 20,
        ...(search ? { search } : {}),
        ...(region !== "All Regions" ? { region } : {}),
        ...(role !== "all" ? { role } : {}),
        showDeleted,
      }),
  });

  const users: AdminUser[] = data?.data ?? [];
  const meta = data?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-700">
          {meta ? (
            <>
              <span className="text-slate-900">{meta.total}</span>{" "}
              <span className="text-slate-500">users total</span>
            </>
          ) : (
            "Users"
          )}
        </p>
        <form onSubmit={handleSearch} className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email…"
            className="bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm w-full sm:w-72 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          />
        </form>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex flex-wrap items-center gap-3">
        {/* Region Dropdown */}
        <div className="relative min-w-[160px]">
          <select
            value={region}
            onChange={(e) => {
              setPage(1);
              setRegion(e.target.value);
            }}
            className="w-full pl-3 pr-10 py-1.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none text-slate-700 font-semibold cursor-pointer"
          >
            {["All Regions", "Dhaka", "Chattogram", "Khulna", "Rajshahi", "Barishal", "Sylhet", "Rangpur", "Mymensingh"].map((r) => (
              <option key={r} value={r}>{r === "All Regions" ? "Region: All" : r}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
            expand_more
          </span>
        </div>

        {/* Role Dropdown */}
        <div className="relative min-w-[160px]">
          <select
            value={role}
            onChange={(e) => {
              setPage(1);
              setRole(e.target.value);
            }}
            className="w-full pl-3 pr-10 py-1.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none text-slate-700 font-semibold cursor-pointer"
          >
            {[
              { label: "Role: Customers", value: "customer" },
              { label: "Role: Admins", value: "admin" },
              { label: "Role: All", value: "all" },
            ].map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
            expand_more
          </span>
        </div>

        {/* Status (Deleted) Dropdown */}
        <div className="relative min-w-[160px]">
          <select
            value={showDeleted}
            onChange={(e) => {
              setPage(1);
              setShowDeleted(e.target.value);
            }}
            className="w-full pl-3 pr-10 py-1.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none text-slate-700 font-semibold cursor-pointer"
          >
            {[
              { label: "Status: Active", value: "active" },
              { label: "Status: Deleted Only", value: "only" },
              { label: "Status: All (Inc. Deleted)", value: "all" },
            ].map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
            expand_more
          </span>
        </div>

        {/* Clear filters if anything is filtered */}
        {(region !== "All Regions" || role !== "customer" || showDeleted !== "active" || search !== "") && (
          <button
            onClick={() => {
              setPage(1);
              setRegion("All Regions");
              setRole("customer");
              setShowDeleted("active");
              setSearch("");
              setSearchInput("");
            }}
            className="text-primary text-xs font-bold hover:underline transition-all ml-auto sm:ml-0"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/60 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Region</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-slate-200" />
                      <div className="space-y-2">
                        <div className="h-3 w-32 bg-slate-200 rounded" />
                        <div className="h-2.5 w-44 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-16 bg-slate-100 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                  </td>
                </tr>
              ))}

            {isError && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center text-slate-400 text-sm"
                >
                  <span className="material-symbols-outlined text-3xl block mx-auto mb-2">
                    cloud_off
                  </span>
                  Failed to load users. Please try again.
                </td>
              </tr>
            )}

            {!isLoading && !isError && users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center text-slate-400 text-sm"
                >
                  <span className="material-symbols-outlined text-3xl block mx-auto mb-2">
                    person_search
                  </span>
                  No users found.
                </td>
              </tr>
            )}

            {!isLoading &&
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Name + email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        {getInitials(user.fullName)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 flex items-center gap-1.5 flex-wrap">
                          {user.fullName}
                          {user.isVerified && (
                            <span
                              className="material-symbols-outlined text-[14px] text-emerald-500"
                              title="Verified"
                            >
                              verified
                            </span>
                          )}
                          {user.isDeleted && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
                              Deleted
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.phone ?? <span className="text-slate-300">—</span>}
                  </td>

                  {/* Region */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {user.region ?? <span className="text-slate-300">—</span>}
                  </td>

                  {/* Joined date */}
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={meta.totalPages}
          onPageChange={setPage}
          showingText={`Showing ${(page - 1) * meta.limit + 1}–${Math.min(
            page * meta.limit,
            meta.total,
          )} of ${meta.total} users`}
        />
      )}
    </div>
  );
}
