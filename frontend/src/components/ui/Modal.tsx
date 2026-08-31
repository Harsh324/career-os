"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  footerActions?: React.ReactNode;
}

const MAX_WIDTH_CLASSES: Record<NonNullable<ModalProps["maxWidth"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  maxWidth = "3xl",
  footerActions,
}: ModalProps) {
  // Handle Escape key to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    // Attach key listener
    window.addEventListener("keydown", handleKeyDown);

    // Prevent body scroll when modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${
          MAX_WIDTH_CLASSES[maxWidth]
        } my-8 rounded-2xl bg-white dark:bg-[#161b22] border border-[#d0d7de] dark:border-[#30363d] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/80 dark:bg-[#0d1117]/80 backdrop-blur-md flex-shrink-0">
          <div className="space-y-0.5 min-w-0 pr-4">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm sm:text-base font-bold text-[#24292f] dark:text-[#f0f6fc] truncate">
                {title}
              </h2>
              {badge}
            </div>
            {subtitle && (
              <p className="text-xs text-[#57606a] dark:text-[#8b949e] font-sans truncate">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-[#57606a] dark:text-[#8b949e] hover:text-[#24292f] dark:hover:text-[#f0f6fc] hover:bg-[#eaeef2] dark:hover:bg-[#30363d] transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans">{children}</div>

        {/* Optional Footer Actions */}
        {footerActions && (
          <div className="px-6 py-3.5 border-t border-[#d0d7de] dark:border-[#30363d] bg-[#f6f8fa]/80 dark:bg-[#0d1117]/80 backdrop-blur-md flex items-center justify-between gap-3 flex-shrink-0">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
}
