"use client";
import Link from "next/link";
import { Alert, Button, Input, Select } from "@/components/ui";
import { useForm } from "@/hooks/useForm";
import {
  email,
  minLength,
  phone,
  required,
  validDate,
  localToday,
} from "@/lib/validation/rules";
import { routes } from "@/config/routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { register } from "../auth.thunks";
export function RegisterForm() {
  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.auth.register);
  const form = useForm(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      birthday: "",
      gender: "true",
    },
    {
      name: [required()],
      email: [required(), email],
      password: [required(), minLength(8)],
      confirmPassword: [
        required(),
        (value, values) =>
          value === values.password
            ? undefined
            : "Mật khẩu xác nhận chưa khớp.",
      ],
      phone: [required(), phone],
      birthday: [
        required(),
        validDate,
        (value) =>
          value <= localToday()
            ? undefined
            : "Ngày sinh không được ở tương lai.",
      ],
    },
  );
  return (
    <>
      <h1 className="h3 mb-4">Tạo tài khoản</h1>
      {request.error && <Alert variant="danger">{request.error.message}</Alert>}
      {request.status === "succeeded" && (
        <Alert variant="success">
          Đăng ký thành công. Bạn có thể{" "}
          <Link href={routes.auth.login}>đăng nhập</Link>.
        </Alert>
      )}
      <form
        noValidate
        onSubmit={form.handleSubmit(async (values) => {
          const { name, email, password, phone, birthday, gender } = values;
          const result = await dispatch(
            register({
              name,
              email,
              password,
              phone,
              birthday,
              gender: gender === "true",
            }),
          );
          if (register.fulfilled.match(result)) form.reset();
        })}
      >
        <Input
          label="Họ tên"
          autoComplete="name"
          required
          {...form.field("name")}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          {...form.field("email")}
        />
        <Input
          label="Số điện thoại"
          type="tel"
          autoComplete="tel"
          required
          {...form.field("phone")}
        />
        <Input
          label="Ngày sinh"
          type="date"
          autoComplete="bday"
          required
          {...form.field("birthday")}
        />
        <Select
          label="Giới tính"
          options={[
            { value: "true", label: "Nam" },
            { value: "false", label: "Nữ" },
          ]}
          {...form.field("gender")}
        />
        <Input
          label="Mật khẩu"
          type="password"
          autoComplete="new-password"
          required
          hint="Tối thiểu 8 ký tự theo quy tắc form mẫu."
          {...form.field("password")}
        />
        <Input
          label="Xác nhận mật khẩu"
          type="password"
          autoComplete="new-password"
          required
          {...form.field("confirmPassword")}
        />
        <Button type="submit" loading={form.submitting} className="w-100">
          Đăng ký
        </Button>
      </form>
      <p className="mt-4 mb-0">
        Đã có tài khoản? <Link href={routes.auth.login}>Đăng nhập</Link>
      </p>
    </>
  );
}
