"use client";

import type { ChangeEvent, FormEvent } from "react";
import { checkoutAfter, nights, today, validDate, type Search } from "../flow";

type StayDates = Pick<Search, "checkIn" | "checkOut">;

export function StayDateFields({ idPrefix, value, onChange, showLabels = true, showNights = true, legacyPicker = false, showIcons = false }: {
  idPrefix: string;
  value: StayDates;
  onChange: (value: StayDates) => void;
  showLabels?: boolean;
  showNights?: boolean;
  legacyPicker?: boolean;
  showIcons?: boolean;
}) {
  const count = nights(value);
  const nightCount = Number.isFinite(count) && count > 0 ? count : "";
  const checkInId = legacyPicker ? "date-range2" : `${idPrefix}-check-in`;
  const checkOutId = legacyPicker ? "date-range3" : `${idPrefix}-check-out`;
  const inputType = legacyPicker ? "text" : "date";
  const handleCheckIn = (checkIn: string) => {
    onChange({ checkIn, checkOut: validDate(checkIn) ? checkoutAfter(checkIn, Number(nightCount) || 1) : "" });
  };
  const checkInControl = legacyPicker
    ? { defaultValue: value.checkIn }
    : {
        value: value.checkIn,
        onInput: (event: FormEvent<HTMLInputElement>) =>
          handleCheckIn(event.currentTarget.value),
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          handleCheckIn(event.currentTarget.value),
      };
  const checkOutControl = legacyPicker
    ? { defaultValue: value.checkOut }
    : {
        value: value.checkOut,
        onInput: (event: FormEvent<HTMLInputElement>) =>
          onChange({ ...value, checkOut: event.currentTarget.value }),
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          onChange({ ...value, checkOut: event.currentTarget.value }),
      };

  return <>
    <div className="table-item">
      <div className={`form-group${showIcons ? " stay-date-field" : ""}`}>
        {showLabels && <label htmlFor={checkInId}>Nhận phòng</label>}
        {showIcons && <i className="fa fa-calendar home-search-icon" aria-hidden="true" />}
        <input id={checkInId} name="checkIn" className="form-control" type={inputType}
          {...(!legacyPicker ? { min: today() } : { readOnly: true, autoComplete: "off" })} {...checkInControl} placeholder="Ngày nhận phòng" aria-label="Ngày nhận phòng" required />
      </div>
    </div>
    <div className="table-item">
      <div className={`form-group${showIcons ? " stay-date-field" : ""}`}>
        {showLabels && <label htmlFor={checkOutId}>Trả phòng</label>}
        {showIcons && <i className="fa fa-calendar-o home-search-icon" aria-hidden="true" />}
        <input id={checkOutId} name="checkOut" className="form-control" type={inputType}
          {...(!legacyPicker ? { min: checkoutAfter(value.checkIn || today(), 1) } : { readOnly: true, autoComplete: "off" })} {...checkOutControl} placeholder="Ngày trả phòng" aria-label="Ngày trả phòng" required />
      </div>
    </div>
    {showNights && <div className="table-item stay-nights">
      <div className="form-group">
        <label htmlFor={`${idPrefix}-nights`}>Số đêm</label>
        <input id={`${idPrefix}-nights`} className="form-control" type="number" min="1" step="1"
          value={nightCount} placeholder="Số đêm" required
          onChange={(event) => {
            const checkIn = value.checkIn || today();
            onChange({ checkIn, checkOut: checkoutAfter(checkIn, Number(event.target.value)) });
          }} />
      </div>
    </div>}
  </>;
}
