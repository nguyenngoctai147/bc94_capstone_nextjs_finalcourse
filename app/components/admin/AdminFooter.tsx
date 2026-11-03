import { Icon } from "./AdminIcon";

export function AdminFooter() {
  return (
    <footer className="footer admin-footer">
      <div className="admin-footer-brand">
        <span className="admin-footer-mark"><Icon name="box" size={18} /></span>
        <div>
          <strong>Hotux Admin</strong>
          <span>Quản lý lưu trú thuận tiện và hiệu quả</span>
        </div>
      </div>
      <p className="admin-footer-copyright">© {new Date().getFullYear()} Hotux. All rights reserved.</p>
    </footer>
  );
}
