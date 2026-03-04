export default function SeoSection() {
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
              defaultValue="Classic Cotton T-Shirt | Shop Name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none text-slate-900"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Meta Description
            </label>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none text-slate-900 resize-none"
              defaultValue="Buy the ultimate Classic Cotton T-Shirt. Organic, breathable, and ethically made. Free shipping on orders over $50."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              URL Handle
            </label>
            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
              <span className="px-3 text-slate-400 text-xs">/products/</span>
              <input
                className="border-none bg-transparent flex-1 py-2 px-0 text-sm focus:outline-none text-slate-900"
                defaultValue="classic-cotton-tshirt"
              />
            </div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-xs font-bold text-slate-400 uppercase mb-3">
            Google Search Preview
          </p>
          <div className="space-y-1">
            <p className="text-blue-700 text-lg font-medium">
              Classic Cotton T-Shirt | Shop Name
            </p>
            <p className="text-green-700 text-sm">
              www.myshop.com › products › classic-cotton-tshirt
            </p>
            <p className="text-slate-600 text-sm leading-snug">
              Buy the ultimate Classic Cotton T-Shirt. Organic, breathable, and
              ethically made. Free shipping on orders over $50.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
