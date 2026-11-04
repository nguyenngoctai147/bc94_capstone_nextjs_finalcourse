"use client";

import { useState, type ChangeEvent } from "react";
import { AdminPageHeader } from "@/component/admin";
import { Alert, Button, Input, Select } from "@/component/ui";
import { routes } from "@/route";
import { hydrateSession } from "@/store/slice/auth";
import { useForm } from "@/hooks/useForm";
import { toApiError } from "@/services/api-utils";
import { required, email, phone, validDate, localToday } from "@/commons/validation/rules";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usersService } from "../users.service";
import { updateUser } from "@/store/thunk/user";
import type { User } from "@/store/type/user";

type ProfileValues = {
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

export function AdminAccountPage() {
  const { user, token } = useAppSelector((state) => state.auth);
  if (!user || !token) return null;

  return <ProfileForm key={user.id} user={user} token={token} />;
}

function ProfileForm({ user, token }: { user: User; token: string }) {
  const dispatch = useAppDispatch();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<{ variant: "success" | "danger"; message: string } | null>(null);
  const form = useForm<ProfileValues>({
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    birthday: toDateInput(user.birthday),
    gender: String(user.gender),
    role: user.role,
  }, {
    name: [required()],
    email: [required(), email],
    phone: [phone],
    birthday: [required(), validDate, (value) => value <= localToday() ? undefined : "Ngày sinh không được ở tương lai."],
    role: [required()],
  });

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAvatar(event.target.files?.[0] ?? null);
  };

  const handleSaveProfile = form.handleSubmit(async (values) => {
    setFeedback(null);
    try {
      const updatedUser = await dispatch(updateUser({
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

      if (avatar) await usersService.uploadAvatar(avatar, { token });
      dispatch(hydrateSession({ user: { ...user, ...updatedUser }, token }));
      setAvatar(null);
      setFeedback({ variant: "success", message: "Đã lưu thông tin tài khoản." });
    } catch (error) {
      setFeedback({ variant: "danger", message: toApiError(error).message });
    }
  });

  return (
    <>
      <AdminPageHeader
        title="Tài khoản quản trị"
        description="Cập nhật thông tin và ảnh đại diện của tài khoản đang đăng nhập."
        breadcrumbs={[{ label: "Tổng quan", href: routes.admin.dashboard }, { label: "Tài khoản quản trị" }]}
      />
      <div className="card">
        <div className="card-body">
          <h2 className="h5 mb-4">Thông tin tài khoản</h2>
          {feedback && <Alert variant={feedback.variant}>{feedback.message}</Alert>}
          <form className="forms-sample" noValidate onSubmit={handleSaveProfile}>
            <div className="row">
              <div className="col-lg-6">
                <Input label="Ảnh đại diện" type="file" accept="image/*" onChange={handleAvatarChange} />
              </div>
              <div className="col-lg-6"><Input label="Mã tài khoản" value={user.id} disabled /></div>
              <div className="col-lg-6">
                <Input label="Họ tên" name="name" autoComplete="name" required
                  value={form.values.name} error={form.errors.name} onChange={form.handleChange} onBlur={form.handleBlur} />
              </div>
              <div className="col-lg-6">
                <Input label="Email" name="email" type="email" autoComplete="email" required
                  value={form.values.email} error={form.errors.email} onChange={form.handleChange} onBlur={form.handleBlur} />
              </div>
              <div className="col-lg-6">
                <Input label="Số điện thoại" name="phone" type="tel" autoComplete="tel"
                  value={form.values.phone} error={form.errors.phone} onChange={form.handleChange} onBlur={form.handleBlur} />
              </div>
              <div className="col-lg-6">
                <Input label="Ngày sinh" name="birthday" type="date" autoComplete="bday" required
                  value={form.values.birthday} error={form.errors.birthday} onChange={form.handleChange} onBlur={form.handleBlur} />
              </div>
              <div className="col-lg-6">
                <Select label="Giới tính" name="gender" options={[{ value: "true", label: "Nam" }, { value: "false", label: "Nữ" }]}
                  value={form.values.gender} error={form.errors.gender} onChange={form.handleChange} onBlur={form.handleBlur} />
              </div>
              <div className="col-lg-6">
                <Select label="Vai trò" name="role" options={[{ value: "ADMIN", label: "ADMIN" }, { value: "USER", label: "USER" }]}
                  value={form.values.role} error={form.errors.role} onChange={form.handleChange} onBlur={form.handleBlur} />
              </div>
            </div>
            <Button type="submit" loading={form.submitting}>Lưu tài khoản</Button>
          </form>
        </div>
      </div>
    </>
  );
}

export const CompanyProfilePage = AdminAccountPage;
