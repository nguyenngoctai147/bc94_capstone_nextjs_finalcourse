"use client";
/* eslint-disable @next/next/no-img-element -- preserve the supplied Hotux HTML asset markup. */

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Form from "next/form";
import { routes } from "@/config/routes";
import { fetchLocations } from "@/features/locations/locations.slice";
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
              {["slider4.jpg", "slider2.jpg", "slider3.jpg"].map((image, index) => {
                const Heading = index === 0 ? "h1" : "h2";
                return (
                  <div className="swiper-slide" key={image} style={{ backgroundImage: `url('/assets/images/slider/${image}')` }}>
                    <div className="swiper-content">
                      <div className="slider-logo"><img src="/assets/images/icons/bed-logo.png" alt="" /></div>
                      <p className="home-banner-eyebrow" data-animation="animated fadeInUp">Tận hưởng từng chuyến đi</p>
                      <Heading className="home-banner-title" data-animation="animated fadeInUp">Hotel <span>Hotux</span></Heading>
                      <Link href={routes.rooms.list} data-animation="animated fadeInUp" className="slider-btn btn-or mar-right-10">
                        <i className="fa fa-book" aria-hidden="true" /> Khám phá chỗ nghỉ
                      </Link>
                      <Link href={routes.reservation.availability} data-animation="animated fadeInUp" className="slider-btn btn-wt">
                        <i className="fa fa-book" aria-hidden="true" /> Đặt phòng ngay
                      </Link>
                    </div>
                  </div>
                );
              })}
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
                Không thể tải địa điểm. <button type="button" className="btn btn-orange" onClick={() => { void dispatch(fetchLocations()); }}>Thử lại</button>
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
