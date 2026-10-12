"use client";
/* eslint-disable @next/next/no-img-element -- preserve the supplied Hotux HTML asset markup. */

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Form from "next/form";
import { routes } from "@/config/routes";
import { locationsThunks } from "@/features/locations/locations.thunks";
import { StayDateFields } from "@/features/reservations/components/StayDateFields";
import { validSearch } from "@/features/reservations/flow";
import {
  initializeHotuxHome,
  legacyScriptBundles,
  loadLegacyScripts,
} from "@/lib/legacy/scripts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function HomeBanner() {
  const dispatch = useAppDispatch();
  const { items: locations, requests } = useAppSelector(
    (state) => state.locations,
  );
  const locationRequest = requests.list;
  const [stay, setStay] = useState({ checkIn: "", checkOut: "" });
  const [error, setError] = useState("");

  function validateSubmit(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    const search = { ...stay, guests: Number(data.get("guests")), locationId: Number(data.get("maViTri")) };
    if (!validSearch(search)) {
      event.preventDefault();
      setError("Chọn địa điểm, ngày nhận từ hôm nay, ngày trả sau ngày nhận và ít nhất 1 khách.");
    } else {
      setError("");
    }
  }

  useEffect(() => {
    const task = dispatch(locationsThunks.list());
    return () => task.abort();
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;
    let cleanup: () => void = () => undefined;

    void loadLegacyScripts(legacyScriptBundles.hotuxHome)
      .then(() => {
        if (!cancelled) cleanup = initializeHotuxHome(document);
      })
      .catch((error: unknown) => {
        if (!cancelled)
          console.error("Hotux legacy scripts failed to load", error);
      });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <>
      <section className="banner">
        <div className="slider">
          <div className="swiper-container">
            <div className="swiper-wrapper">
              <div
                className="swiper-slide"
                style={{
                  backgroundImage: "url('/assets/images/slider/slider4.jpg')",
                }}
              >
                <div className="swiper-content">
                  <div className="slider-logo">
                    <img src="/assets/images/icons/bed-logo.png" alt="Image" />
                  </div>
                  <h3 data-animation="animated fadeInUp">The lap of Luxury</h3>
                  <h1 data-animation="animated fadeInUp">
                    Hotel <span>Hotux</span>
                  </h1>
                  <Link
                    href={routes.rooms.list}
                    data-animation="animated fadeInUp"
                    className="slider-btn btn-or mar-right-10"
                  >
                    <i className="fa fa-book" /> Explore Our Rooms
                  </Link>
                  <Link
                    href={routes.reservation.availability}
                    data-animation="animated fadeInUp"
                    className="slider-btn btn-wt"
                  >
                    <i className="fa fa-book" /> Book A Room Now
                  </Link>
                </div>
              </div>
              <div
                className="swiper-slide"
                style={{
                  backgroundImage: "url('/assets/images/slider/slider2.jpg')",
                }}
              >
                <div className="swiper-content">
                  <div className="slider-logo">
                    <img src="/assets/images/icons/bed-logo.png" alt="Image" />
                  </div>
                  <h3 data-animation="animated fadeInUp">The lap of Luxury</h3>
                  <h1 data-animation="animated fadeInUp">
                    Hotel <span>Hotux</span>
                  </h1>
                  <Link
                    href={routes.rooms.list}
                    data-animation="animated fadeInUp"
                    className="slider-btn btn-or mar-right-10"
                  >
                    <i className="fa fa-book" /> Explore Our Rooms
                  </Link>
                  <Link
                    href={routes.reservation.availability}
                    data-animation="animated fadeInUp"
                    className="slider-btn btn-wt"
                  >
                    <i className="fa fa-book" /> Book A Room Now
                  </Link>
                </div>
              </div>
              <div
                className="swiper-slide"
                style={{
                  backgroundImage: "url('/assets/images/slider/slider3.jpg')",
                }}
              >
                <div className="swiper-content">
                  <div className="slider-logo">
                    <img src="/assets/images/icons/bed-logo.png" alt="Image" />
                  </div>
                  <h3 data-animation="animated fadeInUp">The lap of Luxury</h3>
                  <h1 data-animation="animated fadeInUp">
                    Hotel <span>Hotux</span>
                  </h1>
                  <Link
                    href={routes.rooms.list}
                    data-animation="animated fadeInUp"
                    className="slider-btn btn-or mar-right-10"
                  >
                    <i className="fa fa-book" /> Explore Our Rooms
                  </Link>
                  <Link
                    href={routes.reservation.availability}
                    data-animation="animated fadeInUp"
                    className="slider-btn btn-wt"
                  >
                    <i className="fa fa-book" /> Book A Room Now
                  </Link>
                </div>
              </div>
            </div>
            <div className="swiper-pagination" />
          </div>
          <div className="overlay" />
        </div>

        <div className="banner-form home-stay-search">
          <div className="container">
            <Form
              action={routes.rooms.list}
              className="form-content"
              onSubmit={validateSubmit}
            >
              <div className="table-item stay-location">
                <div className="form-group form-icon">
                  <select
                    id="home-location"
                    name="maViTri"
                    className="wide"
                    defaultValue=""
                    required
                    aria-label="Địa điểm"
                    disabled={locationRequest.status !== "succeeded"}
                  >
                    <option value="" disabled>
                      {locationRequest.status === "loading" ||
                      locationRequest.status === "idle"
                        ? "Đang tải địa điểm..."
                        : locationRequest.status === "failed"
                          ? "Không thể tải địa điểm"
                          : "Chọn địa điểm"}
                    </option>
                    {locations.map((location) => (
                      <option value={location.id} key={location.id}>
                        {location.tenViTri}, {location.tinhThanh},{" "}
                        {location.quocGia}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <StayDateFields idPrefix="home" value={stay} showLabels={false} showNights={false} legacyPicker onChange={(value) => { setStay(value); setError(""); }} />
              <div className="table-item stay-guests">
                <div className="form-group form-icon">
                  <select id="home-guests" name="guests" className="wide" defaultValue="1" aria-label="Số khách" required>
                    {Array.from({ length: 20 }, (_, index) => index + 1).map((count) => (
                      <option value={count} key={count}>{count} khách</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="table-item stay-submit">
                <div className="form-btn">
                  <button
                    type="submit"
                    className="btn btn-orange"
                    disabled={locationRequest.status !== "succeeded"}
                  >
                    Kiểm tra phòng trống
                  </button>
                </div>
              </div>
            </Form>
            {error && <p role="alert" className="stay-search-error">{error}</p>}
            {locationRequest.status === "failed" && (
              <p role="alert" className="stay-search-error">
                Không thể tải địa điểm. <button type="button" className="btn btn-orange" onClick={() => { void dispatch(locationsThunks.list()); }}>Thử lại</button>
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
