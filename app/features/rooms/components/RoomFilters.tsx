"use client";

import { useState, type ChangeEvent, type CSSProperties } from "react";
import { roomAmenities, type AmenityKey } from "../room-amenities";
import type { RoomFiltersValue } from "../room-list.utils";
import { siteInfo } from "@/config/site";
import styles from "@/css/features/rooms/room-list.module.css";
import { RoomAmenityIcon } from "./RoomAmenityIcon";

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
    <label className={`${styles.filterOption} ${styles.compactOption}`} htmlFor={`bedrooms-${value}`} key={value}>
      <input className={styles.filterCheckbox} id={`bedrooms-${value}`} type="checkbox" checked={values.bedrooms === value} disabled={disabled} onChange={() => handleBedroomsChange(value)} />
      <span className={styles.checkmark} aria-hidden="true" />
      <span className={styles.optionText}>{label}</span>
    </label>
  ));

  const renderAmenities = () => roomAmenities.map(({ key, label }) => (
    <label className={styles.filterOption} htmlFor={`amenity-${key}`} key={key}>
      <input className={styles.filterCheckbox} id={`amenity-${key}`} type="checkbox" checked={values.amenities.includes(key)} disabled={disabled} onChange={(event) => handleAmenityChange(key, event.target.checked)} />
      <span className={styles.checkmark} aria-hidden="true" />
      <span className={styles.optionIcon}><RoomAmenityIcon amenity={key} /></span>
      <span className={styles.optionText}>{label}</span>
    </label>
  ));

  const renderRatings = () => ([5, 4, 3, 2, 1] as const).map((rating) => (
    <label className={`${styles.filterOption} ${styles.compactOption}`} htmlFor={`rating-${rating}`} key={rating}>
      <input className={styles.filterCheckbox} id={`rating-${rating}`} type="checkbox" checked={values.minRating === rating} disabled={disabled} onChange={() => handleRatingChange(rating)} />
      <span className={styles.checkmark} aria-hidden="true" />
      <span className={styles.ratingStars} aria-label={`Từ ${rating} sao`}>
        {Array.from({ length: rating }, (_, index) => <span className="fa fa-star" aria-hidden="true" key={index} />)}
      </span>
    </label>
  ));

  return (
    <aside className="col-lg-3 sidebar" aria-label="Bộ lọc phòng">
      <button type="button" className={`btn btn-outline-secondary ${styles.filterToggle}`} aria-expanded={isOpen} aria-controls="room-filters" onClick={() => setIsOpen((current) => !current)}>
        {isOpen ? "Ẩn bộ lọc" : "Mở bộ lọc"}{selectedCount > 0 ? ` · ${selectedCount} đang chọn` : ""}
      </button>
      <div id="room-filters" className={`list-sidebar room-filters ${styles.filters} ${isOpen ? styles.filtersExpanded : ""}`} aria-disabled={disabled}>
        <div className={`room-type list-sidebar-item ${styles.filterSection}`}>
          <h4 className={styles.filterHeading}><i className="fa fa-bed" aria-hidden="true" />Loại phòng</h4>
          {renderBedrooms()}
        </div>
        {highestPrice > 0 && <div className={`price list-sidebar-item ${styles.filterSection}`}>
          <h4 className={styles.filterHeading}><i className="fa fa-usd" aria-hidden="true" />Giá</h4>
          <span className={styles.priceHint}>Ngân sách tối đa mỗi đêm</span>
          <div className={styles.priceSlider}>
            <div className={styles.rangeControl}>
              <span className={styles.priceStartThumb} aria-hidden="true" />
              <input id="room-price" type="range" min="0" max={highestPrice} step="1" value={activePrice} disabled={disabled} onChange={handlePriceChange} style={{ "--price-progress": `${priceProgress}%` } as CSSProperties} />
            </div>
            <div className={styles.priceValues}><output htmlFor="room-price">0 $</output><output htmlFor="room-price">{activePrice.toLocaleString("vi-VN")} $</output></div>
          </div>
        </div>}
        <div className={`ratings list-sidebar-item ${styles.filterSection}`}><h4 className={styles.filterHeading}><i className="fa fa-star" aria-hidden="true" />Đánh giá</h4>{renderRatings()}</div>
        <div className={`services list-sidebar-item ${styles.filterSection}`}><h4 className={styles.filterHeading}><i className="fa fa-sliders" aria-hidden="true" />Tiện nghi</h4>{renderAmenities()}</div>
        {selectedCount > 0 && <button type="button" className={styles.resetButton} disabled={disabled} onClick={onReset}><i className="fa fa-refresh" aria-hidden="true" />Xóa bộ lọc</button>}
        <div className={styles.supportBox}>
          <span className={styles.supportIcon}><i className="fa fa-headphones" aria-hidden="true" /></span>
          <h4>Cần hỗ trợ?</h4>
          <p>Liên hệ Hotux để được tư vấn chỗ nghỉ phù hợp.</p>
          <a href={`tel:${siteInfo.phone}`}><i className="fa fa-phone" aria-hidden="true" />{siteInfo.phoneLabel}</a>
        </div>
      </div>
    </aside>
  );
}
