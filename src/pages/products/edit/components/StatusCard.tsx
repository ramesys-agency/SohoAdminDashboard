interface StatusCardProps {
  isPublished: boolean;
  onIsPublishedChange: (v: boolean) => void;
}

export default function StatusCard({
  isPublished,
  onIsPublishedChange,
}: StatusCardProps) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 mb-4">Product Status</h3>
      <div className="space-y-4">
        <select
          value={isPublished ? "published" : "draft"}
          onChange={(e) => onIsPublishedChange(e.target.value === "published")}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium focus:border-[#1325ec] outline-none text-slate-900"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Visible in online store</span>
          <button
            onClick={() => onIsPublishedChange(!isPublished)}
            className={`w-10 h-5 rounded-full relative transition-colors ${isPublished ? "bg-[#1325ec]" : "bg-slate-200"}`}
          >
            <div
              className={`absolute top-0.5 size-4 bg-white rounded-full transition-all ${isPublished ? "right-0.5" : "left-0.5"}`}
            ></div>
          </button>
        </div>
      </div>
    </section>
  );
}
