"use client";

import Link from "next/link";
import { useEffect } from "react";
import { routes } from "@/config/routes";
import {
  destroyHotuxReservation,
  initializeHotuxReservation,
  legacyScriptBundles,
  loadLegacyScripts,
} from "@/lib/legacy/scripts";

const checkInDays = ["05/Jan", "06/Jan", "07/Jan", "08/Jan", "09/Jan"];
const guests = ["01", "02", "03", "04", "05"];
const nights = ["05", "06", "07", "08", "09"];

export function ReservationProgress({ active }: { active: 1 | 2 | 3 | 4 }) {
  const steps = [
    ["Check Availability", routes.reservation.availability],
    ["Select Room", routes.reservation.selectRoom],
    ["Booking", routes.reservation.booking],
    ["Confirmation", routes.reservation.confirmation],
  ] as const;
  return (
    <div className="reservation-links text-center">
      <h2 className="mar-bottom-60 text-capitalize">Make Your Reservation</h2>
      <div className="reservation-links-content">
        {steps.map(([label, href], index) => {
          const step = index + 1;
          return (
            <div className="res-item" key={label}>
              <Link href={href} className={step <= active ? "active" : undefined}>
                {step < active ? <i className="fa fa-check" /> : step}
              </Link>
              <p>{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StepLink({
  number,
  label,
  href,
  active = false,
}: {
  number: string;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <div className="res-item">
      <Link href={href} className={active ? "active" : undefined}>{number}</Link>
      <p>{label}</p>
    </div>
  );
}

export function StaticSelect({
  label,
  values,
}: {
  label: string;
  values: readonly string[];
}) {
  return (
    <div className="table-item">
      <label>{label}</label>
      <div className="form-group">
        <select className="wide" defaultValue="1">
          {values.map((value, index) => <option value={String(index + 1)} key={value}>{value}</option>)}
        </select>
      </div>
    </div>
  );
}

export function AvailabilityPage() {
  useEffect(() => {
    let active = true;

    void loadLegacyScripts(legacyScriptBundles.hotuxReservation).then(() => {
      if (active) initializeHotuxReservation();
    });

    return () => {
      active = false;
      destroyHotuxReservation();
    };
  }, []);

  return (
    <section className="content reservation-main">
      <div className="container">
        <ReservationProgress active={1} />

        <div className="banner-form form-style-1">
          <div className="form-content">
            <StaticSelect label="Check In" values={checkInDays} />
            <StaticSelect label="Check Out" values={checkInDays} />
            <StaticSelect label="Guests" values={guests} />
            <StaticSelect label="Nights" values={nights} />
            <div className="table-item">
              <div className="form-btn mar-top-35">
                <Link href={routes.reservation.selectRoom} className="btn btn-orange">Check Availability</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="calendar-range">
          <div className="date-range-inner-wrapper">
            <input id="date-range12" className="form-control d-none" aria-hidden="true" />
            <div id="date-range12-container" />
          </div>
        </div>
      </div>
    </section>
  );
}
