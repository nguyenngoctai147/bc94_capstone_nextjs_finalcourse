"use client";
import { useState } from "react";
import { Alert, Button, Card, EmptyState, Input, LoadingSpinner, Pagination, Select, Textarea } from "@/components/ui";
import { useForm } from "@/hooks/useForm";
import { required, email, minLength } from "@/lib/validation/rules";
export function ComponentShowcase() {
  const [saved, setSaved] = useState(false); const [page, setPage] = useState(1);
  const form = useForm({ name: "", email: "", type: "room", note: "" }, { name: [required()], email: [required(), email], note: [minLength(10)] });
  return <><h1 className="mb-4">Bộ component Bootstrap</h1><div className="row g-4">
    <div className="col-lg-6"><Card title="Form & validation">
      {saved && <Alert variant="success">Dữ liệu hợp lệ. Đây là form minh họa, chưa gửi lên backend.</Alert>}
      <form noValidate onSubmit={form.handleSubmit(() => setSaved(true))}>
        <Input label="Họ tên" required {...form.field("name")} />
        <Input label="Email" type="email" required {...form.field("email")} />
        <Select label="Nhu cầu" options={[{ label: "Đặt phòng", value: "room" }, { label: "Tư vấn", value: "help" }]} {...form.field("type")} />
        <Textarea label="Ghi chú" {...form.field("note")} />
        <div className="d-flex gap-2"><Button type="submit">Kiểm tra form</Button><Button variant="outline-secondary" onClick={() => { form.reset(); setSaved(false); }}>Làm mới</Button></div>
      </form>
    </Card></div>
    <div className="col-lg-6"><Card title="Trạng thái & thao tác">
      <div className="d-flex gap-2 flex-wrap mb-4"><Button>Primary</Button><Button variant="outline-secondary">Secondary</Button><Button variant="danger">Danger</Button><Button loading>Đang lưu</Button></div>
      <Alert>Thông báo dành cho người dùng.</Alert><div className="mb-4"><LoadingSpinner /></div>
      <EmptyState title="Chưa có phòng" description="Danh sách sẽ xuất hiện tại đây." />
      <div className="mt-4"><Pagination page={page} pageSize={10} total={35} onChange={setPage} /></div>
    </Card></div>
  </div></>;
}
