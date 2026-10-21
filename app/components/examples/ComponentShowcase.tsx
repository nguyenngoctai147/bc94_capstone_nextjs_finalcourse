"use client";

import { useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  Card,
  EmptyState,
  Input,
  LoadingSpinner,
  Pagination,
  Select,
  Textarea,
  Typography,
} from "@/components/ui";
import { useForm } from "@/hooks/useForm";
import { required, email, minLength } from "@/lib/validation/rules";
import { DesignSystemGuide } from "./DesignSystemGuide";

export function ComponentShowcase() {
  const [saved, setSaved] = useState(false);
  const [page, setPage] = useState(1);
  const form = useForm(
    { name: "", email: "", type: "room", note: "" },
    { name: [required()], email: [required(), email], note: [minLength(10)] },
  );

  const handleCheckForm = form.handleSubmit(() => setSaved(true));
  const handleReset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.reset();
    setSaved(false);
  };

  return (
    <>
      <DesignSystemGuide />
      <section id="components" className="ds-foundation ds-component-showcase">
        <Typography as="h2" variant="h2" className="mb-4">
          05. Component & trạng thái
        </Typography>
        <div className="row g-4">
          <div className="col-lg-6">
            <Card title="Form & validation">
              {saved && (
                <Alert variant="success">
                  Dữ liệu hợp lệ. Đây là form minh họa, chưa gửi lên backend.
                </Alert>
              )}
              <form noValidate onSubmit={handleCheckForm} onReset={handleReset}>
                <Input
                  label="Họ tên"
                  name="name"
                  required
                  value={form.values.name}
                  error={form.errors.name}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={form.values.email}
                  error={form.errors.email}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <Select
                  label="Nhu cầu"
                  name="type"
                  options={[
                    { label: "Đặt phòng", value: "room" },
                    { label: "Tư vấn", value: "help" },
                  ]}
                  value={form.values.type}
                  error={form.errors.type}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <Textarea
                  label="Ghi chú"
                  name="note"
                  value={form.values.note}
                  error={form.errors.note}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                />
                <div className="d-flex gap-2">
                  <Button type="submit" loading={form.submitting}>
                    Kiểm tra form
                  </Button>
                  <Button type="reset" variant="outline-secondary">
                    Làm mới
                  </Button>
                </div>
              </form>
            </Card>
          </div>
          <div className="col-lg-6">
            <Card title="Trạng thái & thao tác">
              <div className="d-flex gap-2 flex-wrap mb-4">
                <Button>Primary</Button>
                <Button variant="outline-secondary">Secondary</Button>
                <Button variant="danger">Danger</Button>
                <Button loading>Đang lưu</Button>
              </div>
              <Alert>Thông báo dành cho người dùng.</Alert>
              <div className="mb-4">
                <LoadingSpinner />
              </div>
              <EmptyState
                title="Chưa có phòng"
                description="Danh sách sẽ xuất hiện tại đây."
              />
              <div className="mt-4">
                <Pagination
                  page={page}
                  pageSize={10}
                  total={35}
                  onChange={setPage}
                />
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
