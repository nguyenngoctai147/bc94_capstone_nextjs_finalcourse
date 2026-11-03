import type { AmenityKey } from "../room-amenities";

const fontAwesomeIcons: Partial<Record<AmenityKey, string>> = {
  wifi: "fa-wifi",
  dieuHoa: "fa-asterisk",
  bep: "fa-cutlery",
  mayGiat: "fa-tint",
  tivi: "fa-television",
  doXe: "fa-car",
  hoBoi: "fa-life-ring",
};

export function RoomAmenityIcon({ amenity, className = "" }: { amenity: AmenityKey; className?: string }) {
  const iconClassName = `room-amenity-icon ${className}`.trim();
  const fontAwesomeIcon = fontAwesomeIcons[amenity];

  if (fontAwesomeIcon) return <i className={`fa ${fontAwesomeIcon} ${iconClassName}`} aria-hidden="true" />;

  if (amenity === "banLa") {
    return <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10h18l-2 4H5z" /><path d="m8 14-3 7m11-7 3 7M7 18h10" /></svg>;
  }

  return <svg className={iconClassName} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15h16l-2-5H9l-5 5Z" /><path d="M4 15v3h16v-3M10 10V7h4" /><circle cx="7" cy="18" r="1" /><circle cx="17" cy="18" r="1" /></svg>;
}
