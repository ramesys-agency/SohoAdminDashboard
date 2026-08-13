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
    onDragStart: () => setDragIndex(index),
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
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

  const dropIndicatorClass = (index: number) =>
    overIndex === index && dragIndex !== null && dragIndex !== index
      ? "ring-2 ring-primary ring-offset-2 rounded-xl"
      : dragIndex === index
        ? "opacity-40"
        : "";

  return { dragProps, dropIndicatorClass, isDragging: dragIndex !== null };
}
