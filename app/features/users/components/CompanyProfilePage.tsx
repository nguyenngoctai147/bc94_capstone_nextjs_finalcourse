"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Alert } from "@/components/ui";
import { Icon } from "@/components/admin";
import { routes } from "@/config/routes";
import { hydrateSession } from "@/features/auth/auth.slice";
import { toApiError } from "@/lib/api/errors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usersService } from "../users.service";
import { usersThunks } from "../users.thunks";

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: "true" | "false";
  role: string;
};

function toDateInput(value: string) {
  const isoDate = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) return `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`;
  const localDate = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return localDate ? `${localDate[3]}-${localDate[2]}-${localDate[1]}` : "";
}

export function CompanyProfilePage() {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ variant: "success" | "danger"; message: string } | null>(null);
  const [form, setForm] = useState<ProfileForm>(() => ({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    birthday: toDateInput(user?.birthday ?? ""),
    gender: user?.gender ? "true" : "false",
    role: user?.role ?? "USER",
  }));

  if (!user || !token) return null;

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const updatedUser = await dispatch(usersThunks.update({
        id: user.id,
        data: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          birthday: form.birthday,
          gender: form.gender === "true",
          role: form.role,
        },
      })).unwrap();
      if (avatar) await usersService.uploadAvatar(avatar, { token });
      dispatch(hydrateSession({ user: { ...user, ...updatedUser }, token }));
      setAvatar(null);
      setFeedback({ variant: "success", message: "Profile saved successfully." });
    } catch (error) {
      setFeedback({ variant: "danger", message: toApiError(error).message });
    } finally {
      setSubmitting(false);
    }
  };

  return <>
    <nav className="page-breadcrumb d-flex align-items-center justify-content-between">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item"><Link href={routes.admin.dashboard}>Dashboard</Link></li>
        <li className="breadcrumb-item"><Link href={routes.admin.users}>User Management</Link></li>
        <li className="breadcrumb-item active" aria-current="page">Company Profile</li>
      </ol>
    </nav>

    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h4 className="mb-4">Company Profile</h4>
            {feedback && <Alert variant={feedback.variant}>{feedback.message}</Alert>}
            <form className="forms-sample" onSubmit={saveProfile}>
              <div className="row">
                <div className="col-lg-6 mb-3">
                  <label htmlFor="upload" className="form-label">Upload Avatar</label>
                  <input className="form-control" type="file" id="upload" accept="image/*" onChange={(event) => setAvatar(event.target.files?.[0] ?? null)} />
                </div>
                <div className="col-lg-6 mb-3">
                  <label htmlFor="accountId" className="form-label">Account ID</label>
                  <input type="text" className="form-control" id="accountId" value={user.id} disabled />
                </div>
                <div className="col-lg-6 mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input type="text" className="form-control" id="name" name="name" autoComplete="name" value={form.name} onChange={updateField} required />
                </div>
                <div className="col-lg-6 mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" className="form-control" id="email" name="email" autoComplete="email" value={form.email} onChange={updateField} required />
                </div>
                <div className="col-lg-6 mb-3">
                  <label htmlFor="phoneno" className="form-label">Phone No.</label>
                  <input type="tel" className="form-control" id="phoneno" name="phone" autoComplete="tel" value={form.phone} onChange={updateField} />
                </div>
                <div className="col-lg-6 mb-3">
                  <label htmlFor="birthday" className="form-label">Birthday</label>
                  <input type="date" className="form-control" id="birthday" name="birthday" autoComplete="bday" value={form.birthday} onChange={updateField} required />
                </div>
                <div className="col-lg-6 mb-3">
                  <label htmlFor="gender" className="form-label">Gender</label>
                  <select className="form-select form-select-lg" id="gender" name="gender" value={form.gender} onChange={updateField}><option value="true">Male</option><option value="false">Female</option></select>
                </div>
                <div className="col-lg-6 mb-3">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select className="form-select form-select-lg" id="role" name="role" value={form.role} onChange={updateField}><option value="ADMIN">ADMIN</option><option value="USER">USER</option></select>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-icon-text"
                    disabled={submitting}
                    aria-busy={submitting}
                  >
                    <Icon className="btn-icon-prepend" name="plus" />
                    {submitting ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>;
}
