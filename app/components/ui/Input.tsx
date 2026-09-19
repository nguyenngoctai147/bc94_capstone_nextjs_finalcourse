"use client";
import { useId, type InputHTMLAttributes } from "react";
type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};
export function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: Props) {
  const generated = useId();
  const fieldId = id ?? generated;
  const description =
    [
      props["aria-describedby"],
      hint ? `${fieldId}-hint` : "",
      error ? `${fieldId}-error` : "",
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className="mb-3">
      <label htmlFor={fieldId} className="form-label">
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        {...props}
        id={fieldId}
        className={`form-control ${error ? "is-invalid" : ""} ${className}`}
        aria-invalid={!!error}
        aria-describedby={description}
      />
      {hint && (
        <div id={`${fieldId}-hint`} className="form-text">
          {hint}
        </div>
      )}
      {error && (
        <div id={`${fieldId}-error`} className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
}
