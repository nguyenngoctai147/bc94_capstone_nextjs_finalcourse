"use client";

export function Pagination({
  page,
  pageSize,
  total,
  onChange,
  ariaLabel = "Phân trang",
}: {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  ariaLabel?: string;
}) {
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const startPage = Math.min(Math.max(1, currentPage - 1), Math.max(1, pageCount - 2));
  const visiblePages = Array.from({ length: Math.min(3, pageCount) }, (_, index) => startPage + index);

  return (
    <nav aria-label={ariaLabel} className="app-pagination">
      <span className="visually-hidden" aria-live="polite">Trang {currentPage} / {pageCount}</span>
      <ul className="pagination app-pagination__list">
        <li className={`page-item ${currentPage === 1 ? "is-disabled" : ""}`}>
          <button type="button" className="page-link app-pagination__button app-pagination__button--edge" disabled={currentPage === 1} onClick={() => onChange(currentPage - 1)}>Trước</button>
        </li>
        {visiblePages.map((item) => (
          <li className={`page-item ${item === currentPage ? "is-active" : ""}`} key={item}>
            <button type="button" className="page-link app-pagination__button" aria-current={item === currentPage ? "page" : undefined} onClick={() => onChange(item)}>{item}</button>
          </li>
        ))}
        <li className={`page-item ${currentPage === pageCount ? "is-disabled" : ""}`}>
          <button type="button" className="page-link app-pagination__button app-pagination__button--edge" disabled={currentPage === pageCount} onClick={() => onChange(currentPage + 1)}>Sau</button>
        </li>
      </ul>
    </nav>
  );
}
