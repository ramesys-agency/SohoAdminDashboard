import { useEffect, useRef, useState } from "react";

/**
 * Horizontal sliding for the canvas rows that overflow.
 *
 * The rows hide their scrollbar to look like the phone, and their cards are
 * often draggable for reordering — which means a mouse drag reorders rather
 * than scrolls. Without these arrows there is no way to reach a card past the
 * right edge.
 *
 * Pass `deps` whatever changes the row's contents, so the arrows re-evaluate
 * when adding a card is what tips the row into overflowing.
 */
export function useSlideRow(step: number, deps: unknown[] = []) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });

  const measure = () => {
    const row = rowRef.current;
    if (!row) return;
    const maxScroll = row.scrollWidth - row.clientWidth;
    setEdges({
      atStart: row.scrollLeft <= 1,
      // A row that does not overflow reads as both ends at once, which hides
      // both arrows.
      atEnd: row.scrollLeft >= maxScroll - 1,
    });
  };

  const slide = (direction: -1 | 1) => {
    rowRef.current?.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(measure, deps);

  return { rowRef, ...edges, measure, slide };
}

interface SlideArrowsProps {
  atStart: boolean;
  atEnd: boolean;
  onSlide: (direction: -1 | 1) => void;
  label: string;
}

/** Mount inside a `relative group/row` wrapper around the scrolling row. */
export function SlideArrows({
  atStart,
  atEnd,
  onSlide,
  label,
}: SlideArrowsProps) {
  const base =
    "absolute top-1/2 -translate-y-1/2 z-30 size-7 rounded-full bg-white/95 border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-slate-900 hover:border-slate-400 transition-all cursor-pointer";

  const visibility = (hidden: boolean) =>
    hidden
      ? "opacity-0 pointer-events-none"
      : "opacity-0 group-hover/row:opacity-100";

  return (
    <>
      <button
        type="button"
        onClick={() => onSlide(-1)}
        className={`${base} left-0 ${visibility(atStart)}`}
        aria-label={`Scroll ${label} left`}
      >
        <span className="material-symbols-outlined text-[18px]">
          chevron_left
        </span>
      </button>
      <button
        type="button"
        onClick={() => onSlide(1)}
        className={`${base} right-0 ${visibility(atEnd)}`}
        aria-label={`Scroll ${label} right`}
      >
        <span className="material-symbols-outlined text-[18px]">
          chevron_right
        </span>
      </button>
    </>
  );
}
