const variants = [
  {
    swatch: "bg-slate-200",
    label: "Small / White",
    price: "$25.00",
    sku: "TSH-WHT-S",
    stock: "42 in stock",
  },
  {
    swatch: "bg-slate-900",
    label: "Medium / Black",
    price: "$25.00",
    sku: "TSH-BLK-M",
    stock: "18 in stock",
  },
];

export default function VariantsTable() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900">Variants</h3>
        <button className="flex items-center gap-1 bg-[#1325ec]/10 text-[#1325ec] px-3 py-1.5 rounded-lg text-sm font-bold">
          <span className="material-symbols-outlined text-sm">add</span> Add
          Variant
        </button>
      </div>
      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
            <tr>
              {["Variant", "Price", "SKU", "Stock", ""].map((h) => (
                <th key={h} className="px-6 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {variants.map((v) => (
              <tr key={v.sku} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded ${v.swatch}`}></div>
                    <span className="text-sm font-medium text-slate-900">
                      {v.label}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <input
                    className="w-20 bg-transparent border-none p-0 text-sm focus:outline-none text-slate-900"
                    defaultValue={v.price}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{v.sku}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                  {v.stock}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-[#1325ec]">
                    <span className="material-symbols-outlined">
                      more_horiz
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
