"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import {
  validate,
  type FormErrors,
  type ValidationSchema,
} from "@/lib/validation/rules";

type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export function useForm<T extends Record<string, string>>(
  initialValues: T,
  schema: ValidationSchema<T>,
) {
  // State của form: dữ liệu nhập, lỗi validation và trạng thái gửi.
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);

  const handleChange = (event: ChangeEvent<FormControl>) => {
    const { name, value } = event.currentTarget;
    if (!(name in values)) return;

    const nextValues = { ...values, [name]: value };
    setValues(nextValues);

    // Kiểm tra lại khi sửa lỗi, kể cả rule phụ thuộc field khác như confirmPassword.
    if (Object.keys(errors).length > 0) {
      setErrors(validate(nextValues, schema));
    }
  };

  const handleBlur = (event: FocusEvent<FormControl>) => {
    // Reset xóa cả dữ liệu và lỗi; không thêm lỗi blur làm dịch chuyển nút.
    if (
      event.relatedTarget instanceof HTMLButtonElement &&
      event.relatedTarget.type === "reset"
    ) {
      return;
    }

    const name = event.currentTarget.name as keyof T;
    if (!(name in values)) return;

    const nextErrors = validate(values, schema);
    setErrors((currentErrors) => {
      const updatedErrors = { ...currentErrors };
      if (nextErrors[name]) {
        updatedErrors[name] = nextErrors[name];
      } else {
        delete updatedErrors[name];
      }
      return updatedErrors;
    });
  };

  const handleSubmit = (onValid: (formValues: T) => void | Promise<void>) => {
    return async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (submitLock.current) return;

      const nextErrors = validate(values, schema);
      setErrors(nextErrors);

      if (Object.keys(nextErrors).length > 0) {
        const firstField = Object.keys(nextErrors)[0];
        const input = event.currentTarget.elements.namedItem(firstField);
        if (input instanceof HTMLElement) input.focus();
        return;
      }

      submitLock.current = true;
      setSubmitting(true);
      try {
        await onValid(values);
      } finally {
        submitLock.current = false;
        setSubmitting(false);
      }
    };
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    submitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}
