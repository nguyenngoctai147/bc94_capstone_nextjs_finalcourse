import Link from "next/link";
import { Card } from "@/components/ui";
import { adminNavigation } from "@/config/routes";
export default function Page() {
  return <><p className="eyebrow">Không gian quản trị</p><h1 className="mb-3">Quản lý lưu trú</h1>
    <p className="text-muted mb-4">Chọn mục để quản lý dữ liệu. Đăng nhập bằng tài khoản quản trị để truy cập danh sách.</p>
    <div className="row g-4">{adminNavigation.slice(1).map((item) => <div className="col-md-6 col-xl-4" key={item.href}><Card title={item.label}><Link href={item.href}>Mở danh sách →</Link></Card></div>)}</div>
  </>;
}
