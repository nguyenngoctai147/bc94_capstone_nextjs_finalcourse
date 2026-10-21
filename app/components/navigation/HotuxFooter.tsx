import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/assets/images/logo.png";
import { routes } from "@/config/routes";
import { siteInfo } from "@/config/site";

const quickLinks = [
  ["Trang chủ", routes.home], ["Về chúng tôi", routes.about],
  ["Cẩm nang lưu trú", routes.blog], ["Liên hệ", routes.contact],
] as const;
const stayLinks = [
  ["Tìm chỗ nghỉ", routes.rooms.list], ["Đặt phòng", routes.reservation.availability],
  ["Đặt phòng của tôi", routes.bookings], ["Tài khoản", routes.account],
] as const;

export function HotuxFooter() {
  return (
    <footer className="hotux-footer">
      <div className="footer-top pad-bottom-20">
        <div className="container">
          <div className="footer-content">
            <div className="row g-4">
              <div className="col-lg-3 col-md-6">
                <div className="footer-logo mb-3"><Link href={routes.home}><Image src={logo} alt={siteInfo.name} /></Link></div>
                <p>{siteInfo.description}</p>
              </div>
              <div className="col-lg-3 col-md-6 quick-links">
                <h2 className="h4">Khám phá</h2>
                <ul>{quickLinks.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
              </div>
              <div className="col-lg-3 col-md-6 quick-links">
                <h2 className="h4">Chuyến đi của bạn</h2>
                <ul>{stayLinks.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
              </div>
              <div className="col-lg-3 col-md-6 footer-contact">
                <h2 className="h4">Liên hệ</h2>
                <ul>
                  <li><a href={`tel:${siteInfo.phone}`}>{siteInfo.phoneLabel}</a></li>
                  <li><a href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a></li>
                  <li>{siteInfo.address}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-copyright pad-bottom-20">
        <div className="container"><p>© {new Date().getFullYear()} {siteInfo.name}. Khám phá và lưu trú.</p></div>
      </div>
    </footer>
  );
}
