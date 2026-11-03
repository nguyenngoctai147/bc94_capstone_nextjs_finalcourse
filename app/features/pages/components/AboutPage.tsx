"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { routes } from "@/config/routes";
import { siteInfo } from "@/config/site";
import styles from "@/css/features/pages/hotux-pages.module.css";

const highlights = [
  ["fa-tree", "Không gian gần thiên nhiên"],
  ["fa-star", "Chỗ nghỉ được chọn lọc"],
  ["fa-calendar-check-o", "Đặt phòng trực tuyến"],
] as const;

const faqs = [
  ["Làm sao chọn chỗ nghỉ phù hợp?", "Hãy bắt đầu với điểm đến, ngày lưu trú và số khách. Sau đó lọc phòng theo số phòng ngủ, mức giá và những tiện nghi cần thiết."],
  ["Tôi cần đăng nhập khi nào?", "Bạn có thể khám phá phòng trước khi đăng nhập. Tài khoản chỉ cần thiết khi xác nhận đặt phòng và xem lại lịch sử của mình."],
  ["Giá phòng được tính như thế nào?", "Tổng tạm tính bằng giá mỗi đêm nhân với số đêm. Những phụ phí phát sinh tại nơi lưu trú sẽ được thông báo trực tiếp."],
  ["Tôi có thể kiểm tra lại đặt phòng ở đâu?", "Sau khi đặt thành công, mở mục Đặt phòng của tôi để xem mã đặt phòng, ngày nhận, ngày trả và số khách."],
] as const;

const team = [
  { name: "Minh Anh", role: "Điều hành trải nghiệm", image: "/assets/images/team1.jpg" },
  { name: "Ngọc Lan", role: "Quản lý lưu trú", image: "/assets/images/team2.jpg" },
  { name: "Hoàng Nam", role: "Chăm sóc khách hàng", image: "/assets/images/team3.jpg" },
  { name: "Thu Hà", role: "Phát triển đối tác", image: "/assets/images/team4.jpg" },
] as const;

const reviews = [
  { name: "Mai Phương", place: "Hà Nội", image: "/assets/images/review1.jpg", text: "Thông tin phòng rõ ràng, các bước chọn ngày và xác nhận rất dễ theo dõi." },
  { name: "Quang Huy", place: "Đà Nẵng", image: "/assets/images/review2.jpg", text: "Tôi tìm được phòng phù hợp cho cả nhóm và kiểm tra tiện nghi ngay trên một trang." },
] as const;

const services = [
  { title: "Ẩm thực", subtitle: "Bữa sáng và bữa tối", image: "/assets/images/service1.jpg" },
  { title: "Thư giãn", subtitle: "Không gian nghỉ ngơi mỗi ngày", image: "/assets/images/service2.jpg" },
  { title: "Không gian chung", subtitle: "Phù hợp cho nhóm và gia đình", image: "/assets/images/service3.jpg" },
] as const;

export function AboutPage() {
  const [activeFaq, setActiveFaq] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <section className="about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="about-para mar-top-50">
                <h3>Về {siteInfo.name}</h3>
                <h4>Chọn căn phòng phù hợp với sở thích và ngân sách của bạn</h4>
                <p>{siteInfo.description}</p>
                <h5 className="text-capitalize">Mọi thông tin quan trọng của phòng và hành trình đặt chỗ được trình bày trong một luồng thống nhất.</h5>
                <div className="about-para-list mar-top-20"><div className="row">
                  {highlights.map(([icon, label]) => <div className="col-md-4 col-sm-4" key={label}><div className="about-icon"><i className={`fa ${icon}`} aria-hidden="true" /> {label}</div></div>)}
                </div></div>
                <Link href={routes.rooms.list} className="btn btn-orange mar-top-20">Khám phá chỗ nghỉ</Link>
              </div>
            </div>
            <div className="col-lg-4"><div className={`about-us-image mar-top-50 ${styles.aboutMedia}`}><Image src="/assets/images/gallery/gallery1.jpg" alt="Không gian lưu trú của Hotux" width={800} height={800} sizes="(max-width: 991px) 100vw, 33vw" /></div></div>
          </div>
        </div>
      </section>

      <section className="about-faq">
        <div className="container"><div className="row align-items-center">
          <div className="col-lg-5"><div className={`about-us-image ${styles.aboutMedia}`}><Image src="/assets/images/gallery/gallery2.jpg" alt="Khu nghỉ dưỡng" width={800} height={800} sizes="(max-width: 991px) 100vw, 42vw" /></div></div>
          <div className="col-lg-7"><div className="info-detail"><div className="accrodion-grp" aria-label="Câu hỏi thường gặp">
            {faqs.map(([question, answer], index) => {
              const open = index === activeFaq;
              return <div className={`accrodion ${open ? "active" : ""}`} key={question}>
                <button className={`accrodion-title ${styles.accordionButton}`} type="button" aria-expanded={open} onClick={() => setActiveFaq(open ? -1 : index)}><h4>{question}</h4></button>
                {open && <div className="accrodion-content"><div className="inner"><p>{answer}</p></div></div>}
              </div>;
            })}
          </div></div></div>
        </div></div>
      </section>

      <section className="video-box"><div className="container"><div className="section-title">
        <h3 className="white mar-0">Khám phá Hotux</h3>
        <div className="call-button"><button type="button" className="play-btn" aria-label="Mở video giới thiệu" onClick={() => setVideoOpen(true)}><i className="fa fa-play" aria-hidden="true" /></button></div>
        <div className="video-figure" /><h4 className="white mar-0">Một hành trình lưu trú đáng nhớ</h4>
      </div></div></section>
      {videoOpen && <div className={styles.videoDialog} role="dialog" aria-modal="true" aria-label="Video giới thiệu">
        <button type="button" className={styles.videoClose} aria-label="Đóng video" onClick={() => setVideoOpen(false)}>×</button>
        <video className={styles.video} src="/assets/images/video.mp4" controls autoPlay />
      </div>}

      <section className="about-team"><div className="container">
        <div className="section-title"><h2>Đội ngũ <span>Hotux</span></h2><p>Những người đồng hành để mỗi bước tìm kiếm, lựa chọn và đặt phòng trở nên rõ ràng hơn.</p></div>
        <div className="row team-slider">{team.map((member) => <div className="col-lg-3 col-md-6 mar-bottom-30" key={member.name}><article className="team-item">
          <div className={`team-image ${styles.teamMedia}`}><Image src={member.image} alt={member.name} width={700} height={900} sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw" /></div>
          <div className="team-content"><h4>{member.name}</h4><p>{member.role}</p></div>
        </article></div>)}</div>
      </div></section>

      <section className="reviews"><div className="container">
        <div className="section-title title-white"><h2>Cảm nhận <span>khách hàng</span></h2><p>Những chia sẻ từ khách đã sử dụng luồng tìm kiếm và đặt phòng.</p></div>
        <div className={`review-slider ${styles.reviewGrid}`}>{reviews.map((review) => <article className="slider-item" key={review.name}>
          <div className={`slider-image ${styles.reviewMedia}`}><Image src={review.image} alt="" width={120} height={120} /></div>
          <div className="slider-content"><p>{review.text}</p><h4>{review.name}</h4><span>{review.place}</span></div>
          <div className="slider-quote"><Image src="/assets/images/icons/quote.png" alt="" width={48} height={36} /></div>
        </article>)}</div>
      </div></section>

      <section className="services pad-bottom-70"><div className="container">
        <div className="section-title"><h2>Dịch vụ <span>nổi bật</span></h2><p>Các tiện ích tạo nên trải nghiệm lưu trú trọn vẹn cho khách cá nhân, gia đình và nhóm bạn.</p></div>
        <div className="service-outer"><div className="row">{services.map((service) => <div className="col-lg-4 col-md-6 mar-bottom-30" key={service.title}><article className="service-item">
          <div className={`service-image ${styles.serviceMedia}`}><Image src={service.image} alt={service.title} width={369} height={500} sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw" /></div>
          <div className="service-content"><h4>{service.title}</h4><p>{service.subtitle}</p></div>
        </article></div>)}</div></div>
      </div></section>
    </>
  );
}
