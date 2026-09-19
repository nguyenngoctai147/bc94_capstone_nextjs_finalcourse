"use client";
import { useId, type SelectHTMLAttributes } from "react";
type Props = SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; options: { label: string; value: string | number }[] };
export function Select({ label, error, options, id, className = "", ...props }: Props) {
  const generated = useId(); const fieldId = id ?? generated;
  return <div className="mb-3"><label htmlFor={fieldId} className="form-label">{label}</label>
    <select {...props} id={fieldId} className={`form-select ${error ? "is-invalid" : ""} ${className}`} aria-invalid={!!error} aria-describedby={[props["aria-describedby"], error ? `${fieldId}-error` : ""].filter(Boolean).join(" ") || undefined}>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>{error && <div id={`${fieldId}-error`} className="invalid-feedback">{error}</div>}
  </div>;
}
