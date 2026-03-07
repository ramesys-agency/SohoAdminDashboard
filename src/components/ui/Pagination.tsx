import Button from "./Button";

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
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="size-8 rounded font-normal text-slate-400"
        >
          <span className="material-symbols-outlined text-[18px]">
            chevron_left
          </span>
        </Button>
        {pages.map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            variant={page === currentPage ? "primary" : "outline"}
            className={`size-8 rounded text-xs px-0 py-0 flex items-center justify-center font-bold`}
          >
            {page}
          </Button>
        ))}
        {totalPages > 3 && (
          <>
            <span className="px-1 text-slate-300">...</span>
            <Button
              variant="outline"
              onClick={() => onPageChange(totalPages)}
              className="size-8 rounded text-xs px-0 py-0 flex items-center justify-center font-bold"
            >
              {totalPages}
            </Button>
          </>
        )}
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="size-8 rounded font-normal text-slate-400"
        >
          <span className="material-symbols-outlined text-[18px]">
            chevron_right
          </span>
        </Button>
      </div>
    </div>
  );
}
