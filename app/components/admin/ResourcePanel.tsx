"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { shallowEqual } from "react-redux";
import { Alert, EmptyState, LoadingSpinner } from "@/components/ui";
import { ApiImage } from "@/components/ui/ApiImage";
import { routes } from "@/config/routes";
import { deleteBooking, fetchBookings } from "@/features/bookings/bookings.slice";
import { deleteLocation, fetchLocations } from "@/features/locations/locations.slice";
import { deleteReview, fetchReviews } from "@/features/reviews/reviews.slice";
import { deleteRoom, fetchRooms } from "@/features/rooms/rooms.slice";
import { deleteUser, fetchUsers } from "@/features/users/users.slice";
import { toApiError } from "@/lib/api/errors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AdminDataTable, type AdminTableColumn } from "./AdminDataTable";
import { AdminListToolbar, type AdminFilterOption } from "./AdminListToolbar";
import { AdminModal } from "./AdminModal";
import { AdminPageHeader } from "./AdminPageHeader";
import { AdminPagination } from "./AdminPagination";
import { AdminRowActions } from "./AdminRowActions";
import { Icon } from "./AdminIcon";

export type AdminResource = "rooms" | "bookings" | "users" | "locations" | "reviews";

type DetailItem = {
  label: string;
  value: ReactNode;
};

type AdminRow = {
  id: number;
  label: string;
  searchText: string;
  filterValue: string;
  filterLabel: string;
  cells: Record<string, ReactNode>;
  details: DetailItem[];
  editHref?: string;
};

type ResourceView = {
  title: string;
  description: string;
  toolbarTitle: string;
  searchPlaceholder: string;
  filterLabel: string;
  columns: ReadonlyArray<Omit<AdminTableColumn<AdminRow>, "render">>;
  addHref?: string;
  addLabel?: string;
};

const resourceViews: Record<AdminResource, ResourceView> = {
  rooms: {
    title: "Quản lý phòng",
    description: "Theo dõi thông tin, sức chứa và giá của các phòng đang có trên hệ thống.",
    toolbarTitle: "Danh sách phòng",
    searchPlaceholder: "Tìm theo mã hoặc tên phòng",
    filterLabel: "Vị trí",
    columns: [
      { key: "id", label: "Mã" },
      { key: "room", label: "Phòng" },
      { key: "location", label: "Vị trí" },
      { key: "capacity", label: "Sức chứa" },
      { key: "price", label: "Giá / đêm" },
    ],
  },
  bookings: {
    title: "Quản lý đặt phòng",
    description: "Tra cứu lịch lưu trú theo phòng, khách hàng và thời gian nhận trả phòng.",
    toolbarTitle: "Danh sách đặt phòng",
    searchPlaceholder: "Tìm mã đặt phòng, phòng hoặc khách",
    filterLabel: "Phòng",
    addHref: routes.admin.bookingAdd,
    addLabel: "Thêm đặt phòng",
    columns: [
      { key: "id", label: "Mã" },
      { key: "booking", label: "Phòng / khách" },
      { key: "period", label: "Thời gian" },
      { key: "guests", label: "Số khách" },
    ],
  },
  users: {
    title: "Quản lý người dùng",
    description: "Quản lý hồ sơ, thông tin liên hệ và quyền truy cập của người dùng.",
    toolbarTitle: "Danh sách người dùng",
    searchPlaceholder: "Tìm theo mã, họ tên hoặc email",
    filterLabel: "Vai trò",
    addHref: routes.admin.userAdd,
    addLabel: "Thêm người dùng",
    columns: [
      { key: "id", label: "Mã" },
      { key: "user", label: "Người dùng" },
      { key: "contact", label: "Liên hệ" },
      { key: "birthday", label: "Ngày sinh" },
      { key: "role", label: "Vai trò" },
    ],
  },
  locations: {
    title: "Quản lý vị trí",
    description: "Danh mục điểm đến dùng để phân nhóm và tìm kiếm phòng lưu trú.",
    toolbarTitle: "Danh sách vị trí",
    searchPlaceholder: "Tìm theo mã, vị trí hoặc tỉnh thành",
    filterLabel: "Quốc gia",
    columns: [
      { key: "id", label: "Mã" },
      { key: "location", label: "Vị trí" },
      { key: "city", label: "Tỉnh thành" },
      { key: "country", label: "Quốc gia" },
    ],
  },
  reviews: {
    title: "Quản lý bình luận",
    description: "Theo dõi nội dung đánh giá thực tế được gửi cho từng phòng.",
    toolbarTitle: "Danh sách bình luận",
    searchPlaceholder: "Tìm mã, nội dung, phòng hoặc người gửi",
    filterLabel: "Số sao",
    columns: [
      { key: "id", label: "Mã" },
      { key: "reviewer", label: "Người gửi" },
      { key: "room", label: "Phòng" },
      { key: "content", label: "Nội dung" },
      { key: "rating", label: "Đánh giá" },
      { key: "date", label: "Ngày gửi" },
    ],
  },
};

const formatDate = (value: string) => value.slice(0, 10);

const imageFallback = (
  <span className="d-inline-flex align-items-center justify-content-center rounded bg-light wd-40 ht-40" aria-hidden="true">
    <Icon name="image" size={18} />
  </span>
);

export function ResourcePanel({ resource }: { resource: AdminResource }) {
  const dispatch = useAppDispatch();
  const resources = useAppSelector((root) => ({
    rooms: root.rooms,
    bookings: root.bookings,
    users: root.users,
    locations: root.locations,
    reviews: root.reviews,
  }), shallowEqual);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRow, setSelectedRow] = useState<AdminRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<AdminRow | null>(null);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const tasks: Array<{ abort: () => void }> = [];
    switch (resource) {
      case "rooms":
        tasks.push(dispatch(fetchRooms()), dispatch(fetchLocations()));
        break;
      case "bookings":
        tasks.push(dispatch(fetchBookings()), dispatch(fetchRooms()), dispatch(fetchUsers()));
        break;
      case "users":
        tasks.push(dispatch(fetchUsers()));
        break;
      case "locations":
        tasks.push(dispatch(fetchLocations()));
        break;
      case "reviews":
        tasks.push(dispatch(fetchReviews()), dispatch(fetchRooms()), dispatch(fetchUsers()));
        break;
    }
    return () => tasks.forEach((task) => task.abort());
  }, [attempt, dispatch, resource]);

  const view = resourceViews[resource];
  const listState = resources[resource];
  const request = listState.requests.list;
  const deleting = listState.requests.remove.status === "loading";
  const roomById = useMemo(
    () => new Map(resources.rooms.items.map((room) => [room.id, room])),
    [resources.rooms.items],
  );
  const userById = useMemo(
    () => new Map(resources.users.items.map((user) => [user.id, user])),
    [resources.users.items],
  );
  const locationById = useMemo(
    () => new Map(resources.locations.items.map((location) => [location.id, location])),
    [resources.locations.items],
  );

  const rows = useMemo<AdminRow[]>(() => {
    switch (resource) {
      case "rooms":
        return resources.rooms.items.map((room) => {
          const location = locationById.get(room.maViTri);
          const locationLabel = location
            ? `${location.tenViTri}, ${location.tinhThanh}`
            : `Vị trí #${room.maViTri}`;
          return {
            id: room.id,
            label: `phòng ${room.tenPhong}`,
            searchText: `${room.id} ${room.tenPhong} ${locationLabel}`,
            filterValue: String(room.maViTri),
            filterLabel: location?.tenViTri ?? `Vị trí #${room.maViTri}`,
            cells: {
              id: room.id,
              room: <span className="d-flex align-items-center gap-2"><ApiImage src={room.hinhAnh} alt="" width={40} height={40} className="rounded object-fit-cover wd-40 ht-40" fallback={imageFallback} /><strong>{room.tenPhong}</strong></span>,
              location: locationLabel,
              capacity: `${room.khach} khách · ${room.phongNgu} phòng ngủ`,
              price: `${room.giaTien.toLocaleString("vi-VN")} USD`,
            },
            details: [
              { label: "Tên phòng", value: room.tenPhong },
              { label: "Vị trí", value: locationLabel },
              { label: "Sức chứa", value: `${room.khach} khách` },
              { label: "Phòng ngủ / giường / phòng tắm", value: `${room.phongNgu} / ${room.giuong} / ${room.phongTam}` },
              { label: "Giá mỗi đêm", value: `${room.giaTien.toLocaleString("vi-VN")} USD` },
              { label: "Mô tả", value: room.moTa || "Chưa có mô tả" },
            ],
          };
        });
      case "bookings":
        return resources.bookings.items.map((booking) => {
          const room = roomById.get(booking.maPhong);
          const user = userById.get(booking.maNguoiDung);
          const bookingLabel = `${room?.tenPhong ?? `Phòng #${booking.maPhong}`} · ${user?.name ?? `Khách #${booking.maNguoiDung}`}`;
          const period = `${formatDate(booking.ngayDen)} → ${formatDate(booking.ngayDi)}`;
          return {
            id: booking.id,
            label: `đặt phòng #${booking.id}`,
            searchText: `${booking.id} ${bookingLabel} ${period}`,
            filterValue: String(booking.maPhong),
            filterLabel: room?.tenPhong ?? `Phòng #${booking.maPhong}`,
            cells: {
              id: booking.id,
              booking: bookingLabel,
              period,
              guests: booking.soLuongKhach,
            },
            details: [
              { label: "Mã đặt phòng", value: `#${booking.id}` },
              { label: "Phòng", value: room?.tenPhong ?? `#${booking.maPhong}` },
              { label: "Khách hàng", value: user ? `${user.name} (${user.email})` : `#${booking.maNguoiDung}` },
              { label: "Nhận phòng", value: formatDate(booking.ngayDen) },
              { label: "Trả phòng", value: formatDate(booking.ngayDi) },
              { label: "Số khách", value: booking.soLuongKhach },
            ],
          };
        });
      case "users":
        return resources.users.items.map((user) => ({
          id: user.id,
          label: `người dùng ${user.name}`,
          searchText: `${user.id} ${user.name} ${user.email} ${user.phone ?? ""} ${user.role}`,
          filterValue: user.role,
          filterLabel: user.role,
          editHref: routes.admin.userDetail(user.id),
          cells: {
            id: user.id,
            user: <span className="d-flex align-items-center gap-2"><ApiImage src={user.avatar} alt="" width={40} height={40} className="rounded-circle object-fit-cover wd-40 ht-40" fallback={<span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light wd-40 ht-40"><Icon name="user" size={18} /></span>} /><strong>{user.name}</strong></span>,
            contact: <span><span className="d-block">{user.email}</span><small className="text-muted">{user.phone || "Chưa có số điện thoại"}</small></span>,
            birthday: formatDate(user.birthday),
            role: <span className={`badge ${user.role === "ADMIN" ? "bg-primary" : "bg-secondary"}`}>{user.role}</span>,
          },
          details: [
            { label: "Họ tên", value: user.name },
            { label: "Email", value: user.email },
            { label: "Số điện thoại", value: user.phone || "Chưa cập nhật" },
            { label: "Ngày sinh", value: formatDate(user.birthday) },
            { label: "Giới tính", value: user.gender ? "Nam" : "Nữ" },
            { label: "Vai trò", value: user.role },
          ],
        }));
      case "locations":
        return resources.locations.items.map((location) => ({
          id: location.id,
          label: `vị trí ${location.tenViTri}`,
          searchText: `${location.id} ${location.tenViTri} ${location.tinhThanh} ${location.quocGia}`,
          filterValue: location.quocGia,
          filterLabel: location.quocGia,
          cells: {
            id: location.id,
            location: <span className="d-flex align-items-center gap-2"><ApiImage src={location.hinhAnh} alt="" width={40} height={40} className="rounded object-fit-cover wd-40 ht-40" fallback={imageFallback} /><strong>{location.tenViTri}</strong></span>,
            city: location.tinhThanh,
            country: location.quocGia,
          },
          details: [
            { label: "Tên vị trí", value: location.tenViTri },
            { label: "Tỉnh thành", value: location.tinhThanh },
            { label: "Quốc gia", value: location.quocGia },
          ],
        }));
      case "reviews":
        return resources.reviews.items.map((review) => {
          const room = roomById.get(review.maPhong);
          const user = userById.get(review.maNguoiBinhLuan);
          const roomLabel = room?.tenPhong ?? `Phòng #${review.maPhong}`;
          const userLabel = user?.name ?? `Người dùng #${review.maNguoiBinhLuan}`;
          return {
            id: review.id,
            label: `bình luận #${review.id}`,
            searchText: `${review.id} ${review.noiDung} ${roomLabel} ${userLabel}`,
            filterValue: String(review.saoBinhLuan),
            filterLabel: `${review.saoBinhLuan} sao`,
            cells: {
              id: review.id,
              reviewer: userLabel,
              room: roomLabel,
              content: <span className="d-inline-block text-truncate" style={{ maxWidth: 260 }}>{review.noiDung}</span>,
              rating: `${review.saoBinhLuan}/5`,
              date: formatDate(review.ngayBinhLuan),
            },
            details: [
              { label: "Người gửi", value: userLabel },
              { label: "Phòng", value: roomLabel },
              { label: "Ngày gửi", value: formatDate(review.ngayBinhLuan) },
              { label: "Đánh giá", value: `${review.saoBinhLuan}/5` },
              { label: "Nội dung", value: review.noiDung },
            ],
          };
        });
    }
  }, [locationById, resource, resources.bookings.items, resources.locations.items, resources.reviews.items, resources.rooms.items, resources.users.items, roomById, userById]);

  const filterOptions = useMemo<AdminFilterOption[]>(() => {
    const values = new Map(rows.map((row) => [row.filterValue, row.filterLabel]));
    return Array.from(values, ([value, label]) => ({ value, label }))
      .sort((left, right) => left.label.localeCompare(right.label, "vi"));
  }, [rows]);

  const filteredRows = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("vi-VN");
    return rows.filter((row) => {
      const matchesQuery = !keyword || row.searchText.toLocaleLowerCase("vi-VN").includes(keyword);
      return matchesQuery && (!filter || row.filterValue === filter);
    });
  }, [filter, query, rows]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const columns = useMemo<AdminTableColumn<AdminRow>[]>(() => [
    ...view.columns.map((column) => ({ ...column, render: (row: AdminRow) => row.cells[column.key] })),
    {
      key: "actions",
      label: "Thao tác",
      className: "text-center",
      render: (row) => (
        <AdminRowActions
          label={row.label}
          editHref={row.editHref}
          deleting={deleting && deleteRow?.id === row.id}
          onView={() => setSelectedRow(row)}
          onDelete={() => { setDeleteError(""); setDeleteRow(row); }}
        />
      ),
    },
  ], [deleteRow?.id, deleting, view.columns]);

  const handleDelete = async () => {
    if (!deleteRow) return;
    setDeleteError("");
    try {
      switch (resource) {
        case "rooms": await dispatch(deleteRoom(deleteRow.id)).unwrap(); break;
        case "bookings": await dispatch(deleteBooking(deleteRow.id)).unwrap(); break;
        case "users": await dispatch(deleteUser(deleteRow.id)).unwrap(); break;
        case "locations": await dispatch(deleteLocation(deleteRow.id)).unwrap(); break;
        case "reviews": await dispatch(deleteReview(deleteRow.id)).unwrap(); break;
      }
      setDeleteRow(null);
    } catch (error) {
      setDeleteError(toApiError(error).message);
    }
  };

  const handleResetList = (nextValue?: { query?: string; filter?: string; pageSize?: number }) => {
    if (nextValue?.query !== undefined) setQuery(nextValue.query);
    if (nextValue?.filter !== undefined) setFilter(nextValue.filter);
    if (nextValue?.pageSize !== undefined) setPageSize(nextValue.pageSize);
    setPage(1);
  };

  const isLoading = request.status === "idle" || request.status === "loading";
  const hasSearch = Boolean(query.trim() || filter);

  return (
    <>
      <AdminPageHeader
        title={view.title}
        description={view.description}
        breadcrumbs={[{ label: "Tổng quan", href: routes.admin.dashboard }, { label: view.title }]}
        action={view.addHref && view.addLabel ? (
          <Link className="btn btn-primary" href={view.addHref}>
            <Icon className="me-1" name="plus" size={18} /> {view.addLabel}
          </Link>
        ) : undefined}
      />

      <AdminListToolbar
        title={view.toolbarTitle}
        query={query}
        searchPlaceholder={view.searchPlaceholder}
        pageSize={pageSize}
        filterLabel={view.filterLabel}
        filterValue={filter}
        filterOptions={filterOptions}
        loading={isLoading}
        onQueryChange={(value) => handleResetList({ query: value })}
        onPageSizeChange={(value) => handleResetList({ pageSize: value })}
        onFilterChange={(value) => handleResetList({ filter: value })}
        onRefresh={() => setAttempt((value) => value + 1)}
      />

      {isLoading ? (
        <div className="card"><div className="card-body"><LoadingSpinner label="Đang tải danh sách" /></div></div>
      ) : request.status === "failed" ? (
        <Alert variant="danger">{request.error?.message ?? "Không tải được danh sách. Vui lòng thử lại."}</Alert>
      ) : filteredRows.length === 0 ? (
        <div className="card"><div className="card-body"><EmptyState description={hasSearch ? "Không có kết quả phù hợp. Thử điều kiện khác." : "Danh sách hiện chưa có dữ liệu."} /></div></div>
      ) : (
        <>
          <AdminDataTable
            caption={`${filteredRows.length} bản ghi${hasSearch ? " phù hợp" : ""}`}
            columns={columns}
            rows={visibleRows}
            getRowKey={(row) => row.id}
          />
          {filteredRows.length > pageSize && (
            <AdminPagination page={currentPage} pageSize={pageSize} total={filteredRows.length} onChange={setPage} />
          )}
        </>
      )}

      <AdminModal
        open={selectedRow !== null}
        title={selectedRow ? `Chi tiết ${selectedRow.label}` : "Chi tiết"}
        onClose={() => setSelectedRow(null)}
        footer={<button type="button" className="btn btn-secondary" onClick={() => setSelectedRow(null)}>Đóng</button>}
      >
        <dl className="row mb-0">
          {selectedRow?.details.map((item) => (
            <div className="row mb-2" key={item.label}>
              <dt className="col-sm-4">{item.label}</dt>
              <dd className="col-sm-8 mb-0">{item.value}</dd>
            </div>
          ))}
        </dl>
      </AdminModal>

      <AdminModal
        open={deleteRow !== null}
        title="Xác nhận xóa"
        onClose={() => { if (!deleting) setDeleteRow(null); }}
        footer={(
          <>
            <button type="button" className="btn btn-secondary" disabled={deleting} onClick={() => setDeleteRow(null)}>Hủy</button>
            <button type="button" className="btn btn-danger" disabled={deleting} onClick={handleDelete}>{deleting ? "Đang xóa…" : "Xóa"}</button>
          </>
        )}
      >
        <p>Bạn có chắc muốn xóa {deleteRow?.label}? Thao tác này không thể hoàn tác.</p>
        {deleteError && <Alert variant="danger">{deleteError}</Alert>}
      </AdminModal>
    </>
  );
}
