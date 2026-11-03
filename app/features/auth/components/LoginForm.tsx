"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Alert } from "@/components/ui";
import { routes } from "@/config/routes";
import { useForm } from "@/hooks/useForm";
import { required, email } from "@/lib/validation/rules";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "../auth.slice";
import { getPostLoginPath } from "../auth-navigation";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const request = useAppSelector((state) => state.auth.login);
  const form = useForm(
    { email: "", password: "" },
    { email: [required(), email], password: [required()] },
  );

  const handleLogin = form.handleSubmit(async (values) => {
    const result = await dispatch(login(values));
    if (!login.fulfilled.match(result)) return;

    router.replace(
      getPostLoginPath(
        result.payload.user.role,
        searchParams.get("next"),
      ),
    );
  });

  return (
    <>
      <h1 className="h3 mb-2">Chào mừng trở lại</h1>
      <p className="text-muted mb-4">Đăng nhập để quản lý chuyến đi của bạn.</p>
      {request.error && <Alert variant="danger">{request.error.message}</Alert>}
      <form noValidate onSubmit={handleLogin}>
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
          label="Mật khẩu"
          type="password"
          autoComplete="current-password"
          required
          name="password"
          value={form.values.password}
          error={form.errors.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
        <div className="text-end mb-3">
          <Link href={routes.auth.forgotPassword}>Quên mật khẩu?</Link>
        </div>
        <Button type="submit" loading={form.submitting} className="w-100">
          Đăng nhập
        </Button>
      </form>
      <p className="mt-4 mb-0">
        Chưa có tài khoản? <Link href={routes.auth.register}>Đăng ký</Link>
      </p>
    </>
  );
}
