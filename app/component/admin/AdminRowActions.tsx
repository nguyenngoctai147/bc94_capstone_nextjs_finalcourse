"use client";

import Link from "next/link";
import { Icon } from "./AdminIcon";

export function AdminRowActions({
  label,
  editHref,
  deleting = false,
  onView,
  onDelete,
}: {
  label: string;
  editHref?: string;
  deleting?: boolean;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <ul className="d-flex list-unstyled mb-0 justify-content-center gap-2">
      <li>
        <button
          className="btn btn-link p-1"
          type="button"
          aria-label={`Xem ${label}`}
          onClick={onView}
        >
          <Icon className="link-icon" name="eye" size={18} />
        </button>
      </li>
      {editHref && (
        <li>
          <Link className="btn btn-link p-1" href={editHref} aria-label={`Sửa ${label}`}>
            <Icon className="link-icon" name="edit" size={18} />
          </Link>
        </li>
      )}
      <li>
        <button
          className="btn btn-link text-danger p-1"
          type="button"
          disabled={deleting}
          aria-label={`Xóa ${label}`}
          onClick={onDelete}
        >
          <Icon className="link-icon" name="trash" size={18} />
        </button>
      </li>
    </ul>
  );
}
