"use client";

import { useState, type ChangeEvent, type CSSProperties } from "react";
import { roomAmenities, type AmenityKey } from "../room-amenities";
import type { RoomFiltersValue } from "../room-list.utils";
import styles from "@/css/features/rooms/room-list.module.css";

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
  const selectedCount = values.amenities.length + (values.bedrooms !== "all" ? 1 : 0) + (values.maxPrice !== null ? 1 : 0) + (values.minRating === null ? 0 : 1);
  const priceProgress = highestPrice ? (activePrice / highestPrice) * 100 : 0;

  const handleBedroomsChange = (value: Exclude<RoomFiltersValue["bedrooms"], "all">) => {
    onChange({ ...values, bedrooms: values.bedrooms === value ? "all" : value });
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...values, maxPrice: Number(event.target.value) });
  };

  const handleAmenityChange = (key: AmenityKey, checked: boolean) => {
    const amenities = checked ? [...values.amenities, key] : values.amenities.filter((item) => item !== key);
    onChange({ ...values, amenities });
  };

  const handleRatingChange = (rating: Exclude<RoomFiltersValue["minRating"], null>) => {
    onChange({ ...values, minRating: values.minRating === rating ? null : rating });
  };

  const renderBedrooms = () => ([
    ["1", "Phòng đơn"],
    ["2", "Phòng đôi"],
    ["3", "Từ 3 phòng ngủ"],
  ] as const).map(([value, label]) => (
    <div className="pretty p-default p-thick p-pulse mar-bottom-15" key={value}>
      <input id={`bedrooms-${value}`} type="checkbox" checked={values.bedrooms === value} disabled={disabled} onChange={() => handleBedroomsChange(value)} />
      <div className="state p-warning-o"><label htmlFor={`bedrooms-${value}`}>{label}</label></div>
    </div>
  ));

  const renderAmenities = () => roomAmenities.map(({ key, label }) => (
    <div className="pretty p-default p-thick p-pulse mar-bottom-15" key={key}>
      <input id={`amenity-${key}`} type="checkbox" checked={values.amenities.includes(key)} disabled={disabled} onChange={(event) => handleAmenityChange(key, event.target.checked)} />
      <div className="state p-warning-o"><label htmlFor={`amenity-${key}`}>{label}</label></div>
    </div>
  ));

  const renderRatings = () => ([5, 4, 3, 2, 1] as const).map((rating) => (
    <div className="pretty p-default p-thick p-pulse mar-bottom-15" key={rating}>
      <input id={`rating-${rating}`} type="checkbox" checked={values.minRating === rating} disabled={disabled} onChange={() => handleRatingChange(rating)} />
      <div className="state p-warning-o">
        <label htmlFor={`rating-${rating}`}>
          <span className={`rating ${styles.ratingStars}`} aria-label={`Từ ${rating} sao`}>
            {Array.from({ length: rating }, (_, index) => <span className="fa fa-star" aria-hidden="true" key={index} />)}
          </span>
        </label>
      </div>
    </div>
  ));

  return (
    <aside className="col-lg-3 sidebar" aria-label="Bộ lọc phòng">
      <button type="button" className={`btn btn-outline-secondary ${styles.filterToggle}`} aria-expanded={isOpen} aria-controls="room-filters" onClick={() => setIsOpen((current) => !current)}>
        {isOpen ? "Ẩn bộ lọc" : "Mở bộ lọc"}{selectedCount > 0 ? ` · ${selectedCount} đang chọn` : ""}
      </button>
      <div id="room-filters" className={`list-sidebar room-filters ${styles.filters} ${isOpen ? styles.filtersExpanded : ""}`} aria-disabled={disabled}>
        <div className="room-type list-sidebar-item">
          <h4>Loại phòng</h4>
          {renderBedrooms()}
        </div>
        {highestPrice > 0 && <div className="price list-sidebar-item">
          <h4>Giá</h4>
          <div className={styles.priceSlider}>
            <span className={styles.priceStartThumb} aria-hidden="true" />
            <input id="room-price" type="range" min="0" max={highestPrice} step="1" value={activePrice} disabled={disabled} onChange={handlePriceChange} style={{ "--price-progress": `${priceProgress}%` } as CSSProperties} />
            <div className={styles.priceValues}><output htmlFor="room-price">0 $</output><output htmlFor="room-price">{activePrice.toLocaleString("vi-VN")} $</output></div>
          </div>
        </div>}
        <div className="ratings list-sidebar-item"><h4>Đánh giá</h4>{renderRatings()}</div>
        <div className="services list-sidebar-item"><h4>Tiện nghi</h4>{renderAmenities()}</div>
        {selectedCount > 0 && <button type="button" className="btn btn-outline-secondary w-100" disabled={disabled} onClick={onReset}>Xóa bộ lọc</button>}
        <div className="info-1 list-sidebar-item"><h4>Cần hỗ trợ?</h4><p className="mar-0">Liên hệ chúng tôi để được tư vấn chỗ nghỉ phù hợp.</p><p className="mar-0"><i className="fa fa-phone" aria-hidden="true" /> 1900 0000</p></div>
      </div>
    </aside>
  );
}
