import Link from "next/link";
import { routes } from "@/config/routes";

const quickLinks = [
  ["Home", routes.home],
  ["Rooms", routes.rooms.list],
  ["Account", routes.account],
  ["Bookings", routes.bookings],
  ["Components", routes.ui],
] as const;

export function HotuxFooter() {
  return (
    <footer className="hotux-footer">
      <div className="footer-top pad-bottom-20">
        <div className="container">
          <div className="footer-logo text-center">
            <Link href={routes.home}>
              <img src="/assets/images/logo.png" alt="Hotux" />
            </Link>
          </div>
          <div className="footer-content">
            <div className="row">
              <div className="col-lg-3 col-md-6 mar-bottom-30">
                <div className="footer-about">
                  <h4>Company Info</h4>
                  <p>
                    Nền tảng khám phá, đặt phòng và quản lý lưu trú cho mỗi
                    chuyến đi.
                  </p>
                </div>
                <div className="footer-payment">
                  <h4>We Accept</h4>
                  <ul>
                    <li>
                      <img src="/assets/images/icons/visa.png" alt="Visa" />
                    </li>
                    <li>
                      <img
                        src="/assets/images/icons/mastercard.png"
                        alt="Mastercard"
                      />
                    </li>
                    <li>
                      <img
                        src="/assets/images/icons/americanexpress.png"
                        alt="American Express"
                      />
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mar-bottom-30">
                <div className="quick-links">
                  <h4>Quick Links</h4>
                  <ul>
                    {quickLinks.map(([label, href]) => (
                      <li key={href}>
                        <Link href={href}>{label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mar-bottom-30">
                <div className="Rooms">
                  <h4>Rooms</h4>
                  <ul>
                    <li>
                      <Link href={routes.rooms.list}>Danh sách phòng</Link>
                    </li>
                    <li>
                      <Link href={routes.rooms.list}>Phòng phổ biến</Link>
                    </li>
                    <li>
                      <Link href={routes.bookings}>Đặt phòng</Link>
                    </li>
                    <li>
                      <Link href={routes.admin.rooms}>Quản lý phòng</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mar-bottom-30">
                <div className="footer-contact">
                  <h4>Contact info</h4>
                  <ul>
                    <li>
                      Tel: <a href="tel:+9772224446666">977-222-444-6666</a>
                    </li>
                    <li>
                      Email:{" "}
                      <a href="mailto:info@hotux.com.np">info@hotux.com.np</a>
                    </li>
                    <li>Address: 445 Mount Eden Road</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-copyright pad-bottom-20">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4 mar-bottom-10">
              <div className="copyright-content">
                <p>
                  Copyright 2026. Made with <span aria-label="love">♥</span>.
                  All Rights Reserved.
                </p>
                <ul>
                  <li>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                    >
                      <i className="fa fa-facebook" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Twitter"
                    >
                      <i className="fa fa-twitter" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                    >
                      <i className="fa fa-instagram" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 mar-bottom-10">
              <div className="tripadvisor-logo text-center">
                <img src="/assets/images/tripadvisor.png" alt="Tripadvisor" />
              </div>
            </div>
            <div className="col-lg-4 mar-bottom-10">
              <div className="copyright-links mar-bottom-20">
                <ul>
                  <li>
                    <Link href={routes.rooms.list}>Accommodations</Link>
                  </li>
                  <li>
                    <Link href={routes.rooms.list}>Book Now</Link>
                  </li>
                  <li>
                    <Link href={routes.home}>Terms and Conditions</Link>
                  </li>
                </ul>
              </div>
              <div className="playstore-links">
                <img
                  src="/assets/images/icons/appstore.png"
                  alt="Download on App Store"
                  className="mar-right-10"
                />
                <img
                  src="/assets/images/icons/googleplay.png"
                  alt="Get it on Google Play"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
