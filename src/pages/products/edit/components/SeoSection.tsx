interface ProductSEO {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}

interface SeoSectionProps {
  seo: ProductSEO;
  onSeoChange: (seo: ProductSEO) => void;
}

export default function SeoSection({ seo, onSeoChange }: SeoSectionProps) {
  const handleChange = (field: keyof ProductSEO, value: string) => {
    onSeoChange({ ...seo, [field]: value });
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4 text-slate-900">
        Search Engine Optimization
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Page Title
            </label>
            <input
              type="text"
              value={seo.metaTitle}
              onChange={(e) => handleChange("metaTitle", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-slate-900"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={seo.metaDescription}
              onChange={(e) => handleChange("metaDescription", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-slate-900 resize-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Canonical URL
            </label>
            <input
              type="text"
              value={seo.canonicalUrl}
              onChange={(e) => handleChange("canonicalUrl", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-slate-900"
            />
          </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-xs font-bold text-slate-400 uppercase mb-3">
            Google Search Preview
          </p>
          <div className="space-y-1">
            <p className="text-blue-700 text-lg font-medium truncate">
              {seo.metaTitle || "Page Title"}
            </p>
            <p className="text-green-700 text-sm truncate">
              {seo.canonicalUrl || "https://example.com/product/..."}
            </p>
            <p className="text-slate-600 text-sm leading-snug break-words line-clamp-2">
              {seo.metaDescription || "No description provided."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
