"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Icon } from "@/components/admin";
import { routes } from "@/config/routes";

type PackageForm = {
  date: string;
  title: string;
  destination: string;
  price: string;
  people: string;
  dayNight: string;
  description: string;
};

const initialForm: PackageForm = {
  date: "",
  title: "",
  destination: "",
  price: "",
  people: "",
  dayNight: "",
  description: "",
};

export function AddBookingRoomPage() {
  const [form, setForm] = useState<PackageForm>(initialForm);
  const [selectedImage, setSelectedImage] = useState("");
  const [created, setCreated] = useState(false);
  const [activePage, setActivePage] = useState(1);

  const updateField = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setCreated(false);
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateImage = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(event.target.files?.[0]?.name ?? "");
    setCreated(false);
  };

  const createPackage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreated(true);
  };

  return (
    <>
      <nav className="page-breadcrumb d-flex align-items-center justify-content-between">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link href={routes.admin.dashboard}>Dashboard</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Package
          </li>
        </ol>
        <Link href={routes.admin.bookings} className="btn btn-primary">
          <Icon className="link-icon" name="arrow-left" /> Back To List
        </Link>
      </nav>

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <form className="row forms-sample" onSubmit={createPackage}>
                <div className="col-lg-6 mb-3">
                  <label htmlFor="upload" className="form-label">
                    Upload Images
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="upload"
                    accept="image/*"
                    onChange={updateImage}
                  />
                  {selectedImage && (
                    <p className="tx-12 text-muted mt-2 mb-0">
                      Selected: {selectedImage}
                    </p>
                  )}
                </div>
                <div className="col-lg-6 mb-3">
                  <label htmlFor="package-date" className="form-label">
                    Date
                  </label>
                  <div className="input-group date datepicker" id="datePickerExample">
                    <input
                      type="date"
                      className="form-control"
                      id="package-date"
                      name="date"
                      value={form.date}
                      onChange={updateField}
                    />
                    <span className="input-group-text input-group-addon" aria-hidden="true">
                      <Icon name="calendar" />
                    </span>
                  </div>
                </div>
                <div className="col-lg-6 mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    autoComplete="off"
                    value={form.title}
                    onChange={updateField}
                  />
                </div>
                <div className="col-lg-6 mb-3">
                  <label htmlFor="destination" className="form-label">Destination</label>
                  <input
                    type="text"
                    className="form-control"
                    id="destination"
                    name="destination"
                    value={form.destination}
                    onChange={updateField}
                  />
                </div>
                <div className="col-lg-6 mb-3">
                  <label htmlFor="venue" className="form-label">Price</label>
                  <input
                    type="text"
                    className="form-control"
                    id="venue"
                    name="price"
                    inputMode="decimal"
                    value={form.price}
                    onChange={updateField}
                  />
                </div>
                <div className="col-lg-6 mb-3">
                  <label htmlFor="person" className="form-label">No. Of Person</label>
                  <input
                    type="text"
                    className="form-control"
                    id="person"
                    name="people"
                    inputMode="numeric"
                    value={form.people}
                    onChange={updateField}
                  />
                </div>
                <div className="col-lg-12 mb-3">
                  <label htmlFor="daynight" className="form-label">
                    No. of day &amp; Night
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="daynight"
                    name="dayNight"
                    value={form.dayNight}
                    onChange={updateField}
                  />
                </div>
                <div className="col-lg-12 mb-3">
                  <label htmlFor="tinymceExample" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="tinymceExample"
                    name="description"
                    rows={10}
                    value={form.description}
                    onChange={updateField}
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    <Icon className="link-icon" name="plus" /> Create Package
                  </button>
                  {created && (
                    <p className="text-success mt-2 mb-0" role="status">
                      Package created.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="dataTables_paginate">
          <ul className="pagination">
            <li className={`paginate_button page-item ${activePage === 1 ? "disabled" : ""}`}>
              <button className="page-link" type="button" onClick={() => setActivePage((page) => Math.max(1, page - 1))}>
                Previous
              </button>
            </li>
            {[1, 2, 3].map((page) => (
              <li className={`paginate_button page-item ${activePage === page ? "active" : ""}`} key={page}>
                <button className="page-link" type="button" onClick={() => setActivePage(page)}>
                  {page}
                </button>
              </li>
            ))}
            <li className={`paginate_button page-item ${activePage === 3 ? "disabled" : ""}`}>
              <button className="page-link" type="button" onClick={() => setActivePage((page) => Math.min(3, page + 1))}>
                Next
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
