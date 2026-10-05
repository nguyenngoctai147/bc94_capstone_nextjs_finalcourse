export type IconName =
  | "alert-circle" | "arrow-up" | "bell" | "box" | "chevron-down" | "plus"
  | "columns" | "edit" | "eye" | "file" | "gift" | "heart" | "image" | "list"
  | "log-out" | "menu" | "more-horizontal" | "search" | "settings"
  | "sliders" | "table" | "trash" | "type" | "user" | "users";

const iconPaths: Record<IconName, string> = {
  "alert-circle": "M12 8v4M12 16h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  "arrow-up": "m5 12 7-7 7 7M12 19V5",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  box: "M21 16V8l-9-5-9 5v8l9 5 9-5ZM3.3 7.5 12 12l8.7-4.5M12 12v9",
  "chevron-down": "m6 9 6 6 6-6",
  plus: "M12 5v14M5 12h14",
  columns: "M4 4h16v16H4zM9 4v16M15 4v16",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z",
  eye: "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  file: "M6 3h8l4 4v14H6zM14 3v5h5M9 13h6M9 17h6",
  gift: "M20 12v9H4v-9M2 7h20v5H2zM12 7v14M12 7H8.5a2.5 2.5 0 1 1 2.5-2.5V7ZM12 7h3.5a2.5 2.5 0 1 0-2.5-2.5V7Z",
  heart: "M20.8 8.7c0 5-8.8 10.3-8.8 10.3S3.2 13.7 3.2 8.7A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 8.8 2.7Z",
  image: "M4 4h16v16H4zM8.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM20 15l-4-4-6 6-2-2-4 4",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  "log-out": "M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-5",
  menu: "M4 6h16M4 12h16M4 18h16",
  "more-horizontal": "M5 12h.01M12 12h.01M19 12h.01",
  search: "m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z",
  settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.7-1.7.1-.1A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.6-1H6.7v-2.4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L8 8.6l1.7-1.7.1.1a1.7 1.7 0 0 1 1-1.6v-.1h2.4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1V14h-.1a1.7 1.7 0 0 0-1.6 1Z",
  sliders: "M4 6h16M4 12h16M4 18h16M8 4v4M16 10v4M10 16v4",
  table: "M4 4h16v16H4zM4 10h16M10 4v16",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3",
  type: "M4 5h16M12 5v14M8 19h8",
  user: "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  users: "M16 21v-2a4 4 0 0 0-8 0v2M12 13a4 4 0 1 0-8 0 4 4 0 0 0 0 8ZM20 21v-2a4 4 0 0 0-3-3.9M17 5.1a4 4 0 0 1 0 7.8",
};

export function Icon({ name, className = "", size }: { name: IconName; className?: string; size?: number }) {
  return <svg aria-hidden="true" className={className} data-feather={name} fill="none" height={size} viewBox="0 0 24 24" width={size} xmlns="http://www.w3.org/2000/svg"><path d={iconPaths[name]} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}
