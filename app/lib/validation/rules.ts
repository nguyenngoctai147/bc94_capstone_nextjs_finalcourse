export type Validator<T> = (value: string, values: T) => string | undefined;
export type ValidationSchema<T> = { [K in keyof T]?: Validator<T>[] };
export type FormErrors<T> = Partial<Record<keyof T, string>>;
export function validate<T extends Record<string, string>>(values: T, schema: ValidationSchema<T>): FormErrors<T> {
  const errors: FormErrors<T> = {};
  for (const key of Object.keys(schema) as (keyof T)[]) {
    for (const rule of schema[key] ?? []) {
      const message = rule(values[key], values);
      if (message) { errors[key] = message; break; }
    }
  }
  return errors;
}
export const required = (message = "Vui lòng nhập trường này.") => (value: string) => value.trim() ? undefined : message;
export const email = (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "Email không hợp lệ.";
export const minLength = (length: number) => (value: string) => !value || value.length >= length ? undefined : `Cần ít nhất ${length} ký tự.`;
export const phone = (value: string) => !value || /^\+?[\d\s()-]{9,15}$/.test(value) ? undefined : "Số điện thoại không hợp lệ.";
export const positiveInteger = (value: string) => Number.isInteger(Number(value)) && Number(value) > 0 ? undefined : "Vui lòng nhập số nguyên lớn hơn 0.";
export const validDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Ngày không hợp lệ.";
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? "Ngày không hợp lệ." : undefined;
};
export const localToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
