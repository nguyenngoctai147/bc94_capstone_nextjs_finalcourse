"use client";

import { Icon } from "./AdminIcon";

export type AdminFilterOption = {
  label: string;
  value: string;
};

export function AdminListToolbar({
  title,
  query,
  searchPlaceholder,
  pageSize,
  filterLabel,
  filterValue,
  filterOptions = [],
  loading,
  onQueryChange,
  onPageSizeChange,
  onFilterChange,
  onRefresh,
}: {
  title: string;
  query: string;
  searchPlaceholder: string;
  pageSize: number;
  filterLabel?: string;
  filterValue: string;
  filterOptions?: readonly AdminFilterOption[];
  loading: boolean;
  onQueryChange: (value: string) => void;
  onPageSizeChange: (value: number) => void;
  onFilterChange: (value: string) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="search-box p-4 bg-white rounded mb-3 box-shadow">
      <form className="forms-sample" onSubmit={(event) => event.preventDefault()}>
        <div className="row align-items-end g-3">
          <div className="col-xl-3 col-lg-12">
            <h2 className="h5 mb-0">{title}</h2>
          </div>
          <div className={filterOptions.length > 0 ? "col-xl-3 col-md-5" : "col-xl-5 col-md-7"}>
            <label className="form-label" htmlFor="admin-list-search">
              Tìm kiếm
            </label>
            <div className="input-group">
              <span className="input-group-text" aria-hidden="true">
                <Icon name="search" size={18} />
              </span>
              <input
                id="admin-list-search"
                className="form-control"
                type="search"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(event) => onQueryChange(event.currentTarget.value)}
              />
            </div>
          </div>
          {filterOptions.length > 0 && (
            <div className="col-xl-3 col-md-4">
              <label className="form-label" htmlFor="admin-list-filter">
                {filterLabel ?? "Bộ lọc"}
              </label>
              <select
                id="admin-list-filter"
                className="form-select"
                value={filterValue}
                onChange={(event) => onFilterChange(event.currentTarget.value)}
              >
                <option value="">Tất cả</option>
                {filterOptions.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="col-xl-2 col-md-3">
            <label className="form-label" htmlFor="admin-list-size">
              Hiển thị
            </label>
            <select
              id="admin-list-size"
              className="form-select"
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.currentTarget.value))}
            >
              {[10, 20, 30].map((size) => (
                <option value={size} key={size}>
                  {size} dòng
                </option>
              ))}
            </select>
          </div>
          <div className="col-xl-1 col-md-12 d-grid">
            <button
              className="btn btn-outline-primary"
              type="button"
              disabled={loading}
              aria-label="Làm mới danh sách"
              onClick={onRefresh}
            >
              Làm mới
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
