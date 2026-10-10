"use client";

import Image from "next/image";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Icon } from "@/components/admin";

type UserDetailForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
};

const initialForm: UserDetailForm = {
  firstName: "Amiah",
  lastName: "Burton",
  email: "me@foneui.com",
  phone: "+00 1234 5678 9",
  username: "amiahburton",
  password: "",
};

export function UserDetailPage() {
  const [form, setForm] = useState<UserDetailForm>(initialForm);
  const [selectedImage, setSelectedImage] = useState("");
  const [saved, setSaved] = useState(false);
  const fullName = `${form.firstName} ${form.lastName}`.trim() || "Amiah Burton";

  const updateField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSaved(false);
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateImage = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(event.target.files?.[0]?.name ?? "");
    setSaved(false);
  };

  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <>
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="position-relative rounded overflow-hidden">
              <figure className="profile-cover overflow-hidden mb-0 d-flex justify-content-center">
                <Image
                  src="/assets/images/calltoaction.jpg"
                  className="rounded-top w-100"
                  alt="profile cover"
                  width={1600}
                  height={500}
                  priority
                  style={{ height: "auto" }}
                />
              </figure>
              <div className="d-flex justify-content-between align-items-center position-absolute bottom-10 w-100 px-3 ms-4">
                <div>
                  <Image
                    className="wd-70 rounded-circle"
                    src="/assets/images/review1.jpg"
                    alt={`${fullName} profile`}
                    width={70}
                    height={70}
                  />
                  <span className="h4 ms-2 bg-white rounded p-2 px-3">
                    {fullName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row profile-body">
        <div className="col-lg-4">
          <div className="card rounded">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="card-title mb-0">About</h6>
              </div>
              <p>
                Hi! I&apos;m Amiah the Senior UI Designer at foneui. We hope you
                enjoy the design and quality of Social. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
              <div className="mt-3">
                <label className="fw-bolder mb-0 text-uppercase">Joined:</label>
                <p>November 15, 2021</p>
              </div>
              <div className="mt-3">
                <label className="fw-bolder mb-0 text-uppercase">Address:</label>
                <p>New York, USA</p>
              </div>
              <div className="mt-3">
                <label className="fw-bolder mb-0 text-uppercase">Email:</label>
                <p>{form.email || "me@foneui.com"}</p>
              </div>
              <div className="mt-3">
                <label className="fw-bolder mb-0 text-uppercase">Phone No.:</label>
                <p>{form.phone || "+00 1234 5678 9"}</p>
              </div>
              <div className="mt-3">
                <label className="fw-bolder mb-0 text-uppercase">Birthday:</label>
                <p>Jan 15, 1995</p>
              </div>
              <div className="mt-3">
                <label className="fw-bolder mb-0 text-uppercase">Website:</label>
                <p>www.foneui.com</p>
              </div>
              <div className="mt-3 d-flex social-links">
                <button className="btn btn-icon border btn-xs me-2" type="button" aria-label="GitHub">
                  <Icon name="github" />
                </button>
                <button className="btn btn-icon border btn-xs me-2" type="button" aria-label="Twitter">
                  <Icon name="twitter" />
                </button>
                <button className="btn btn-icon border btn-xs me-2" type="button" aria-label="Instagram">
                  <Icon name="instagram" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-4">User Profile</h4>
              <form className="forms-sample" onSubmit={saveProfile}>
                <div className="row">
                  <div className="col-lg-12 mb-3">
                    <label htmlFor="upload" className="form-label">User Image</label>
                    <input
                      className="form-control"
                      type="file"
                      id="upload"
                      accept="image/*"
                      onChange={updateImage}
                    />
                    {selectedImage && <p className="tx-12 text-muted mt-2 mb-0">Selected: {selectedImage}</p>}
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label htmlFor="firstname" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="firstname" name="firstName" autoComplete="given-name" value={form.firstName} onChange={updateField} />
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label htmlFor="lastname" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="lastname" name="lastName" autoComplete="family-name" value={form.lastName} onChange={updateField} />
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input type="email" className="form-control" id="email" name="email" autoComplete="email" value={form.email} onChange={updateField} />
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label htmlFor="phoneno" className="form-label">Phone Number</label>
                    <input type="tel" className="form-control" id="phoneno" name="phone" autoComplete="tel" value={form.phone} onChange={updateField} />
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" className="form-control" id="username" name="username" autoComplete="username" value={form.username} onChange={updateField} />
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" autoComplete="new-password" value={form.password} onChange={updateField} />
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-icon-text">
                      <Icon className="btn-icon-prepend" name="plus" /> Update Profile
                    </button>
                    {saved && <p className="text-success mt-2 mb-0" role="status">Profile updated.</p>}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
