"use client";

import { Pagination } from "@/component/ui/Pagination";

export function AdminPagination({
  page,
  pageSize,
  total,
  onChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}) {
  return <Pagination page={page} pageSize={pageSize} total={total} onChange={onChange} ariaLabel="Phân trang danh sách quản trị" />;
}
