import StatusBadge from "../../../../components/ui/StatusBadge";

const variants = [
  { label: "Small / White", stock: 42, color: "bg-slate-200" },
  { label: "Medium / Black", stock: 18, color: "bg-slate-900" },
  { label: "Large / Navy", stock: 5, color: "bg-blue-900" },
];

export default function ProductInfo() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-black text-slate-900">
              Classic Cotton T-Shirt
            </h2>
            <StatusBadge status="Active" />
          </div>
          <p className="text-sm text-slate-500">
            SKU: TSH-CLT-001 · Vendor: Urban Basics · Collection: Summer
            Essentials
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-black text-[#1325ec]">$25.00</span>
          <span className="text-lg text-slate-400 line-through">$35.00</span>
        </div>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed mb-6">
        Our Classic Cotton T-Shirt is made from 100% premium organic cotton.
        Features a relaxed fit, reinforced seams, and a tag-less collar for
        ultimate comfort. Perfect for everyday wear.
      </p>

      {/* Variants */}
      <div className="border-t border-slate-100 pt-6">
        <h4 className="text-sm font-bold text-slate-700 mb-3">Variants</h4>
        <div className="space-y-3">
          {variants.map((v) => (
            <div
              key={v.label}
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className={`size-8 rounded ${v.color} flex-shrink-0`}></div>
              <span className="text-sm font-medium text-slate-800 flex-1">
                {v.label}
              </span>
              <span
                className={`text-xs font-bold ${v.stock < 10 ? "text-rose-500" : "text-emerald-600"}`}
              >
                {v.stock} in stock
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="border-t border-slate-100 pt-6 mt-6">
        <h4 className="text-sm font-bold text-slate-700 mb-2">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {["Cotton", "Summer", "T-Shirt", "Organic"].map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
