"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { AdminPageHeader, Icon } from "@/components/admin";
import { Alert } from "@/components/ui";
import { routes } from "@/config/routes";
import { fetchBookings } from "@/features/bookings/bookings.slice";
import { fetchLocations } from "@/features/locations/locations.slice";
import { fetchReviews } from "@/features/reviews/reviews.slice";
import { fetchRooms } from "@/features/rooms/rooms.slice";
import { fetchUsers } from "@/features/users/users.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { IconName } from "@/components/admin/AdminIcon";

const formatNumber = (value: number) => value.toLocaleString("vi-VN");
const formatDate = (value: string) => value.slice(0, 10);

type SummaryCardProps = {
  label: string;
  value: number;
  href: string;
  icon: IconName;
  color: string;
  loading: boolean;
};

function SummaryCard({ label, value, href, icon, color, loading }: SummaryCardProps) {
  return (
    <div className="col-md-4 grid-margin stretch-card">
      <div className="card w-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted mb-2">{label}</p>
              <h2 className="mb-0">{loading ? "…" : formatNumber(value)}</h2>
            </div>
            <span className={`d-inline-flex align-items-center justify-content-center rounded-circle wd-50 ht-50 ${color}`}>
              <Icon name={icon} size={24} />
            </span>
          </div>
          <Link className="d-inline-block mt-3" href={href}>Xem danh sách →</Link>
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((root) => ({
    rooms: root.rooms,
    locations: root.locations,
    bookings: root.bookings,
    users: root.users,
    reviews: root.reviews,
  }), shallowEqual);
  const [attempt, setAttempt] = useState(0);
  const resources = [state.rooms, state.locations, state.bookings, state.users, state.reviews];
  const loading = resources.some((resource) => resource.requests.list.status === "idle" || resource.requests.list.status === "loading");
  const errors = resources
    .filter((resource) => resource.requests.list.status === "failed")
    .map((resource) => resource.requests.list.error?.message)
    .filter((message): message is string => Boolean(message));

  useEffect(() => {
    const tasks = [
      dispatch(fetchRooms()),
      dispatch(fetchLocations()),
      dispatch(fetchBookings()),
      dispatch(fetchUsers()),
      dispatch(fetchReviews()),
    ];
    return () => tasks.forEach((task) => task.abort());
  }, [attempt, dispatch]);

  const roomById = useMemo(
    () => new Map(state.rooms.items.map((room) => [room.id, room.tenPhong])),
    [state.rooms.items],
  );
  const userById = useMemo(
    () => new Map(state.users.items.map((user) => [user.id, user.name])),
    [state.users.items],
  );
  const recentBookings = useMemo(
    () => [...state.bookings.items].sort((left, right) => right.id - left.id).slice(0, 6),
    [state.bookings.items],
  );
  const currentDate = new Date().toISOString().slice(0, 10);
  const bookingGroups = useMemo(() => {
    const groups = { upcoming: 0, active: 0, completed: 0 };
    state.bookings.items.forEach((booking) => {
      const checkIn = formatDate(booking.ngayDen);
      const checkOut = formatDate(booking.ngayDi);
      if (checkIn > currentDate) groups.upcoming += 1;
      else if (checkOut >= currentDate) groups.active += 1;
      else groups.completed += 1;
    });
    return groups;
  }, [currentDate, state.bookings.items]);
  const averageRating = state.reviews.items.length
    ? state.reviews.items.reduce((sum, review) => sum + review.saoBinhLuan, 0) / state.reviews.items.length
    : 0;
  const bookingTotal = Math.max(1, state.bookings.items.length);

  return (
    <>
      <AdminPageHeader
        title="Tổng quan lưu trú"
        description="Số liệu tổng hợp trực tiếp từ phòng, vị trí, đặt phòng, người dùng và bình luận."
        breadcrumbs={[{ label: "Tổng quan" }]}
        action={<button type="button" className="btn btn-outline-primary" disabled={loading} onClick={() => setAttempt((value) => value + 1)}>Làm mới</button>}
      />

      {errors.length > 0 && <Alert variant="danger">{errors[0]}</Alert>}

      <div className="row">
        <SummaryCard label="Người dùng" value={state.users.total} href={routes.admin.users} icon="users" color="bg-primary text-white" loading={state.users.requests.list.status !== "succeeded"} />
        <SummaryCard label="Vị trí" value={state.locations.total} href={routes.admin.locations} icon="image" color="bg-success text-white" loading={state.locations.requests.list.status !== "succeeded"} />
        <SummaryCard label="Đặt phòng" value={state.bookings.total} href={routes.admin.bookings} icon="calendar" color="bg-warning text-dark" loading={state.bookings.requests.list.status !== "succeeded"} />
      </div>

      <div className="row">
        <div className="col-lg-8 grid-margin stretch-card">
          <div className="card w-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <div>
                  <h2 className="card-title mb-1">Tình trạng đặt phòng</h2>
                  <p className="text-muted mb-0">Phân nhóm theo ngày nhận và trả phòng hiện tại.</p>
                </div>
                <Link href={routes.admin.bookings}>Quản lý</Link>
              </div>
              {[
                { label: "Sắp tới", value: bookingGroups.upcoming, color: "bg-primary" },
                { label: "Đang lưu trú", value: bookingGroups.active, color: "bg-success" },
                { label: "Đã hoàn tất", value: bookingGroups.completed, color: "bg-secondary" },
              ].map((item) => {
                const percentage = Math.round((item.value / bookingTotal) * 100);
                return (
                  <div className="mb-4" key={item.label}>
                    <div className="d-flex justify-content-between mb-2"><span>{item.label}</span><strong>{formatNumber(item.value)}</strong></div>
                    <div className="progress" role="progressbar" aria-label={item.label} aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
                      <div className={`progress-bar ${item.color}`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-lg-4 grid-margin stretch-card">
          <div className="card w-100">
            <div className="card-body">
              <h2 className="card-title mb-4">Danh mục hệ thống</h2>
              <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                <span><Icon className="me-2 text-primary" name="columns" size={18} />Phòng</span>
                <Link href={routes.admin.rooms}><strong>{formatNumber(state.rooms.total)}</strong></Link>
              </div>
              <div className="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                <span><Icon className="me-2 text-primary" name="star" size={18} />Bình luận</span>
                <Link href={routes.admin.reviews}><strong>{formatNumber(state.reviews.total)}</strong></Link>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span>Điểm đánh giá trung bình</span>
                <strong>{averageRating.toFixed(1)}/5</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 stretch-card">
          <div className="card w-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-baseline mb-3">
                <div>
                  <h2 className="card-title mb-1">Đặt phòng gần đây</h2>
                  <p className="text-muted mb-0">Các bản ghi mới nhất theo mã đặt phòng.</p>
                </div>
                <Link className="btn btn-primary" href={routes.admin.bookingAdd}><Icon className="me-1" name="plus" size={18} />Thêm đặt phòng</Link>
              </div>
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead><tr><th scope="col">Mã</th><th scope="col">Phòng</th><th scope="col">Khách hàng</th><th scope="col">Thời gian</th><th scope="col">Số khách</th></tr></thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        <td>{roomById.get(booking.maPhong) ?? `Phòng #${booking.maPhong}`}</td>
                        <td>{userById.get(booking.maNguoiDung) ?? `Người dùng #${booking.maNguoiDung}`}</td>
                        <td>{formatDate(booking.ngayDen)} → {formatDate(booking.ngayDi)}</td>
                        <td>{booking.soLuongKhach}</td>
                      </tr>
                    ))}
                    {!loading && recentBookings.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">Chưa có đặt phòng.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
