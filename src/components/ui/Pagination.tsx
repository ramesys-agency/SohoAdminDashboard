interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showingText?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showingText,
}: PaginationProps) {
  const pages = Array.from(
    { length: Math.min(totalPages, 3) },
    (_, i) => i + 1,
  );

  return (
    <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
      {showingText && <p className="text-sm text-slate-500">{showingText}</p>}
      <div className="flex items-center gap-1 ml-auto">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="size-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            chevron_left
          </span>
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`size-8 flex items-center justify-center rounded text-xs font-bold transition-colors ${
              page === currentPage
                ? "bg-[#1325ec] text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {page}
          </button>
        ))}
        {totalPages > 3 && (
          <>
            <span className="px-1 text-slate-300">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="size-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="size-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}
