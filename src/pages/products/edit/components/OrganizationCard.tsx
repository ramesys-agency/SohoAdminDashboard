import { useState } from "react";

const initialTags = ["Cotton", "Summer", "T-Shirt"];

export default function OrganizationCard() {
  const [tags, setTags] = useState(initialTags);
  const [newTag, setNewTag] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 mb-4">Organization</h3>
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Vendor / Brand
          </label>
          <input
            type="text"
            defaultValue="Urban Basics"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] outline-none text-slate-900"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Collections
          </label>
          <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1325ec] outline-none text-slate-900">
            <option>Summer Essentials</option>
            <option>All-Season Basics</option>
            <option>New Arrivals</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-lg min-h-[80px]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-xs font-medium text-slate-700"
              >
                {tag}
                <button
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className="hover:text-red-500"
                >
                  <span className="material-symbols-outlined text-xs">
                    close
                  </span>
                </button>
              </span>
            ))}
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tag..."
              className="flex-1 bg-transparent border-none p-0 text-xs focus:outline-none min-w-[60px] text-slate-900"
            />
          </div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
          <span className="material-symbols-outlined text-sm">history</span>
          <span>
            Last edited 2 hours ago by <b>John Doe</b>
          </span>
        </div>
        <button className="text-[#1325ec] text-xs font-bold hover:underline">
          View version history
        </button>
      </div>
    </section>
  );
}
