"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { routes } from "@/config/routes";
import { siteInfo } from "@/config/site";
import styles from "@/css/features/pages/hotux-pages.module.css";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Vui lòng nhập email hợp lệ.");
      setChecked(false);
      return;
    }
    setError("");
    setChecked(true);
  };

  return (
    <section className="forgot-password"><div className="container">
      <div className="fp-content">
        <h2>Quên mật khẩu?</h2>
        <p>Nhập email của tài khoản để kiểm tra thông tin. Chức năng gửi liên kết đặt lại mật khẩu tự động đang được hoàn thiện.</p>
        {checked && <div className="alert alert-info" role="status">Email đã hợp lệ. Vui lòng liên hệ <a href={`mailto:${siteInfo.email}`}>{siteInfo.email}</a> để được hỗ trợ đặt lại mật khẩu.</div>}
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group"><label htmlFor="forgot-email">Email</label><input id="forgot-email" type="email" className="form-control" placeholder="email@example.com" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); setChecked(false); }} aria-invalid={Boolean(error)} />{error && <span className={styles.fieldError}>{error}</span>}</div>
          <div className="form-btn mar-top-20"><button type="submit" className="btn btn-orange">Kiểm tra email</button></div>
        </form>
        <p className="mar-top-20"><Link href={routes.auth.login}><i className="fa fa-angle-left" /> Quay lại đăng nhập</Link></p>
      </div>
    </div></section>
  );
}
