interface PricingCardProps {
  basePrice: string;
  comparePrice: string;
  onBasePriceChange: (v: string) => void;
  onComparePriceChange: (v: string) => void;
}

export default function PricingCard({
  basePrice,
  comparePrice,
  onBasePriceChange,
  onComparePriceChange,
}: PricingCardProps) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 mb-4">Pricing</h3>
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Base Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              $
            </span>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => onBasePriceChange(e.target.value)}
              className="w-full pl-7 rounded-lg border border-slate-200 py-2 font-bold focus:border-[#1325ec] outline-none text-slate-900"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Compare-at Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              $
            </span>
            <input
              type="number"
              value={comparePrice}
              onChange={(e) => onComparePriceChange(e.target.value)}
              className="w-full pl-7 rounded-lg border border-slate-200 py-2 text-slate-400 focus:border-[#1325ec] outline-none"
            />
          </div>
        </div>
        <div className="pt-2 flex items-center gap-2">
          <input
            defaultChecked
            type="checkbox"
            id="tax"
            className="rounded border-slate-300 text-[#1325ec]"
          />
          <label className="text-sm text-slate-600" htmlFor="tax">
            Charge tax on this product
          </label>
        </div>
      </div>
    </section>
  );
}
