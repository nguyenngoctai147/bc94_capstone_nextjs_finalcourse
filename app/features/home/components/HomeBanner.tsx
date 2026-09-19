"use client";
/* eslint-disable @next/next/no-img-element -- preserve the supplied Hotux HTML asset markup. */

import { useEffect } from "react";
import Link from "next/link";
import { routes } from "@/config/routes";
import {
  initializeHotuxHome,
  legacyScriptBundles,
  loadLegacyScripts,
} from "@/lib/legacy/scripts";

export function HomeBanner() {
  useEffect(() => {
    let cancelled = false;
    let cleanup: () => void = () => undefined;

    void loadLegacyScripts(legacyScriptBundles.hotuxHome)
      .then(() => {
        if (!cancelled) cleanup = initializeHotuxHome(document);
      })
      .catch((error: unknown) => {
        if (!cancelled) console.error("Hotux legacy scripts failed to load", error);
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
            <div className="form-content">
              <div className="table-item">
                <div className="form-group">
                  <div className="date-range-inner-wrapper">
                    <input
                      id="date-range2"
                      className="form-control"
                      defaultValue="Check In"
                    />
                    <span className="input-group-addon">
                      <i className="fa fa-calendar" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="table-item">
                <div className="form-group form-icon">
                  <div className="date-range-inner-wrapper">
                    <input
                      id="date-range3"
                      className="form-control"
                      defaultValue="Check Out"
                    />
                    <span className="input-group-addon">
                      <i className="fa fa-calendar" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="table-item">
                <div className="form-group form-icon">
                  <select className="wide" defaultValue="0">
                    <option value="0">Guest</option>
                    <option value="1">0</option>
                    <option value="2">1</option>
                    <option value="3">2</option>
                    <option value="4">3</option>
                    <option value="5">4</option>
                  </select>
                </div>
              </div>
              <div className="table-item">
                <div className="form-group form-icon">
                  <select className="wide" defaultValue="0">
                    <option value="0">Nights</option>
                    <option value="1">0</option>
                    <option value="2">1</option>
                    <option value="3">2</option>
                    <option value="4">3</option>
                    <option value="5">4</option>
                  </select>
                </div>
              </div>
              <div className="table-item">
                <div className="form-btn">
                  <Link href={routes.reservation.availability} className="btn btn-orange">
                    Check Availability
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
