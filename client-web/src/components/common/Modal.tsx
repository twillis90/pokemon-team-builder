import { useEffect, useRef } from "react";

import { createPortal } from "react-dom";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg";
    accent?: boolean;
};

const sizeClass: Record<NonNullable<ModalProps["size"]>, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    accent = true,
}: ModalProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if(!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if(e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        if(isOpen) panelRef.current?.focus();
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen) return;
    
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    
      const cleanup = () => {
        document.body.style.overflow = prevOverflow || "";
      };
    
      // cleanup on isOpen change or component unmount
      return cleanup;
    }, [isOpen]);
      
      if(!isOpen) return null;

      return createPortal(
        <div
        className="fixed inset-0 z-50"
        aria-hidden={!isOpen}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
  
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            tabIndex={-1}
            className={[
              "w-full", sizeClass[size],
              "relative rounded-xl border border-slate-800 bg-slate-900 shadow-xl outline-none",
            ].join(" ")}
            onClick={(e) => e.stopPropagation()}
          >
            {accent && (
              <>
                <div className="absolute inset-x-0 top-0 h-2 bg-red-600 rounded-t-xl" />
                <div className="absolute inset-x-0 top-2 h-px bg-white/70" />
              </>
            )}
  
            <div className="flex items-start justify-between gap-4 p-4 pt-5">
              {title ? (
                <h2 id="modal-title" className="text-lg font-semibold text-slate-100">
                  {title}
                </h2>
              ) : (
                <span className="sr-only" id="modal-title">Dialog</span>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-slate-300 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Close dialog"
                title="Close"
              >
                ✕
              </button>
            </div>
  
            <div className="px-4 pb-5">
              {children}
            </div>
          </div>
        </div>
      </div>,
      document.body
      )
}