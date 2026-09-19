"use client";
import { useId, type TextareaHTMLAttributes } from "react";
type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string };
export function Textarea({ label, error, id, className = "", ...props }: Props) {
  const generated = useId(); const fieldId = id ?? generated;
  return <div className="mb-3"><label htmlFor={fieldId} className="form-label">{label}</label>
    <textarea rows={4} {...props} id={fieldId} className={`form-control ${error ? "is-invalid" : ""} ${className}`} aria-invalid={!!error} aria-describedby={[props["aria-describedby"], error ? `${fieldId}-error` : ""].filter(Boolean).join(" ") || undefined} />
    {error && <div id={`${fieldId}-error`} className="invalid-feedback">{error}</div>}
  </div>;
}
