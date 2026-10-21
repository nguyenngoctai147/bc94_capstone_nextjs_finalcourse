"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminPageHeader, Icon } from "@/components/admin";
import { Alert, Button, Input, LoadingSpinner, Select } from "@/components/ui";
import { ApiImage } from "@/components/ui/ApiImage";
import { routes } from "@/config/routes";
import { useForm } from "@/hooks/useForm";
import { toApiError } from "@/lib/api/errors";
import { email, localToday, phone, required, validDate } from "@/lib/validation/rules";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserDetail, updateUser } from "../users.slice";
import type { User } from "../users.types";

type UserDetailValues = {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: string;
  role: string;
};

const toDateInput = (value: string) => {
  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) return `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`;
  const localDate = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return localDate ? `${localDate[3]}-${localDate[2]}-${localDate[1]}` : "";
};

export function UserDetailPage({ id }: { id: number }) {
  const dispatch = useAppDispatch();
  const { selected, request } = useAppSelector((state) => ({
    selected: state.users.selected?.id === id ? state.users.selected : null,
    request: state.users.requests.detail,
  }));

  useEffect(() => {
    const task = dispatch(fetchUserDetail(id));
    return () => task.abort();
  }, [dispatch, id]);

  return (
    <>
      <AdminPageHeader
        title={selected?.name ?? `Người dùng #${id}`}
        description="Xem và cập nhật hồ sơ người dùng trên hệ thống."
        breadcrumbs={[
          { label: "Tổng quan", href: routes.admin.dashboard },
          { label: "Người dùng", href: routes.admin.users },
          { label: `#${id}` },
        ]}
        action={<Link href={routes.admin.users} className="btn btn-outline-primary"><Icon className="me-1" name="arrow-left" size={18} />Quay lại danh sách</Link>}
      />

      {(request.status === "idle" || request.status === "loading") && (
        <div className="card"><div className="card-body"><LoadingSpinner label="Đang tải hồ sơ người dùng" /></div></div>
      )}
      {request.status === "failed" && (
        <Alert variant="danger">{request.error?.message ?? "Không tải được hồ sơ người dùng."}</Alert>
      )}
      {selected && <UserProfileForm key={`${selected.id}-${selected.email}`} user={selected} />}
    </>
  );
}

function UserProfileForm({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const [feedback, setFeedback] = useState<{ variant: "success" | "danger"; message: string } | null>(null);
  const form = useForm<UserDetailValues>({
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    birthday: toDateInput(user.birthday),
    gender: String(user.gender),
    role: user.role,
  }, {
    name: [required("Vui lòng nhập họ tên.")],
    email: [required("Vui lòng nhập email."), email],
    phone: [phone],
    birthday: [required(), validDate, (value) => value <= localToday() ? undefined : "Ngày sinh không được ở tương lai."],
    gender: [required()],
    role: [required()],
  });

  const handleUpdateUser = form.handleSubmit(async (values) => {
    setFeedback(null);
    try {
      await dispatch(updateUser({
        id: user.id,
        data: {
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          birthday: values.birthday,
          gender: values.gender === "true",
          role: values.role,
        },
      })).unwrap();
      await dispatch(fetchUserDetail(user.id)).unwrap();
      setFeedback({ variant: "success", message: "Đã cập nhật hồ sơ người dùng." });
    } catch (error) {
      setFeedback({ variant: "danger", message: toApiError(error).message });
    }
  });

  return (
    <div className="row profile-body">
      <div className="col-lg-4 grid-margin stretch-card">
        <div className="card w-100 rounded">
          <div className="card-body text-center">
            <ApiImage
              className="wd-100 ht-100 rounded-circle object-fit-cover mb-3"
              src={user.avatar}
              alt={`Ảnh đại diện của ${user.name}`}
              width={100}
              height={100}
              fallback={<span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light wd-100 ht-100 mb-3"><Icon name="user" size={38} /></span>}
            />
            <h2 className="h4 mb-1">{form.values.name || user.name}</h2>
            <p className="text-muted mb-4">{form.values.email || user.email}</p>
            <dl className="text-start mb-0">
              <div className="mb-3"><dt className="text-uppercase tx-11">Mã người dùng</dt><dd className="mb-0">#{user.id}</dd></div>
              <div className="mb-3"><dt className="text-uppercase tx-11">Điện thoại</dt><dd className="mb-0">{form.values.phone || "Chưa cập nhật"}</dd></div>
              <div className="mb-3"><dt className="text-uppercase tx-11">Ngày sinh</dt><dd className="mb-0">{form.values.birthday || "Chưa cập nhật"}</dd></div>
              <div><dt className="text-uppercase tx-11">Vai trò</dt><dd className="mb-0"><span className={`badge ${form.values.role === "ADMIN" ? "bg-primary" : "bg-secondary"}`}>{form.values.role}</span></dd></div>
            </dl>
          </div>
        </div>
      </div>

      <div className="col-lg-8 grid-margin stretch-card">
        <div className="card w-100">
          <div className="card-body">
            <h2 className="h5 mb-4">Thông tin hồ sơ</h2>
            {feedback && <Alert variant={feedback.variant}>{feedback.message}</Alert>}
            <form className="forms-sample" noValidate onSubmit={handleUpdateUser}>
              <div className="row">
                <div className="col-lg-6"><Input label="Họ tên" name="name" autoComplete="name" required value={form.values.name} error={form.errors.name} onChange={form.handleChange} onBlur={form.handleBlur} /></div>
                <div className="col-lg-6"><Input label="Email" name="email" type="email" autoComplete="email" required value={form.values.email} error={form.errors.email} onChange={form.handleChange} onBlur={form.handleBlur} /></div>
                <div className="col-lg-6"><Input label="Số điện thoại" name="phone" type="tel" autoComplete="tel" value={form.values.phone} error={form.errors.phone} onChange={form.handleChange} onBlur={form.handleBlur} /></div>
                <div className="col-lg-6"><Input label="Ngày sinh" name="birthday" type="date" max={localToday()} autoComplete="bday" required value={form.values.birthday} error={form.errors.birthday} onChange={form.handleChange} onBlur={form.handleBlur} /></div>
                <div className="col-lg-6"><Select label="Giới tính" name="gender" options={[{ value: "true", label: "Nam" }, { value: "false", label: "Nữ" }]} value={form.values.gender} error={form.errors.gender} onChange={form.handleChange} onBlur={form.handleBlur} /></div>
                <div className="col-lg-6"><Select label="Vai trò" name="role" options={[{ value: "USER", label: "USER" }, { value: "ADMIN", label: "ADMIN" }]} value={form.values.role} error={form.errors.role} onChange={form.handleChange} onBlur={form.handleBlur} /></div>
              </div>
              <Button type="submit" loading={form.submitting}>Lưu thay đổi</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
