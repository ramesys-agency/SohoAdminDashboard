import React, { useEffect } from "react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
  icon?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
  icon,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const iconName =
    icon ||
    (variant === "danger"
      ? "warning"
      : variant === "warning"
      ? "error"
      : "info");

  const iconBg =
    variant === "danger"
      ? "bg-red-100 text-red-600"
      : variant === "warning"
      ? "bg-amber-100 text-amber-600"
      : "bg-blue-100 text-blue-600";

  const btnBg =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
      : variant === "warning"
      ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
      : "bg-primary hover:bg-primary/90 shadow-primary/20";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => !isLoading && onClose()}
      />
      {/* Dialog card */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-slate-100 z-10 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shrink-0 shadow-sm`}
          >
            <span className="material-symbols-outlined text-2xl">
              {iconName}
            </span>
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {title}
            </h3>
            <div className="text-sm text-slate-500 mt-1 leading-relaxed">
              {message}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold ${btnBg} transition-all shadow-md disabled:opacity-50 flex items-center gap-2`}
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
