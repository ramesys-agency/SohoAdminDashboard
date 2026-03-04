interface BasicInfoFormProps {
  title: string;
  onTitleChange: (v: string) => void;
}

export default function BasicInfoForm({
  title,
  onTitleChange,
}: BasicInfoFormProps) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4 text-slate-900">
        Basic Information
      </h3>
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Product Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-[#1325ec] focus:ring-2 focus:ring-[#1325ec]/20 outline-none text-slate-900"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Description
          </label>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-2">
              {[
                "format_bold",
                "format_italic",
                "format_list_bulleted",
                "link",
              ].map((icon) => (
                <button key={icon} className="p-1 hover:bg-slate-200 rounded">
                  <span className="material-symbols-outlined text-xl text-slate-600">
                    {icon}
                  </span>
                </button>
              ))}
            </div>
            <textarea
              rows={6}
              className="w-full border-none focus:outline-none text-sm p-3 text-slate-900 resize-none"
              defaultValue="Our Classic Cotton T-Shirt is made from 100% premium organic cotton. Features a relaxed fit, reinforced seams, and a tag-less collar for ultimate comfort."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
