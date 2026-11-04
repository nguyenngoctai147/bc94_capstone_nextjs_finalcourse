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
  const currentPage = Math.min(Math.max(1, page), count);
  return (
    <nav aria-label="Phân trang" className="d-flex align-items-center gap-3">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
      >
        Trước
      </button>
      <span aria-live="polite">
        Trang {currentPage} / {count}
      </span>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm"
        disabled={currentPage >= count}
        onClick={() => onChange(currentPage + 1)}
      >
        Sau
      </button>
    </nav>
  );
}
