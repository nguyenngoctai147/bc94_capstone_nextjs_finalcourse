"use client";

import { Fragment } from "react";

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

  const pages = pageCount <= 5
    ? Array.from({ length: pageCount }, (_, index) => index + 1)
    : Array.from(new Set([1, page - 1, page, page + 1, pageCount].filter((item) => item > 0 && item <= pageCount))).sort((a, b) => a - b);

  const renderPageButton = (value: number) => (
    <li className={value === page ? "active" : ""} key={value}>
      <button type="button" className="page-link" aria-current={value === page ? "page" : undefined} onClick={() => onChange(value)}>
        {value}
      </button>
    </li>
  );

  return (
    <nav className="pagination-content text-center" aria-label="Phân trang chỗ nghỉ">
      <ul className="pagination">
        <li className={page === 1 ? "disabled" : ""}>
          <button type="button" className="page-link" aria-label="Trang trước" disabled={page === 1} onClick={() => onChange(page - 1)}>
            <i className="fa fa-angle-double-left" aria-hidden="true" />
          </button>
        </li>
        {pages.map((value, index) => (
          <Fragment key={value}>
            {index > 0 && value - pages[index - 1] > 1 && <li className="disabled"><span className="page-link">…</span></li>}
            {renderPageButton(value)}
          </Fragment>
        ))}
        <li className={page === pageCount ? "disabled" : ""}>
          <button type="button" className="page-link" aria-label="Trang sau" disabled={page === pageCount} onClick={() => onChange(page + 1)}>
            <i className="fa fa-angle-double-right" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
