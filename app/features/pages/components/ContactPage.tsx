"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { siteInfo } from "@/config/site";
import styles from "@/css/features/pages/hotux-pages.module.css";

type ContactValues = { firstName: string; lastName: string; email: string; phone: string; message: string };
type ContactErrors = Partial<Record<keyof ContactValues, string>>;
const initialValues: ContactValues = { firstName: "", lastName: "", email: "", phone: "", message: "" };

const supportItems = [
  ["Hỗ trợ khách hàng", "Giải đáp thông tin tài khoản và cách sử dụng hệ thống."],
  ["Hỗ trợ kỹ thuật", "Tiếp nhận vấn đề khi tìm kiếm, đăng nhập hoặc xem dữ liệu."],
  ["Tư vấn đặt phòng", "Hướng dẫn kiểm tra ngày trống, chọn phòng và xác nhận."],
] as const;

function validate(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!values.firstName.trim()) errors.firstName = "Vui lòng nhập tên.";
  if (!values.lastName.trim()) errors.lastName = "Vui lòng nhập họ.";
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Email chưa đúng định dạng.";
  if (values.phone && !/^[0-9+()\s.-]{8,20}$/.test(values.phone)) errors.phone = "Số điện thoại chưa hợp lệ.";
  if (values.message.trim().length < 10) errors.message = "Nội dung cần ít nhất 10 ký tự.";
  return errors;
}

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
    <section className="contact"><div className="container">
      <div className="contact-info"><div className="row">
        <div className="col-lg-4 col-md-12 mar-bottom-30"><div className="info-item"><div className="info-icon"><i className="fa fa-map-marker" /></div><div className="info-content"><p>{siteInfo.address}</p></div></div></div>
        <div className="col-lg-4 col-md-6 mar-bottom-30"><div className="info-item info-item-or"><div className="info-icon"><i className="fa fa-phone" /></div><div className="info-content"><p><a href={`tel:${siteInfo.phone}`}>{siteInfo.phoneLabel}</a></p><p>Hỗ trợ trong giờ làm việc</p></div></div></div>
        <div className="col-lg-4 col-md-6 mar-bottom-30"><div className="info-item"><div className="info-icon"><i className="fa fa-envelope" /></div><div className="info-content"><p><a href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a></p><p>Phản hồi yêu cầu hỗ trợ</p></div></div></div>
      </div></div>

      <div className="contact-support"><div className="row">{supportItems.map(([title, description]) => <div className="col-lg-4 col-md-6 mar-bottom-30" key={title}><article className="support-item"><h2 className="h4">{title}</h2><p className="mar-0">{description}</p></article></div>)}</div></div>

      <div className="contact-map"><div className="row g-0">
        <div className="col-lg-6"><div className={styles.mapPlaceholder}>
          <span className="eyebrow text-white">Hotux Support</span><h2 className="white mar-top-15">Luôn sẵn sàng hỗ trợ chuyến đi của bạn</h2>
          <p>Gửi thông tin qua biểu mẫu hoặc liên hệ trực tiếp với chúng tôi để được hướng dẫn về chỗ nghỉ và đặt phòng.</p>
          <p><i className="fa fa-map-marker me-2" /> {siteInfo.address}</p><p><i className="fa fa-phone me-2" /> <a href={`tel:${siteInfo.phone}`}>{siteInfo.phoneLabel}</a></p>
        </div></div>
        <div className="col-lg-6"><div id="contact-form" className="contact-form">
          <h2 className="h3">Giữ liên lạc</h2><p>Điền thông tin dưới đây; Hotux sẽ dùng email bạn cung cấp để phản hồi.</p>
          {submitted && <div className="alert alert-success" role="status">Biểu mẫu hợp lệ. Bạn có thể gửi nội dung tới <a href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a>.</div>}
          <form noValidate onSubmit={handleSubmit}>
            <div className="form-group"><label className="visually-hidden" htmlFor="contact-first-name">Tên</label><input id="contact-first-name" name="firstName" className="form-control" placeholder="Tên" value={values.firstName} onChange={handleChange} aria-invalid={Boolean(errors.firstName)} />{errors.firstName && <span className={styles.fieldError}>{errors.firstName}</span>}</div>
            <div className="form-group"><label className="visually-hidden" htmlFor="contact-last-name">Họ</label><input id="contact-last-name" name="lastName" className="form-control" placeholder="Họ" value={values.lastName} onChange={handleChange} aria-invalid={Boolean(errors.lastName)} />{errors.lastName && <span className={styles.fieldError}>{errors.lastName}</span>}</div>
            <div className="form-group"><label className="visually-hidden" htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" className="form-control" placeholder="Email" value={values.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} />{errors.email && <span className={styles.fieldError}>{errors.email}</span>}</div>
            <div className="form-group"><label className="visually-hidden" htmlFor="contact-phone">Điện thoại</label><input id="contact-phone" name="phone" className="form-control" placeholder="Số điện thoại (không bắt buộc)" value={values.phone} onChange={handleChange} aria-invalid={Boolean(errors.phone)} />{errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}</div>
            <div className="textarea"><label className="visually-hidden" htmlFor="contact-message">Nội dung</label><textarea id="contact-message" name="message" placeholder="Nội dung cần hỗ trợ" value={values.message} onChange={handleChange} aria-invalid={Boolean(errors.message)} />{errors.message && <span className={styles.fieldError}>{errors.message}</span>}</div>
            <div className="comment-btn text-end"><button type="submit" className="btn btn-orange">Kiểm tra nội dung</button></div>
          </form>
        </div></div>
      </div></div>
    </div></section>
  );
}
