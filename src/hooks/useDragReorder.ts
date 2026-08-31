import { useState } from "react";

/**
 * Native HTML5 drag-and-drop reordering — no extra dependency. The list is
 * reordered locally while dragging and only persisted on drop. Generic so the
 * same behaviour drives placement canvases and product lists alike.
 */
export function useDragReorder<T>(items: T[], onReorder: (ordered: T[]) => void) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const move = (from: number, to: number): T[] => {
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  };

  const dragProps = (index: number) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      // Firefox refuses to start a drag until the event carries data.
      e.dataTransfer.setData("text/plain", String(index));
      e.dataTransfer.effectAllowed = "move";
      setDragIndex(index);
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragIndex !== null && index !== overIndex) setOverIndex(index);
    },
    onDragEnd: () => {
      setDragIndex(null);
      setOverIndex(null);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      if (dragIndex !== null && dragIndex !== index) {
        onReorder(move(dragIndex, index));
      }
      setDragIndex(null);
      setOverIndex(null);
    },
  });

  /**
   * Reorder without a mouse — for nudge buttons and keyboard shortcuts, which
   * are the only way to reach this on a trackpad-hostile setup.
   */
  const moveTo = (from: number, to: number) => {
    if (from === to || to < 0 || to >= items.length) return;
    onReorder(move(from, to));
  };

  const dropIndicatorClass = (index: number) =>
    overIndex === index && dragIndex !== null && dragIndex !== index
      ? "ring-2 ring-primary ring-offset-2 rounded-xl"
      : dragIndex === index
        ? "opacity-40"
        : "";

  return { dragProps, dropIndicatorClass, moveTo, isDragging: dragIndex !== null };
}
