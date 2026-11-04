"use client";

import Link from "next/link";
import { Alert, Button, Input, Select } from "@/component/ui";
import { useForm } from "@/hooks/useForm";
import {
  email,
  minLength,
  phone,
  required,
  validDate,
  localToday,
} from "@/commons/validation/rules";
import { routes } from "@/route";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { register } from "@/store/thunk/auth";

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

  const handleRegister = form.handleSubmit(async (values) => {
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
  });

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
      <form noValidate onSubmit={handleRegister}>
        <Input
          label="Họ tên"
          autoComplete="name"
          required
          name="name"
          value={form.values.name}
          error={form.errors.name}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          name="email"
          value={form.values.email}
          error={form.errors.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
        <Input
          label="Số điện thoại"
          type="tel"
          autoComplete="tel"
          required
          name="phone"
          value={form.values.phone}
          error={form.errors.phone}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
        <Input
          label="Ngày sinh"
          type="date"
          autoComplete="bday"
          required
          name="birthday"
          value={form.values.birthday}
          error={form.errors.birthday}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
        <Select
          label="Giới tính"
          options={[
            { value: "true", label: "Nam" },
            { value: "false", label: "Nữ" },
          ]}
          name="gender"
          value={form.values.gender}
          error={form.errors.gender}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
        <Input
          label="Mật khẩu"
          type="password"
          autoComplete="new-password"
          required
          hint="Tối thiểu 8 ký tự theo quy tắc form mẫu."
          name="password"
          value={form.values.password}
          error={form.errors.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
        <Input
          label="Xác nhận mật khẩu"
          type="password"
          autoComplete="new-password"
          required
          name="confirmPassword"
          value={form.values.confirmPassword}
          error={form.errors.confirmPassword}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
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
