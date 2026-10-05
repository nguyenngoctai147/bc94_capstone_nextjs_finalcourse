"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/admin";

const projects = [
  [
    "Hotux jQuery",
    "01/01/2022",
    "26/04/2022",
    "Released",
    "danger",
    "Leonardo Payne",
  ],
  [
    "Hotux Angular",
    "01/01/2022",
    "26/04/2022",
    "Review",
    "success",
    "Carl Henson",
  ],
  [
    "Hotux ReactJs",
    "01/05/2022",
    "10/09/2022",
    "Pending",
    "info",
    "Jensen Combs",
  ],
  [
    "Hotux VueJs",
    "01/01/2022",
    "31/11/2022",
    "Work in Progress",
    "warning",
    "Amiah Burton",
  ],
  [
    "Hotux Laravel",
    "01/01/2022",
    "31/12/2022",
    "Coming soon",
    "danger",
    "Yaretzi Mayo",
  ],
  [
    "Hotux NodeJs",
    "01/01/2022",
    "31/12/2022",
    "Coming soon",
    "primary",
    "Carl Henson",
  ],
  [
    "Hotux EmberJs",
    "01/05/2022",
    "10/11/2022",
    "Pending",
    "info",
    "Jensen Combs",
  ],
] as const;

const inbox = [
  ["Leonardo Payne", "12.30 PM", "Hey! there I'm available...", "review1.jpg"],
  ["Carl Henson", "02.14 AM", "I've finished it! See you so..", "review2.jpg"],
  ["Jensen Combs", "08.22 PM", "This template is awesome!", "review3.jpg"],
  ["Amiah Burton", "05.49 AM", "Nice to meet you", "review1.jpg"],
  ["Yaretzi Mayo", "01.19 AM", "Hey! there I'm available...", "review2.jpg"],
] as const;

function MoreDropdown({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="dropdown mb-2">
      <button
        className="btn p-0"
        type="button"
        id={id}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon className="icon-lg text-muted pb-3px" name="more-horizontal" />
      </button>
      <div
        className={`dropdown-menu ${open ? "show" : ""}`}
        aria-labelledby={id}
      >
        <button
          className="dropdown-item d-flex align-items-center"
          type="button"
        >
          <Icon className="icon-sm me-2" name="box" />
          <span>View</span>
        </button>
        <button
          className="dropdown-item d-flex align-items-center"
          type="button"
        >
          <Icon className="icon-sm me-2" name="edit" />
          <span>Edit</span>
        </button>
        <button
          className="dropdown-item d-flex align-items-center"
          type="button"
        >
          <Icon className="icon-sm me-2" name="trash" />
          <span>Delete</span>
        </button>
        <button
          className="dropdown-item d-flex align-items-center"
          type="button"
        >
          <Icon className="icon-sm me-2" name="file" />
          <span>Print</span>
        </button>
        <button
          className="dropdown-item d-flex align-items-center"
          type="button"
        >
          <Icon className="icon-sm me-2" name="arrow-up" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}

function RevenueChart() {
  return (
    <div
      id="revenueChart"
      className="admin-static-chart"
      aria-label="Revenue chart"
    />
  );
}

function MonthlySalesChart() {
  return (
    <div
      id="monthlySalesChart"
      className="admin-static-chart"
      aria-label="Monthly sales chart"
    />
  );
}

function StorageChart() {
  return (
    <div
      id="storageChart"
      className="admin-static-chart"
      aria-label="Cloud storage chart"
    />
  );
}

function DashboardCard({
  title,
  menuId,
  children,
}: {
  title: string;
  menuId: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-baseline mb-3">
          <h6 className="card-title mb-0">{title}</h6>
          <MoreDropdown id={menuId} />
        </div>
        {children}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
          <h4 className="mb-3 mb-md-0">Welcome to Hotux Dashboard</h4>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-xl-12 stretch-card">
          <div className="row flex-grow-1">
            <div className="col-md-4 grid-margin stretch-card">
              <DashboardCard title="New Customers" menuId="dropdownMenuButton">
                <div className="row">
                  <div className="col-6 col-md-12 col-xl-5">
                    <h3 className="mb-2">1,297</h3>
                    <div className="d-flex align-items-baseline">
                      <p className="text-success">
                        <span>+2.5%</span>
                        <Icon className="icon-sm mb-1" name="arrow-up" />
                      </p>
                    </div>
                  </div>
                  <div className="col-6 col-md-12 col-xl-7">
                    <div id="customersChart" className="mt-md-3 mt-xl-0" />
                  </div>
                </div>
              </DashboardCard>
            </div>
            <div className="col-md-4 grid-margin stretch-card">
              <DashboardCard
                title="New Destination"
                menuId="dropdownMenuButton1"
              >
                <div className="row">
                  <div className="col-6 col-md-12 col-xl-5">
                    <h3 className="mb-2">10,500</h3>
                    <div className="d-flex align-items-baseline">
                      <p className="text-danger">
                        <span>-5.6%</span>
                        <Icon className="icon-sm mb-1" name="arrow-up" />
                      </p>
                    </div>
                  </div>
                  <div className="col-6 col-md-12 col-xl-7">
                    <div id="ordersChart" className="mt-md-3 mt-xl-0" />
                  </div>
                </div>
              </DashboardCard>
            </div>
            <div className="col-md-4 grid-margin stretch-card">
              <DashboardCard title="No of Person" menuId="dropdownMenuButton2">
                <div className="row">
                  <div className="col-6 col-md-12 col-xl-5">
                    <h3 className="mb-2">45.50%</h3>
                    <div className="d-flex align-items-baseline">
                      <p className="text-success">
                        <span>+8.2%</span>
                        <Icon className="icon-sm mb-1" name="arrow-up" />
                      </p>
                    </div>
                  </div>
                  <div className="col-6 col-md-12 col-xl-7">
                    <div id="growthChart" className="mt-md-3 mt-xl-0" />
                  </div>
                </div>
              </DashboardCard>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-xl-12 grid-margin stretch-card">
          <div className="card overflow-hidden">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-baseline mb-4 mb-md-3">
                <h6 className="card-title mb-0">Travel data</h6>
                <MoreDropdown id="dropdownMenuButton3" />
              </div>
              <div className="row align-items-start">
                <div className="col-md-7">
                  <p className="text-muted tx-13 mb-3 mb-md-0">
                    Revenue is the income that a business has from its normal
                    business activities, usually from the sale of goods and
                    services to customers.
                  </p>
                </div>
                <div className="col-md-5 d-flex justify-content-md-end">
                  <div
                    className="btn-group mb-3 mb-md-0"
                    role="group"
                    aria-label="Travel data period"
                  >
                    <button type="button" className="btn btn-outline-primary">
                      Today
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary d-none d-md-block"
                    >
                      Week
                    </button>
                    <button type="button" className="btn btn-primary">
                      Month
                    </button>
                    <button type="button" className="btn btn-outline-primary">
                      Year
                    </button>
                  </div>
                </div>
              </div>
              <RevenueChart />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-7 col-xl-8 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-baseline mb-2">
                <h6 className="card-title mb-0">Monthly sales</h6>
                <MoreDropdown id="dropdownMenuButton4" />
              </div>
              <p className="text-muted">
                Sales are activities related to selling or the number of goods
                or services sold in a given time period.
              </p>
              <MonthlySalesChart />
            </div>
          </div>
        </div>
        <div className="col-lg-5 col-xl-4 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-baseline">
                <h6 className="card-title mb-0">Cloud storage</h6>
                <MoreDropdown id="dropdownMenuButton5" />
              </div>
              <StorageChart />
              <div className="row mb-3">
                <div className="col-6 d-flex justify-content-end">
                  <div>
                    <label className="d-flex align-items-center justify-content-end tx-10 text-uppercase fw-bolder">
                      Total storage{" "}
                      <span className="p-1 ms-1 rounded-circle bg-secondary" />
                    </label>
                    <h5 className="fw-bolder mb-0 text-end">8TB</h5>
                  </div>
                </div>
                <div className="col-6">
                  <div>
                    <label className="d-flex align-items-center tx-10 text-uppercase fw-bolder">
                      <span className="p-1 me-1 rounded-circle bg-primary" />{" "}
                      Used storage
                    </label>
                    <h5 className="fw-bolder mb-0">~5TB</h5>
                  </div>
                </div>
              </div>
              <div className="d-grid">
                <button className="btn btn-primary" type="button">
                  Upgrade storage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-5 col-xl-4 grid-margin grid-margin-xl-0 stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-baseline mb-2">
                <h6 className="card-title mb-0">Inbox</h6>
                <MoreDropdown id="dropdownMenuButton6" />
              </div>
              <div className="d-flex flex-column">
                {inbox.map(([name, time, message, avatar], index) => (
                  <div
                    className={`d-flex align-items-center ${index === 0 ? "border-bottom pb-3" : "border-bottom py-3"}`}
                    key={name}
                  >
                    <div className="me-3">
                      <Image
                        src={`/assets/images/${avatar}`}
                        className="rounded-circle wd-35"
                        alt="user"
                        width={35}
                        height={35}
                      />
                    </div>
                    <div className="w-100">
                      <div className="d-flex justify-content-between">
                        <h6 className="text-body mb-2">{name}</h6>
                        <p className="text-muted tx-12">{time}</p>
                      </div>
                      <p className="text-muted tx-13">{message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-7 col-xl-8 stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-baseline mb-2">
                <h6 className="card-title mb-0">Projects</h6>
                <MoreDropdown id="dropdownMenuButton7" />
              </div>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th className="pt-0">#</th>
                      <th className="pt-0">Project Name</th>
                      <th className="pt-0">Start Date</th>
                      <th className="pt-0">Due Date</th>
                      <th className="pt-0">Status</th>
                      <th className="pt-0">Assign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(
                      ([name, start, due, status, variant, assign], index) => (
                        <tr key={name}>
                          <td
                            className={
                              index === projects.length - 1
                                ? "border-bottom"
                                : ""
                            }
                          >
                            {index + 1}
                          </td>
                          <td
                            className={
                              index === projects.length - 1
                                ? "border-bottom"
                                : ""
                            }
                          >
                            {name}
                          </td>
                          <td
                            className={
                              index === projects.length - 1
                                ? "border-bottom"
                                : ""
                            }
                          >
                            {start}
                          </td>
                          <td
                            className={
                              index === projects.length - 1
                                ? "border-bottom"
                                : ""
                            }
                          >
                            {due}
                          </td>
                          <td
                            className={
                              index === projects.length - 1
                                ? "border-bottom"
                                : ""
                            }
                          >
                            <span className={`badge bg-${variant}`}>
                              {status}
                            </span>
                          </td>
                          <td
                            className={
                              index === projects.length - 1
                                ? "border-bottom"
                                : ""
                            }
                          >
                            {assign}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
