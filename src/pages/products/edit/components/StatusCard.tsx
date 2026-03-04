interface StatusCardProps {
  status: string;
  onStatusChange: (v: string) => void;
  visible: boolean;
  onVisibilityToggle: () => void;
}

export default function StatusCard({
  status,
  onStatusChange,
  visible,
  onVisibilityToggle,
}: StatusCardProps) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 mb-4">Product Status</h3>
      <div className="space-y-4">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium focus:border-[#1325ec] outline-none text-slate-900"
        >
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Visible in online store</span>
          <button
            onClick={onVisibilityToggle}
            className={`w-10 h-5 rounded-full relative transition-colors ${visible ? "bg-[#1325ec]" : "bg-slate-200"}`}
          >
            <div
              className={`absolute top-0.5 size-4 bg-white rounded-full transition-all ${visible ? "right-0.5" : "left-0.5"}`}
            ></div>
          </button>
        </div>
      </div>
    </section>
  );
}
