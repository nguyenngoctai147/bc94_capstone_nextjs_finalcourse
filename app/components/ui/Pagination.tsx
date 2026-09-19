"use client";
export function Pagination({
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
  const count = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  return (
    <nav aria-label="Phân trang" className="d-flex align-items-center gap-3">
      <button
        className="btn btn-outline-secondary btn-sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Trước
      </button>
      <span aria-live="polite">
        Trang {page} / {count}
      </span>
      <button
        className="btn btn-outline-secondary btn-sm"
        disabled={page >= count}
        onClick={() => onChange(page + 1)}
      >
        Sau
      </button>
    </nav>
  );
}
