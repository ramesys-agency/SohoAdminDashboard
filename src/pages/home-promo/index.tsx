import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageWrapper from "../../components/ui/PageWrapper";
import PageHeader from "../../components/ui/PageHeader";
import { getHomePromos } from "../../api/homePromo";
import type { HomePromo } from "../../api/homePromo";

export default function HomePromoList() {
  const navigate = useNavigate();

  const { data: response, isLoading } = useQuery({
    queryKey: ["home-promos"],
    queryFn: () => getHomePromos(),
  });

  const promos = response?.data || [];
  return (
    <PageWrapper>
      <PageHeader
        title="Homepage Promotions"
        description="Manage the dynamic Featured Collections / Promotions section on the app homepage."
      />

      <div className="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading promotions...</div>
        ) : promos.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">campaign</span>
            <p className="text-base font-semibold text-slate-700">No promotions configured</p>
            <p className="text-sm text-slate-400 mt-1">Get started by creating a new featured collection or product promotion.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Redirects To</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Linked Item</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {promos.map((promo: HomePromo) => (
                  <tr key={promo.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {promo.imageUrl ? (
                        <img
                          src={promo.imageUrl}
                          alt={promo.title}
                          className="w-16 h-12 rounded object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded bg-slate-100 flex items-center justify-center border border-slate-200">
                          <span className="material-symbols-outlined text-slate-400 text-lg">image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">{promo.title}</td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{promo.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          promo.contentType === "PRODUCT"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        {promo.contentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                      {promo.contentType === "PRODUCT"
                        ? promo.product?.name || "Unknown Product"
                        : promo.collection?.name || "Unknown Collection"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                          promo.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${promo.isActive ? "bg-green-500" : "bg-slate-400"}`} />
                        {promo.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/home-promo/edit/${promo.id}`)}
                          className="p-1 text-slate-500 hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
