"use client";

import { Pagination } from "@/component/ui/Pagination";

type RoomCataloguePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
};

export function RoomCataloguePagination(props: RoomCataloguePaginationProps) {
  const { page, pageSize, total, onChange } = props;
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;
  return <Pagination page={page} pageSize={pageSize} total={total} onChange={onChange} ariaLabel="Phân trang chỗ nghỉ" />;
}
