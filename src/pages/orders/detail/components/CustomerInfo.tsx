export default function CustomerInfo() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="font-bold text-slate-900 mb-4">Customer Information</h3>
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
        <div className="size-12 rounded-full bg-[#1325ec]/10 flex items-center justify-center text-[#1325ec] font-bold text-lg">
          JD
        </div>
        <div>
          <p className="font-bold text-slate-900">Jane Doe</p>
          <p className="text-sm text-slate-500">jane.doe@email.com</p>
          <p className="text-xs text-slate-400 mt-0.5">
            42 previous orders · Customer since Jan 2022
          </p>
        </div>
        <button className="ml-auto text-[#1325ec] text-sm font-bold hover:underline">
          View Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">
            Shipping Address
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Jane Doe
            <br />
            123 Maple Street, Apt 4B
            <br />
            San Francisco, CA 94102
            <br />
            United States
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">
            Billing Address
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            Jane Doe
            <br />
            123 Maple Street, Apt 4B
            <br />
            San Francisco, CA 94102
            <br />
            United States
          </p>
          <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">
              credit_card
            </span>
            Visa ending in 4242
          </p>
        </div>
      </div>
    </section>
  );
}
