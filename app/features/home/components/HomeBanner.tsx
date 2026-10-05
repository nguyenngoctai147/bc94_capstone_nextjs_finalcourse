"use client";
/* eslint-disable @next/next/no-img-element -- preserve the supplied Hotux HTML asset markup. */

import { useEffect } from "react";
import Link from "next/link";
import Form from "next/form";
import { routes } from "@/config/routes";
import { locationsThunks } from "@/features/locations/locations.thunks";
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

        <div className="banner-form">
          <div className="container">
            <Form
              action={routes.reservation.availability}
              className="form-content"
            >
              <div className="table-item">
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
              <div className="table-item">
                <div className="form-group form-icon">
                  <div className="date-range-inner-wrapper">
                    <input
                      id="date-range2"
                      name="checkIn"
                      type="text"
                      className="form-control"
                      placeholder="Nhận phòng"
                      aria-label="Ngày nhận phòng"
                      required
                    />
                    <span className="input-group-addon" aria-hidden="true">
                      <i className="fa fa-calendar" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="table-item">
                <div className="form-group form-icon">
                  <div className="date-range-inner-wrapper">
                    <input
                      id="date-range3"
                      name="checkOut"
                      type="text"
                      className="form-control"
                      placeholder="Trả phòng"
                      aria-label="Ngày trả phòng"
                      required
                    />
                    <span className="input-group-addon" aria-hidden="true">
                      <i className="fa fa-calendar" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="table-item">
                <div className="form-group form-icon">
                  <select
                    id="home-guests"
                    name="guests"
                    className="wide"
                    defaultValue="1"
                    aria-label="Khách"
                  >
                    {Array.from({ length: 10 }, (_, index) => index + 1).map(
                      (guestCount) => (
                        <option value={guestCount} key={guestCount}>
                          {guestCount} khách
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>
              <div className="table-item">
                <div className="form-btn">
                  <button type="submit" className="btn btn-orange">
                    Kiểm tra đặt phòng
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
}
