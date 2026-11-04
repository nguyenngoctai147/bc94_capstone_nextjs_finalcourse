"use client";

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
  const pageCount = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const start = Math.max(1, currentPage - 1);
  const end = Math.min(pageCount, start + 2);
  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  return (
    <div className="row">
      <div className="dataTables_paginate">
        <nav aria-label="Phân trang danh sách quản trị">
          <ul className="pagination mb-0">
            <li className={`paginate_button page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                type="button"
                disabled={currentPage === 1}
                onClick={() => onChange(currentPage - 1)}
              >
                Trước
              </button>
            </li>
            {pages.map((item) => (
              <li
                className={`paginate_button page-item ${item === currentPage ? "active" : ""}`}
                aria-current={item === currentPage ? "page" : undefined}
                key={item}
              >
                <button className="page-link" type="button" onClick={() => onChange(item)}>
                  {item}
                </button>
              </li>
            ))}
            <li className={`paginate_button page-item ${currentPage === pageCount ? "disabled" : ""}`}>
              <button
                className="page-link"
                type="button"
                disabled={currentPage === pageCount}
                onClick={() => onChange(currentPage + 1)}
              >
                Sau
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
