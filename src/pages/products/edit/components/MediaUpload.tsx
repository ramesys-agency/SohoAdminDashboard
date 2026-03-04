export default function MediaUpload() {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900">Product Media</h3>
        <button className="text-[#1325ec] text-sm font-bold">
          Add from URL
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-2 hover:border-[#1325ec] transition-colors cursor-pointer group bg-slate-50">
          <span className="material-symbols-outlined text-slate-400 group-hover:text-[#1325ec]">
            add_a_photo
          </span>
          <span className="text-xs font-medium text-slate-500">
            Upload Image
          </span>
        </div>
        {["bg-slate-300", "bg-slate-700", "bg-slate-400"].map((color, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden group"
          >
            <div className={`absolute inset-0 ${color}`}></div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-white rounded-full p-1 text-red-500 shadow-sm">
                <span className="material-symbols-outlined text-lg">
                  delete
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
