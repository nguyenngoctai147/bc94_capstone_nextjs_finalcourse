export function LoadingSpinner({
  label = "Đang tải...",
  small = false,
}: {
  label?: string;
  small?: boolean;
}) {
  return (
    <span role="status" className="d-inline-flex align-items-center gap-2">
      <span
        className={`spinner-border ${small ? "spinner-border-sm" : ""}`}
        aria-hidden="true"
      />
      <span className="visually-hidden">{label}</span>
    </span>
  );
}
