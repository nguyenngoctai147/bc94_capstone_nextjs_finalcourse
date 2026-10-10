"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/admin";
import { routes } from "@/config/routes";

type BookingStatus = "Pending" | "Verified" | "Cancel";

type BookingRow = {
  id: number;
  name: string;
  contact: string;
  destination: string;
  city: string;
  bookingDate: string;
  people: number;
  packageName: string;
  status: BookingStatus;
  lockedStatus?: boolean;
};

const staticBookings: BookingRow[] = [
  { id: 1, name: "Suroj Karki", contact: "9841000000", destination: "Japan", city: "Tokyo", bookingDate: "2022/05/22", people: 4, packageName: "4 days 5 nights", status: "Pending", lockedStatus: true },
  { id: 2, name: "Suroj Karki", contact: "9841000000", destination: "Japan", city: "Tokyo", bookingDate: "2022/05/22", people: 4, packageName: "4 days 5 nights", status: "Pending" },
  { id: 3, name: "Suroj Karki", contact: "9841000000", destination: "Japan", city: "Tokyo", bookingDate: "2022/05/22", people: 4, packageName: "4 days 5 nights", status: "Pending" },
  { id: 4, name: "Suroj Karki", contact: "9841000000", destination: "Japan", city: "Tokyo", bookingDate: "2022/05/22", people: 4, packageName: "4 days 5 nights", status: "Pending" },
];

const statuses: BookingStatus[] = ["Pending", "Verified", "Cancel"];

function getBookingStatus(booking: BookingRow, values: Record<number, BookingStatus>) {
  return values[booking.id] ?? booking.status;
}

export function BookingManagementPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [category, setCategory] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [viewingBooking, setViewingBooking] = useState<BookingRow | null>(null);
  const [activePage, setActivePage] = useState(1);
  const [bookingStatuses, setBookingStatuses] = useState<Record<number, BookingStatus>>({});
  const filteredBookings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return staticBookings.filter((booking) => {
      const matchesQuery = !normalizedQuery || [booking.name, booking.contact, booking.destination, booking.city, booking.packageName].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesStatus = !statusFilter || getBookingStatus(booking, bookingStatuses) === statusFilter;
      const matchesCategory = !category || category === "1";
      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [category, query, statusFilter, bookingStatuses]);

  return <>
    <nav className="page-breadcrumb d-flex align-items-center justify-content-between">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item"><Link href={routes.admin.dashboard}>Dashboard</Link></li>
        <li className="breadcrumb-item active" aria-current="page">Booking Lists</li>
      </ol>
      <Link href={routes.admin.dashboard} className="btn btn-primary"><Icon className="link-icon" name="arrow-left" /> Back To List</Link>
    </nav>

    <div className="search-box p-4 bg-white rounded mb-3 box-shadow">
      <form className="forms-sample" onSubmit={(event) => event.preventDefault()}>
        <div className="row align-items-center">
          <div className="col-lg-3"><h5>Doctor Schedule Lists</h5></div>
          <div className="col-lg-4 col-md-4"><input type="text" placeholder="Search by ads title" className="form-control" value={query} onChange={(event) => { setQuery(event.target.value); setActivePage(1); }} /></div>
          <div className="col-lg-2 col-md-4">
            <select className="form-select form-select-lg" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setActivePage(1); }}>
              <option value="">Show Entries</option><option value="Pending">Pending</option><option value="Verified">Verified</option><option value="Cancel">Cancel</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-4">
            <select className="form-select form-select-lg" value={category} onChange={(event) => { setCategory(event.target.value); setActivePage(1); }}>
              <option value="">Category</option><option value="1">One</option><option value="2">Two</option><option value="3">Three</option>
            </select>
          </div>
        </div>
      </form>
    </div>

    <div className="row"><div className="col-md-12 grid-margin stretch-card"><div className="card"><div className="card-body"><div className="table-responsive">
      <table id="dataTableExample" className="table">
        <thead><tr><th></th><th>ID</th><th>Name</th><th>Contact No.</th><th>Destination</th><th>City</th><th>Booking Date</th><th>No. Of Person</th><th>Packages</th><th className="text-center">Published</th><th className="text-center">Action</th></tr></thead>
        <tbody>{filteredBookings.map((booking) => <tr key={booking.id}>
          <td><input type="radio" className="form-check-input" name="gender_radio" id={`gender${booking.id}`} checked={selectedBookingId === booking.id} onChange={() => setSelectedBookingId(booking.id)} /></td>
          <td>{booking.id}</td><td>{booking.name}</td><td>{booking.contact}</td><td>{booking.destination}</td><td>{booking.city}</td><td>{booking.bookingDate}</td><td>{booking.people}</td><td>{booking.packageName}</td>
          <td className="text-center">{booking.lockedStatus ? <span className="verify bg-primary">{getBookingStatus(booking, bookingStatuses)}</span> : <select className="form-select form-select-lg" value={getBookingStatus(booking, bookingStatuses)} onChange={(event) => setBookingStatuses((current) => ({ ...current, [booking.id]: event.target.value as BookingStatus }))}>{statuses.map((status) => <option value={status} key={status}>{status}</option>)}</select>}</td>
          <td className="text-center"><ul className="d-flex list-unstyled mb-0 justify-content-center">
            <li className="me-2"><a href="#viewappoint" aria-label={`View booking ${booking.id}`} onClick={(event) => { event.preventDefault(); setViewingBooking(booking); }}><Icon className="link-icon" name="eye" /></a></li>
            <li className="me-2"><a href="#edit-booking" aria-label={`Edit booking ${booking.id}`} onClick={(event) => event.preventDefault()}><Icon className="link-icon" name="edit" /></a></li>
            <li><a href="#delete-booking" aria-label={`Delete booking ${booking.id}`} onClick={(event) => event.preventDefault()}><Icon className="link-icon" name="trash" /></a></li>
          </ul></td>
        </tr>)}</tbody>
      </table>
    </div></div></div></div></div>

    <div className="row"><div className="dataTables_paginate"><ul className="pagination">
      <li className={`paginate_button page-item ${activePage === 1 ? "disabled" : ""}`}><a href="#previous" className="page-link" onClick={(event) => { event.preventDefault(); setActivePage((page) => Math.max(1, page - 1)); }}>Previous</a></li>
      {[1, 2, 3].map((page) => <li className={`paginate_button page-item ${activePage === page ? "active" : ""}`} key={page}><a href={`#page-${page}`} className="page-link" onClick={(event) => { event.preventDefault(); setActivePage(page); }}>{page}</a></li>)}
      <li className={`paginate_button page-item ${activePage === 3 ? "disabled" : ""}`}><a href="#next" className="page-link" onClick={(event) => { event.preventDefault(); setActivePage((page) => Math.min(3, page + 1)); }}>Next</a></li>
    </ul></div></div>

    {viewingBooking && <>
      <div className="modal fade show" id="viewappoint" tabIndex={-1} aria-labelledby="viewappoint" aria-hidden="false" role="dialog" style={{ display: "block" }} onClick={() => setViewingBooking(null)}>
        <div className="modal-dialog" onClick={(event) => event.stopPropagation()}><div className="modal-content"><div className="modal-header text-center"><h5 className="modal-title" id="exampleModalLabel">Booking Details</h5></div><div className="modal-body">
          <table className="table"><tbody>
            <tr><td>Booking Date</td><td>{viewingBooking.bookingDate}</td></tr><tr><td>Guest Name</td><td>{viewingBooking.name}</td></tr><tr><td>Contact No.</td><td>{viewingBooking.contact}</td></tr><tr><td>Destination</td><td>{viewingBooking.destination}</td></tr><tr><td>City</td><td>{viewingBooking.city}</td></tr><tr><td>No. Of Person</td><td>{viewingBooking.people}</td></tr><tr><td>Package</td><td>{viewingBooking.packageName}</td></tr><tr><td>Status</td><td>{getBookingStatus(viewingBooking, bookingStatuses)}</td></tr><tr><td>Note</td><td>Here goes something note</td></tr><tr><td>REASON</td><td>Here goes something reason</td></tr>
          </tbody></table>
        </div></div></div>
      </div>
      <div className="modal-backdrop fade show" onClick={() => setViewingBooking(null)} />
    </>}
  </>;
}
