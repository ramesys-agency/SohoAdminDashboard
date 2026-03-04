import { useNavigate } from "react-router-dom";

export default function ProductFilters() {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Filter by name..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1325ec]/20 text-slate-900"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {[
          ["All Categories", "Electronics", "Apparel", "Home & Living"],
          ["Price: Any", "Under $50", "$50 - $200", "Over $200"],
          ["Status", "Active", "Draft", "Archived"],
        ].map((opts, i) => (
          <select
            key={i}
            className="text-sm border border-slate-200 bg-white rounded-lg focus:outline-none py-2 px-3 text-slate-700"
          >
            {opts.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ))}
        <button className="p-2 flex items-center gap-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined text-xl">filter_list</span>
          <span className="text-sm font-medium">Advanced</span>
        </button>
      </div>
      <button
        onClick={() => navigate("/products/edit")}
        className="flex items-center gap-2 px-6 py-2.5 bg-[#1325ec] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#1325ec]/25 transition-all"
      >
        <span className="material-symbols-outlined">add</span>
        Add Product
      </button>
    </div>
  );
}
