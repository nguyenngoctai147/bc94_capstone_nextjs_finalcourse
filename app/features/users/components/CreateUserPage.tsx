"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminPageHeader, Icon } from "@/component/admin";
import { Alert, Button, Input, Select } from "@/component/ui";
import { routes } from "@/route";
import { useForm } from "@/hooks/useForm";
import { toApiError } from "@/services/api-utils";
import { email, localToday, minLength, phone, required, validDate } from "@/commons/validation/rules";
import { useAppDispatch } from "@/store/hooks";
import { createUser } from "@/store/thunk/user";

type CreateUserValues = {
  name: string;
  email: string;
  password: string;
  phone: string;
  birthday: string;
  gender: string;
  role: string;
};

const initialValues: CreateUserValues = {
  name: "",
  email: "",
  password: "",
  phone: "",
  birthday: "",
  gender: "true",
  role: "USER",
};

export function CreateUserPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const form = useForm<CreateUserValues>(initialValues, {
    name: [required("Vui lòng nhập họ tên.")],
    email: [required("Vui lòng nhập email."), email],
    password: [required("Vui lòng nhập mật khẩu."), minLength(6)],
    phone: [phone],
    birthday: [
      required("Vui lòng chọn ngày sinh."),
      validDate,
      (value) => value <= localToday() ? undefined : "Ngày sinh không được ở tương lai.",
    ],
    gender: [required()],
    role: [required()],
  });

  const handleCreateUser = form.handleSubmit(async (values) => {
    setSubmitError("");
    try {
      const user = await dispatch(createUser({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        phone: values.phone.trim(),
        birthday: values.birthday,
        gender: values.gender === "true",
        role: values.role,
      })).unwrap();
      router.push(routes.admin.userDetail(user.id));
    } catch (error) {
      setSubmitError(toApiError(error).message);
    }
  });

  return (
    <>
      <AdminPageHeader
        title="Thêm người dùng"
        description="Tạo hồ sơ mới và phân quyền truy cập cho người dùng."
        breadcrumbs={[
          { label: "Tổng quan", href: routes.admin.dashboard },
          { label: "Người dùng", href: routes.admin.users },
          { label: "Thêm người dùng" },
        ]}
        action={<Link href={routes.admin.users} className="btn btn-outline-primary"><Icon className="me-1" name="arrow-left" size={18} />Quay lại danh sách</Link>}
      />

      <div className="row">
        <div className="col-xl-8 col-lg-10 grid-margin stretch-card">
          <div className="card w-100">
            <div className="card-body">
              <h2 className="h5 mb-4">Thông tin tài khoản</h2>
              {submitError && <Alert variant="danger">{submitError}</Alert>}
              <form className="forms-sample" noValidate onSubmit={handleCreateUser}>
                <div className="row">
                  <div className="col-lg-6">
                    <Input label="Họ tên" name="name" autoComplete="name" required value={form.values.name} error={form.errors.name} onChange={form.handleChange} onBlur={form.handleBlur} />
                  </div>
                  <div className="col-lg-6">
                    <Input label="Email" name="email" type="email" autoComplete="email" required value={form.values.email} error={form.errors.email} onChange={form.handleChange} onBlur={form.handleBlur} />
                  </div>
                  <div className="col-lg-6">
                    <Input label="Mật khẩu" name="password" type="password" autoComplete="new-password" required hint="Tối thiểu 6 ký tự." value={form.values.password} error={form.errors.password} onChange={form.handleChange} onBlur={form.handleBlur} />
                  </div>
                  <div className="col-lg-6">
                    <Input label="Số điện thoại" name="phone" type="tel" autoComplete="tel" value={form.values.phone} error={form.errors.phone} onChange={form.handleChange} onBlur={form.handleBlur} />
                  </div>
                  <div className="col-lg-6">
                    <Input label="Ngày sinh" name="birthday" type="date" max={localToday()} autoComplete="bday" required value={form.values.birthday} error={form.errors.birthday} onChange={form.handleChange} onBlur={form.handleBlur} />
                  </div>
                  <div className="col-lg-3">
                    <Select label="Giới tính" name="gender" options={[{ value: "true", label: "Nam" }, { value: "false", label: "Nữ" }]} value={form.values.gender} error={form.errors.gender} onChange={form.handleChange} onBlur={form.handleBlur} />
                  </div>
                  <div className="col-lg-3">
                    <Select label="Vai trò" name="role" options={[{ value: "USER", label: "USER" }, { value: "ADMIN", label: "ADMIN" }]} value={form.values.role} error={form.errors.role} onChange={form.handleChange} onBlur={form.handleBlur} />
                  </div>
                </div>
                <div className="d-flex gap-2 mt-2">
                  <Button type="submit" loading={form.submitting}>Tạo người dùng</Button>
                  <Button type="reset" variant="outline-secondary" disabled={form.submitting} onClick={form.reset}>Làm lại</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
