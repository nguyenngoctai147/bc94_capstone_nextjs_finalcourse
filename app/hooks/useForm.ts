"use client";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { validate, type FormErrors, type ValidationSchema } from "@/lib/validation/rules";
export function useForm<T extends Record<string, string>>(initialValues: T, schema: ValidationSchema<T>) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [submitting, setSubmitting] = useState(false);
  const locked = useRef(false);
  function field(name: keyof T) {
    return {
      name: String(name), value: values[name], error: errors[name],
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const next = { ...values, [name]: event.target.value };
        setValues(next);
        if (errors[name]) setErrors(validate(next, schema));
      },
      onBlur: () => setErrors((previous) => ({ ...previous, [name]: validate(values, schema)[name] })),
    };
  }
  function handleSubmit(onValid: (values: T) => void | Promise<void>) {
    return async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (locked.current) return;
      const nextErrors = validate(values, schema); setErrors(nextErrors);
      if (Object.keys(nextErrors).length) {
        const first = Object.keys(nextErrors)[0];
        const element = event.currentTarget.elements.namedItem(first);
        if (element instanceof HTMLElement) element.focus();
        return;
      }
      locked.current = true; setSubmitting(true);
      try { await onValid(values); }
      finally { locked.current = false; setSubmitting(false); }
    };
  }
  return { values, setValues, errors, setErrors, field, handleSubmit, submitting, reset: () => { setValues(initialValues); setErrors({}); } };
}
