"use client";

import { useState, type ChangeEvent } from "react";
import { roomAmenities, type AmenityKey } from "../room-amenities";
import type { RoomFiltersValue } from "../room-list.utils";
import styles from "./RoomList.module.css";

export type RoomFiltersProps = {
  values: RoomFiltersValue;
  highestPrice: number;
  disabled: boolean;
  onChange: (values: RoomFiltersValue) => void;
  onReset: () => void;
};

export function RoomFilters(props: RoomFiltersProps) {
  const { values, highestPrice, disabled, onChange, onReset } = props;
  const [isOpen, setIsOpen] = useState(false);
  const activePrice = Math.min(values.maxPrice ?? highestPrice, highestPrice);
  const selectedCount = values.amenities.length + (values.bedrooms !== "all" ? 1 : 0) + (values.maxPrice !== null ? 1 : 0);

  const handleBedroomsChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...values, bedrooms: event.target.value as RoomFiltersValue["bedrooms"] });
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...values, maxPrice: Number(event.target.value) });
  };

  const handleAmenityChange = (key: AmenityKey, checked: boolean) => {
    const amenities = checked ? [...values.amenities, key] : values.amenities.filter((item) => item !== key);
    onChange({ ...values, amenities });
  };

  const renderAmenities = () => roomAmenities.map(({ key, label }) => (
    <div className="form-check mb-2" key={key}>
      <input id={`amenity-${key}`} className="form-check-input" type="checkbox" checked={values.amenities.includes(key)} disabled={disabled} onChange={(event) => handleAmenityChange(key, event.target.checked)} />
      <label className="form-check-label" htmlFor={`amenity-${key}`}>{label}</label>
    </div>
  ));

  return (
    <aside className="col-lg-3 sidebar" aria-label="Bộ lọc phòng">
      <button type="button" className={`btn btn-outline-secondary ${styles.filterToggle}`} aria-expanded={isOpen} aria-controls="room-filters" onClick={() => setIsOpen((current) => !current)}>
        {isOpen ? "Ẩn bộ lọc" : "Mở bộ lọc"}{selectedCount > 0 ? ` · ${selectedCount} đang chọn` : ""}
      </button>
      <div id="room-filters" className={`list-sidebar room-filters ${styles.filters} ${isOpen ? styles.filtersExpanded : ""}`} aria-disabled={disabled}>
        <h3 className="h5">Lọc chỗ nghỉ</h3>
        <div className="room-type list-sidebar-item">
          <label htmlFor="bedrooms" className="form-label">Số phòng ngủ</label>
          <select id="bedrooms" className="form-select" value={values.bedrooms} disabled={disabled} onChange={handleBedroomsChange}>
            <option value="all">Tất cả</option><option value="1">1 phòng ngủ</option><option value="2">2 phòng ngủ</option><option value="3">Từ 3 phòng ngủ</option>
          </select>
        </div>
        {highestPrice > 0 && <div className="price list-sidebar-item">
          <label htmlFor="room-price" className="form-label">Giá tối đa / đêm</label>
          <input id="room-price" className="form-range" type="range" min="0" max={highestPrice} step="1" value={activePrice} disabled={disabled} onChange={handlePriceChange} />
          <output htmlFor="room-price">${activePrice.toLocaleString("vi-VN")}</output>
        </div>}
        <div className="services list-sidebar-item"><h4 className="h6">Tiện nghi</h4>{renderAmenities()}</div>
        {selectedCount > 0 && <button type="button" className="btn btn-outline-secondary w-100" disabled={disabled} onClick={onReset}>Xóa bộ lọc</button>}
        <div className="info-1 list-sidebar-item"><h4>Cần hỗ trợ?</h4><p className="mar-0">Liên hệ chúng tôi để được tư vấn chỗ nghỉ phù hợp.</p><p className="mar-0"><i className="fa fa-phone" aria-hidden="true" /> 1900 0000</p></div>
      </div>
    </aside>
  );
}
