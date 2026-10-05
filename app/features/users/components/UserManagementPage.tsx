"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { routes } from "@/config/routes";
import { Icon } from "@/components/admin";

type StaticUser = {
  id: string;
  startDate: string;
  image: string;
  fullname: string;
  email: string;
  dob: string;
  role: string;
};

const staticUsers: StaticUser[] = [
  { id: "travel", startDate: "2022/04/25", image: "review2.jpg", fullname: "Holo Tarot", email: "holotarot@gmail.com", dob: "1989-11-30", role: "Admin" },
  { id: "travel", startDate: "2022/04/25", image: "review3.jpg", fullname: "Holo Tarot", email: "holotarot@gmail.com", dob: "1989-11-30", role: "Admin" },
  { id: "travel", startDate: "2022/04/25", image: "review1.jpg", fullname: "Holo Tarot", email: "holotarot@gmail.com", dob: "1989-11-30", role: "Admin" },
  { id: "travel", startDate: "2022/04/25", image: "review1.jpg", fullname: "Holo Tarot", email: "holotarot@gmail.com", dob: "1989-11-30", role: "Admin" },
  { id: "travel", startDate: "2022/04/25", image: "review2.jpg", fullname: "Holo Tarot", email: "holotarot@gmail.com", dob: "1989-11-30", role: "Admin" },
  { id: "travel", startDate: "2022/04/25", image: "review3.jpg", fullname: "Holo Tarot", email: "holotarot@gmail.com", dob: "1989-11-30", role: "Admin" },
];

const stopNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
  event.preventDefault();
};

export function UserManagementPage() {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState("");
  const [activePage, setActivePage] = useState(1);
  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return staticUsers;
    return staticUsers.filter((user) => [user.id, user.fullname, user.email, user.role].some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [query]);

  return <>
    <nav className="page-breadcrumb d-flex align-items-center justify-content-between">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item"><Link href={routes.admin.dashboard}>Dashboard</Link></li>
        <li className="breadcrumb-item active" aria-current="page">User Management</li>
      </ol>
      <a href="#add-role" className="btn btn-primary btn-icon-text" onClick={stopNavigation}>
        <Icon className="btn-icon-prepend" name="plus" /> Add Role
      </a>
    </nav>

    <div className="search-box p-4 bg-white rounded mb-3 box-shadow">
      <form className="forms-sample" onSubmit={(event) => event.preventDefault()}>
        <div className="row align-items-center">
          <div className="col-lg-3">
            <h5>User Management Lists</h5>
          </div>
          <div className="col-lg-6 col-md-4">
            <input type="text" placeholder="Search by category title" className="form-control" value={query} onChange={(event) => { setQuery(event.target.value); setActivePage(1); }} />
          </div>
          <div className="col-lg-3 col-md-4">
            <select className="form-select form-select-lg" value={entries} onChange={(event) => setEntries(event.target.value)}>
              <option value="">Show Entries</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </div>
        </div>
      </form>
    </div>

    <div className="row">
      <div className="col-md-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table id="dataTableExample" className="table">
                <thead>
                  <tr><th>ID</th><th>Start date</th><th>Image</th><th>Fullname</th><th>Email</th><th>DOB</th><th>Role</th><th className="text-center">Published</th><th className="text-center">Action</th></tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => <tr key={`${user.image}-${index}`}>
                    <td>{user.id}</td>
                    <td>{user.startDate}</td>
                    <td><Image src={`/assets/images/${user.image}`} alt="" width={80} height={80} /></td>
                    <td>{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>{user.dob}</td>
                    <td>{user.role}</td>
                    <td className="text-center"><span className="form-check form-switch"><input type="checkbox" className="form-check-input" id={`formSwitch${index + 1}`} /></span></td>
                    <td className="text-center">
                      <ul className="d-flex list-unstyled mb-0">
                        <li className="me-2"><a href="#addslider" data-bs-toggle="modal" data-bs-target="#addslider" aria-label={`Edit ${user.fullname}`} onClick={stopNavigation}><Icon className="link-icon" name="edit" /></a></li>
                        <li><a href="#delete-user" aria-label={`Delete ${user.fullname}`} onClick={stopNavigation}><Icon className="link-icon" name="trash" /></a></li>
                      </ul>
                    </td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="dataTables_paginate">
        <ul className="pagination">
          <li className={`paginate_button page-item ${activePage === 1 ? "disabled" : ""}`}><a href="#previous" className="page-link" onClick={(event) => { event.preventDefault(); setActivePage((page) => Math.max(1, page - 1)); }}>Previous</a></li>
          {[1, 2, 3].map((page) => <li className={`paginate_button page-item ${activePage === page ? "active" : ""}`} key={page}><a href={`#page-${page}`} className="page-link" onClick={(event) => { event.preventDefault(); setActivePage(page); }}>{page}</a></li>)}
          <li className={`paginate_button page-item ${activePage === 3 ? "disabled" : ""}`}><a href="#next" className="page-link" onClick={(event) => { event.preventDefault(); setActivePage((page) => Math.min(3, page + 1)); }}>Next</a></li>
        </ul>
      </div>
    </div>
  </>;
}
