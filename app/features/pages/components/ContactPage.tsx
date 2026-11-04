"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { siteInfo } from "@/constants/site";
import styles from "@/theme/features/pages/hotux-pages.module.css";

type ContactValues = { firstName: string; lastName: string; email: string; phone: string; message: string };
type ContactErrors = Partial<Record<keyof ContactValues, string>>;
const initialValues: ContactValues = { firstName: "", lastName: "", email: "", phone: "", message: "" };

const supportItems = [
  ["fa-user", "Hỗ trợ khách hàng", "Giải đáp thông tin tài khoản và cách sử dụng hệ thống."],
  ["fa-wrench", "Hỗ trợ kỹ thuật", "Tiếp nhận vấn đề khi tìm kiếm, đăng nhập hoặc xem dữ liệu."],
  ["fa-calendar-check-o", "Tư vấn đặt phòng", "Hướng dẫn kiểm tra ngày trống, chọn phòng và xác nhận."],
] as const;

const validate = (values: ContactValues): ContactErrors => {
  const errors: ContactErrors = {};
  if (!values.firstName.trim()) errors.firstName = "Vui lòng nhập tên.";
  if (!values.lastName.trim()) errors.lastName = "Vui lòng nhập họ.";
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Email chưa đúng định dạng.";
  if (values.phone && !/^[0-9+()\s.-]{8,20}$/.test(values.phone)) errors.phone = "Số điện thoại chưa hợp lệ.";
  if (values.message.trim().length < 10) errors.message = "Nội dung cần ít nhất 10 ký tự.";
  return errors;
};

export function ContactPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const key = event.target.name as keyof ContactValues;
    setValues((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitted(true);
  };

  return (
    <section className={styles.contactPage}>
      <div className="container">
        <div className={styles.contactIntro}>
          <span className={styles.eyebrow}>Liên hệ Hotux</span>
          <h2>Chúng tôi luôn sẵn sàng hỗ trợ bạn</h2>
          <p>Liên hệ khi bạn cần tư vấn điểm đến, hỗ trợ tài khoản hoặc giải đáp về đặt phòng.</p>
        </div>

        <div className={styles.contactChannels}>
          <a className={styles.channelCard} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteInfo.address)}`} target="_blank" rel="noreferrer">
            <span className={styles.channelIcon}><i className="fa fa-map-marker" /></span>
            <span><strong>Địa chỉ</strong><span>{siteInfo.address}</span></span>
          </a>
          <a className={styles.channelCard} href={`tel:${siteInfo.phone}`}>
            <span className={styles.channelIcon}><i className="fa fa-phone" /></span>
            <span><strong>Điện thoại</strong><span>{siteInfo.phoneLabel}</span></span>
          </a>
          <a className={styles.channelCard} href={`mailto:${siteInfo.email}`}>
            <span className={styles.channelIcon}><i className="fa fa-envelope" /></span>
            <span><strong>Email hỗ trợ</strong><span>{siteInfo.email}</span></span>
          </a>
        </div>

        <div className={styles.supportGrid}>
          {supportItems.map(([icon, title, description]) => (
            <article className={styles.supportCard} key={title}>
              <span className={styles.supportIcon}><i className={`fa ${icon}`} /></span>
              <div><h2>{title}</h2><p>{description}</p></div>
            </article>
          ))}
        </div>

        <div className={styles.contactPanel}>
          <aside className={styles.contactAside}>
            <span className={styles.eyebrow}>Hotux Support</span>
            <h2>Chuyến đi của bạn luôn có người đồng hành</h2>
            <p>Gửi câu hỏi cho chúng tôi. Đội ngũ Hotux sẽ phản hồi qua email và hỗ trợ bạn hoàn tất kế hoạch lưu trú.</p>
            <ul>
              <li><i className="fa fa-clock-o" /><span><strong>Hỗ trợ nhanh chóng</strong>Phản hồi trong giờ làm việc.</span></li>
              <li><i className="fa fa-shield" /><span><strong>Thông tin được bảo mật</strong>Chỉ dùng để xử lý yêu cầu của bạn.</span></li>
            </ul>
          </aside>

          <div id="contact-form" className={styles.contactForm}>
            <div className={styles.formHeading}><span className={styles.eyebrow}>Gửi yêu cầu</span><h2>Giữ liên lạc</h2><p>Vui lòng điền đầy đủ thông tin để Hotux có thể phản hồi chính xác.</p></div>
            {submitted && <div className="alert alert-success" role="status">Nội dung hợp lệ. Chúng tôi sẽ phản hồi qua email <strong>{values.email}</strong>.</div>}
            <form noValidate onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}><label htmlFor="contact-first-name">Tên <span>*</span></label><input id="contact-first-name" name="firstName" className="form-control" placeholder="Nhập tên" value={values.firstName} onChange={handleChange} aria-invalid={Boolean(errors.firstName)} />{errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}</div>
                <div className={styles.formGroup}><label htmlFor="contact-last-name">Họ <span>*</span></label><input id="contact-last-name" name="lastName" className="form-control" placeholder="Nhập họ" value={values.lastName} onChange={handleChange} aria-invalid={Boolean(errors.lastName)} />{errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}</div>
                <div className={styles.formGroup}><label htmlFor="contact-email">Email <span>*</span></label><input id="contact-email" name="email" type="email" className="form-control" placeholder="email@domain.com" value={values.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} />{errors.email && <span className={styles.fieldError}>{errors.email}</span>}</div>
                <div className={styles.formGroup}><label htmlFor="contact-phone">Số điện thoại</label><input id="contact-phone" name="phone" className="form-control" placeholder="Không bắt buộc" value={values.phone} onChange={handleChange} aria-invalid={Boolean(errors.phone)} />{errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}</div>
              </div>
              <div className={styles.formGroup}><label htmlFor="contact-message">Nội dung cần hỗ trợ <span>*</span></label><textarea id="contact-message" name="message" className="form-control" placeholder="Hãy cho chúng tôi biết bạn cần hỗ trợ điều gì..." value={values.message} onChange={handleChange} aria-invalid={Boolean(errors.message)} />{errors.message && <span className={styles.fieldError}>{errors.message}</span>}</div>
              <button type="submit" className={`btn ${styles.submitButton}`}>Gửi yêu cầu <i className="fa fa-paper-plane ms-2" /></button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
