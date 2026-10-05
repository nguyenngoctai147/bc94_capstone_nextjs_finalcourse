import Link from "next/link";
import { routes } from "@/config/routes";
import { Icon } from "./AdminIcon";

export function AdminFooter() {
  return (
    <footer className="footer d-flex flex-column flex-md-row align-items-center justify-content-between px-4 py-3 border-top small">
      <p className="text-muted mb-1 mb-md-0">
        Copyright © 2022 <Link href={routes.home}>Hotux</Link>.
      </p>
      <p className="text-muted">
        Powered By{" "}
        <Icon className="mb-1 text-primary ms-1 icon-sm" name="heart" /> Bizberg
        Themes
      </p>
    </footer>
  );
}
