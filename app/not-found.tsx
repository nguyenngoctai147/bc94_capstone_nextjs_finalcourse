import Link from "next/link";
import { routes } from "@/config/routes";
import { PageTemplate } from "@/templates/PageTemplate";
export default function NotFound() {
  return <PageTemplate title="404" breadcrumb="Not Found">
    <main className="py-5">
      <p className="eyebrow">404</p>
      <h1>Không tìm thấy trang</h1>
      <Link href={routes.home}>Về trang chủ</Link>
    </main>
  </PageTemplate>;
}
