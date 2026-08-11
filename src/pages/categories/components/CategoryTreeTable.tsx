import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import StatusBadge from "../../../components/ui/StatusBadge";
import Pagination from "../../../components/ui/Pagination";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { getCategoryHierarchy, deleteCategory } from "../../../api/categories";
import type { Category } from "../category.interface";

export default function CategoryTreeTable() {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories-hierarchy", page],
    queryFn: () => getCategoryHierarchy(page, 10),
  });

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories-hierarchy"] });
      toast.success("Category deleted successfully.");
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete category. Please try again.",
      );
    },
  });

  const categories = data?.data || [];
  const meta = data?.meta;

  const toggle = (id: string) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const handleEdit = (cat: Category) => {
    navigate(`/categories/edit/${cat.id}`, { state: { editCategory: cat } });
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading categories...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load categories.
      </div>
    );
  }

  const ActionButtons = ({ cat }: { cat: Category }) => (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => handleEdit(cat)}
        className="p-2 hover:bg-primary/10 rounded-lg text-primary"
        title="Edit category"
      >
        <span className="material-symbols-outlined text-xl">edit</span>
      </button>
      <button
        onClick={() => setDeleteTarget(cat)}
        className="p-2 hover:bg-red-50 rounded-lg text-red-500"
        title="Delete category"
      >
        <span className="material-symbols-outlined text-xl">delete</span>
      </button>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                <th className="px-6 py-4 border-b border-slate-200">
                  Category Name
                </th>
                <th className="px-6 py-4 border-b border-slate-200">
                  Products Count
                </th>
                <th className="px-6 py-4 border-b border-slate-200">Status</th>
                <th className="px-6 py-4 border-b border-slate-200 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat: Category) => {
                const hasChildren = cat.children && cat.children.length > 0;
                const isExpanded = expanded.includes(cat.id);
                return (
                  <React.Fragment key={cat.id}>
                    <tr className="group hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            onClick={() => hasChildren && toggle(cat.id)}
                            className={`material-symbols-outlined text-slate-400 transition-colors ${
                              hasChildren
                                ? "group-hover:text-primary cursor-pointer"
                                : "opacity-50"
                            }`}
                          >
                            {hasChildren
                              ? isExpanded
                                ? "keyboard_arrow_down"
                                : "keyboard_arrow_right"
                              : "remove"}
                          </span>
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                            {cat.imageUrl ? (
                              <img
                                src={cat.imageUrl}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="material-symbols-outlined text-lg">
                                category
                              </span>
                            )}
                          </div>
                          <span className="font-semibold text-slate-900">
                            {cat.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {cat.totalProducts || 0} products
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={cat.isActive ? "Active" : "Inactive"}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ActionButtons cat={cat} />
                      </td>
                    </tr>
                    {isExpanded &&
                      cat.children?.map((child: Category) => (
                        <tr
                          key={child.id}
                          className="group hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3 pl-10 border-l-2 border-slate-200 ml-4">
                              <span className="material-symbols-outlined text-slate-300">
                                subdirectory_arrow_right
                              </span>
                              <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                                {child.imageUrl ? (
                                  <img
                                    src={child.imageUrl}
                                    alt={child.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="material-symbols-outlined text-sm">
                                    category
                                  </span>
                                )}
                              </div>
                              <span className="font-medium text-slate-700">
                                {child.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 text-sm">
                            {child.totalProducts || 0} products
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge
                              status={child.isActive ? "Active" : "Inactive"}
                            />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <ActionButtons cat={child} />
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}
              {categories.length === 0 && !isLoading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {meta && meta.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
            showingText={`Showing ${(page - 1) * meta.limit + 1} to ${Math.min(
              page * meta.limit,
              meta.total,
            )} of ${meta.total} categories`}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        isLoading={isDeleting}
        title="Delete Category"
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">
              &ldquo;{deleteTarget?.name}&rdquo;
            </span>
            ? The category will be deactivated and hidden from your store.
          </>
        }
      />
    </>
  );
}
