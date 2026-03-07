import Button from "../components/ui/Button";

interface TopbarProps {
  title?: string;
  searchPlaceholder?: string;
}

export default function Topbar({
  searchPlaceholder = "Search...",
}: TopbarProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96 max-w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#1325ec]/20 focus:border-[#1325ec] outline-none transition-all text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative group">
          <span className="material-symbols-outlined text-slate-600">
            notifications
          </span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>
        <Button variant="ghost" size="icon">
          <span className="material-symbols-outlined text-slate-600">
            settings
          </span>
        </Button>

        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        {/* User */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-bold leading-none text-slate-900">
              Alex Rivera
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Admin</p>
          </div>
          <div className="size-9 rounded-full bg-[#1325ec]/10 overflow-hidden border-2 border-[#1325ec]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#1325ec]">
              person
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
