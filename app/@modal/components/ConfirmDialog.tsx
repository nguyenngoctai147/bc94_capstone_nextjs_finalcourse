"use client";

import { useEffect, useId, type ReactNode } from "react";
import { Button } from "@/component/ui/Button";

export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = "Quay lại",
  loading = false,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onClose();
    };

    document.body.classList.add("modal-open");
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleEscape);
    };
  }, [loading, onClose, open]);

  if (!open) return null;

  return (
    <>
      <div
        className="modal fade show"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ display: "block" }}
        onMouseDown={(event) => {
          if (event.currentTarget === event.target && !loading) onClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5" id={titleId}>
                {title}
              </h2>
              <button
                className="btn-close"
                type="button"
                disabled={loading}
                aria-label="Đóng"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <Button
                variant="outline-secondary"
                disabled={loading}
                onClick={onClose}
              >
                {cancelLabel}
              </Button>
              <Button variant="danger" loading={loading} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" aria-hidden="true" />
    </>
  );
}
