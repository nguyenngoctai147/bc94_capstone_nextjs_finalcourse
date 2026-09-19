"use client";
import { Alert, Button } from "@/components/ui";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="container py-5"><Alert variant="danger">Không thể hiển thị trang này.</Alert><Button onClick={reset}>Thử lại</Button></div>;
}
