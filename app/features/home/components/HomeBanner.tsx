"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Form from "next/form";
import { BookingLink } from "@/component/auth/BookingLink";
import { routes } from "@/route";
import { fetchLocations } from "@/store/thunk/location";
import { StayDateFields } from "@/features/reservations/components/StayDateFields";
import { searchValidationError } from "@/features/reservations/flow";
import {
  initializeHotuxHome,
  legacyScriptBundles,
  loadLegacyScripts,
} from "@/commons/legacy/scripts";
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
    const search = {
      checkIn: String(data.get("checkIn") ?? ""),
      checkOut: String(data.get("checkOut") ?? ""),
      guests: Number(data.get("guests")),
      locationId: Number(data.get("maViTri")),
    };
    const validationError = searchValidationError(search, { requireLocation: true });
    if (validationError) {
      event.preventDefault();
      setError(validationError);
    } else {
      setError("");
    }
  }

  useEffect(() => {
    let cancelled = false;
    let cleanup: () => void = () => undefined;

    void loadLegacyScripts(legacyScriptBundles.hotuxHome)
      .then(() => {
        if (!cancelled) {
          cleanup = initializeHotuxHome(document, (dates) => {
            setStay(dates);
            setError("");
          });
        }
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
      <section className="banner home-banner">
        <div className="slider">
          <div className="swiper-container">
            <div className="swiper-wrapper">
              {["slider4.jpg", "slider2.jpg", "slider3.jpg"].map(
                (image, index) => {
                  const Heading = index === 0 ? "h1" : "h2";
                  return (
                    <div
                      className="swiper-slide"
                      key={image}
                      style={{
                        backgroundImage: `url('/assets/images/slider/${image}')`,
                      }}
                    >
                      <div className="swiper-content">
                        <div className="slider-logo">
                          <img src="/assets/images/icons/bed-logo.png" alt="" />
                        </div>
                        <p
                          className="home-banner-eyebrow"
                          data-animation="animated fadeInUp"
                        >
                          Tận hưởng từng chuyến đi
                        </p>
                        <Heading
                          className="home-banner-title"
                          data-animation="animated fadeInUp"
                        >
                          Hotel <span>Hotux</span>
                        </Heading>
                        <Link
                          href={routes.rooms.list}
                          data-animation="animated fadeInUp"
                          className="slider-btn btn-or mar-right-10"
                        >
                          <i className="fa fa-book" aria-hidden="true" /> Khám
                          phá chỗ nghỉ
                        </Link>
                        <BookingLink
                          href={routes.reservation.availability}
                          data-animation="animated fadeInUp"
                          className="slider-btn btn-wt"
                        >
                          <i className="fa fa-book" aria-hidden="true" /> Đặt
                          phòng ngay
                        </BookingLink>
                      </div>
                    </div>
                  );
                },
              )}
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
                  <i className="fa fa-map-marker home-search-icon" aria-hidden="true" />
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
              <StayDateFields
                idPrefix="home"
                value={stay}
                showLabels={false}
                showNights={false}
                legacyPicker
                showIcons
                onChange={(value) => {
                  setStay(value);
                  setError("");
                }}
              />
              <div className="table-item stay-guests">
                <div className="form-group form-icon">
                  <i className="fa fa-user home-search-icon" aria-hidden="true" />
                  <select
                    id="home-guests"
                    name="guests"
                    className="wide"
                    defaultValue="1"
                    aria-label="Số khách"
                    required
                  >
                    {Array.from({ length: 20 }, (_, index) => index + 1).map(
                      (count) => (
                        <option value={count} key={count}>
                          {count} khách
                        </option>
                      ),
                    )}
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
            {error && (
              <p role="alert" className="stay-search-error">
                {error}
              </p>
            )}
            {locationRequest.status === "failed" && (
              <p role="alert" className="stay-search-error">
                Không thể tải địa điểm.{" "}
                <button
                  type="button"
                  className="btn btn-orange"
                  onClick={() => {
                    void dispatch(fetchLocations());
                  }}
                >
                  Thử lại
                </button>
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
