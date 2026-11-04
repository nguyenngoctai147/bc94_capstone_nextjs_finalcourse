"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { AdminPageHeader, Icon } from "@/component/admin";
import { Alert } from "@/component/ui";
import styles from "@/theme/features/dashboard/dashboard.module.css";
import { routes } from "@/route";
import { fetchBookings } from "@/store/thunk/bookings";
import type { Booking } from "@/store/type/bookings";
import { fetchLocations } from "@/store/thunk/location";
import { fetchReviews } from "@/store/thunk/reviews";
import { fetchRooms } from "@/store/thunk/room";
import type { Room } from "@/store/type/room";
import { fetchUsers } from "@/store/thunk/user";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { BarChart, DonutChart, LineChart, Sparkline } from "./DashboardCharts";

const formatNumber = (value: number) => value.toLocaleString("vi-VN");
const formatDate = (value: string) => value.slice(0, 10);
const monthLabels = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

type Period = "today" | "week" | "month" | "year";

const toValidDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getAnchorDate = (bookings: Booking[]) => {
  const dates = bookings.map((booking) => toValidDate(booking.ngayDen)).filter((date): date is Date => Boolean(date));
  return dates.length ? new Date(Math.max(...dates.map((date) => date.getTime()))) : new Date();
};

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const dayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const getTravelSeries = (bookings: Booking[], period: Period) => {
  const anchor = startOfDay(getAnchorDate(bookings));

  if (period === "year") {
    const year = anchor.getFullYear();
    const values = Array.from({ length: 12 }, () => 0);
    bookings.forEach((booking) => {
      const date = toValidDate(booking.ngayDen);
      if (date?.getFullYear() === year) values[date.getMonth()] += 1;
    });
    return { labels: monthLabels, values };
  }

  const days = period === "month" ? 30 : period === "week" ? 7 : 1;
  const start = addDays(anchor, -(days - 1));
  const dailyValues = Array.from({ length: days }, () => 0);
  const indexByDay = new Map(Array.from({ length: days }, (_, index) => [dayKey(addDays(start, index)), index]));
  bookings.forEach((booking) => {
    const date = toValidDate(booking.ngayDen);
    if (!date) return;
    const index = indexByDay.get(dayKey(date));
    if (index !== undefined) dailyValues[index] += 1;
  });

  if (period === "month") {
    const values = Array.from({ length: 6 }, (_, index) => dailyValues.slice(index * 5, index * 5 + 5).reduce((sum, value) => sum + value, 0));
    return { labels: values.map((_, index) => `Tuần ${index + 1}`), values };
  }
  if (period === "today") return { labels: ["Hôm nay"], values: dailyValues };

  return {
    labels: Array.from({ length: 7 }, (_, index) => addDays(start, index).toLocaleDateString("vi-VN", { weekday: "short" })),
    values: dailyValues,
  };
};

const getMonthlyRevenue = (bookings: Booking[], rooms: Room[]) => {
  const year = getAnchorDate(bookings).getFullYear();
  const roomPrice = new Map(rooms.map((room) => [room.id, room.giaTien]));
  const values = Array.from({ length: 12 }, () => 0);
  bookings.forEach((booking) => {
    const checkIn = toValidDate(booking.ngayDen);
    const checkOut = toValidDate(booking.ngayDi);
    if (!checkIn || !checkOut || checkIn.getFullYear() !== year) return;
    const nights = Math.max(1, Math.ceil((startOfDay(checkOut).getTime() - startOfDay(checkIn).getTime()) / 86_400_000));
    values[checkIn.getMonth()] += (roomPrice.get(booking.maPhong) ?? 0) * nights;
  });
  return { year, values: values.map((value) => Number((value / 1_000_000).toFixed(1))) };
};

const buildSparkSeries = (total: number, factors: number[]) => factors.map((factor) => Math.max(0, Math.round(total * factor)));

type SummaryCardProps = { label: string; value: number; href: string; values: number[]; loading: boolean; bars?: boolean; negative?: boolean };

function SummaryCard({ label, value, href, values, loading, bars, negative }: SummaryCardProps) {
  return (
    <div className="col-lg-4 grid-margin stretch-card">
      <div className={`${styles.summaryCard} card w-100`}>
        <Link className={`${styles.summaryBody} ${styles.summaryLink}`} href={href}>
          <div className={styles.summaryContent}>
            <p className={styles.summaryLabel}>{label}</p>
            <h2 className={styles.summaryValue}>{loading ? "…" : formatNumber(value)}</h2>
            <span className={`${styles.summaryTrend} ${negative ? styles.summaryTrendNegative : ""}`}>{negative ? "−" : "+"}{Math.max(1, Math.round(value / Math.max(values.length, 1)))}% {negative ? "↓" : "↑"}</span>
          </div>
          <Sparkline values={values} bars={bars} />
        </Link>
      </div>
    </div>
  );
}

function ChartHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className={styles.chartHeader}>
      <div><h2 className={styles.cardTitle}>{title}</h2>{description && <p className={styles.description}>{description}</p>}</div>
      <span className={styles.moreButton} aria-hidden="true"><Icon name="more-horizontal" size={20} /></span>
    </div>
  );
}

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((root) => ({ rooms: root.rooms, locations: root.locations, bookings: root.bookings, users: root.users, reviews: root.reviews }), shallowEqual);
  const [period, setPeriod] = useState<Period>("month");
  const resources = [state.rooms, state.locations, state.bookings, state.users, state.reviews];
  const loading = resources.some((resource) => resource.requests.list.status === "idle" || resource.requests.list.status === "loading");
  const errors = resources.filter((resource) => resource.requests.list.status === "failed").map((resource) => resource.requests.list.error?.message).filter((message): message is string => Boolean(message));

  useEffect(() => {
    const tasks = [dispatch(fetchRooms()), dispatch(fetchLocations()), dispatch(fetchBookings()), dispatch(fetchUsers()), dispatch(fetchReviews())];
    return () => tasks.forEach((task) => task.abort());
  }, [dispatch]);

  const roomById = useMemo(() => new Map(state.rooms.items.map((room) => [room.id, room.tenPhong])), [state.rooms.items]);
  const userById = useMemo(() => new Map(state.users.items.map((user) => [user.id, user.name])), [state.users.items]);
  const recentBookings = useMemo(() => [...state.bookings.items].sort((left, right) => right.id - left.id).slice(0, 6), [state.bookings.items]);
  const travelSeries = useMemo(() => getTravelSeries(state.bookings.items, period), [period, state.bookings.items]);
  const monthlyRevenue = useMemo(() => getMonthlyRevenue(state.bookings.items, state.rooms.items), [state.bookings.items, state.rooms.items]);
  const locationBars = useMemo(() => {
    const roomCounts = new Map<number, number>();
    state.rooms.items.forEach((room) => roomCounts.set(room.maViTri, (roomCounts.get(room.maViTri) ?? 0) + 1));
    return state.locations.items.slice(0, 10).map((location) => roomCounts.get(location.id) ?? 0);
  }, [state.locations.items, state.rooms.items]);
  const guestSeries = useMemo(() => [...state.bookings.items].sort((left, right) => left.id - right.id).slice(-10).map((booking) => booking.soLuongKhach), [state.bookings.items]);
  const totalGuests = state.bookings.items.reduce((sum, booking) => sum + booking.soLuongKhach, 0);
  const currentDate = new Date().toISOString().slice(0, 10);
  const activeBookings = state.bookings.items.filter((booking) => formatDate(booking.ngayDen) <= currentDate && formatDate(booking.ngayDi) >= currentDate).length;
  const occupancy = state.rooms.total ? Math.min(100, Math.round(activeBookings / state.rooms.total * 100)) : 0;
  const periodOptions: Array<{ value: Period; label: string }> = [
    { value: "today", label: "Hôm nay" }, { value: "week", label: "Tuần" }, { value: "month", label: "Tháng" }, { value: "year", label: "Năm" },
  ];

  return (
    <div className={styles.dashboard}>
      <AdminPageHeader title="Tổng quan" description="Theo dõi hoạt động lưu trú và hiệu quả vận hành của Hotux." />
      {errors.length > 0 && <Alert variant="danger">{errors[0]}</Alert>}

      <div className="row">
        <SummaryCard label="Khách hàng mới" value={state.users.total} href={routes.admin.users} values={buildSparkSeries(state.users.total, [.48, .58, .51, .76, .42, .63, .45, .68, .52, .7])} loading={state.users.requests.list.status !== "succeeded"} />
        <SummaryCard label="Điểm đến mới" value={state.locations.total} href={routes.admin.locations} values={locationBars.length ? locationBars : [1, 2, 1, 3, 2, 1, 2, 1, 3]} loading={state.locations.requests.list.status !== "succeeded"} bars negative />
        <SummaryCard label="Số khách" value={totalGuests} href={routes.admin.bookings} values={guestSeries.length ? guestSeries : [1, 1, 2, 1, 3, 2, 3, 4]} loading={state.bookings.requests.list.status !== "succeeded"} />
      </div>

      <div className="row"><div className="col-12 grid-margin stretch-card"><div className={`${styles.chartCard} card w-100`}><div className={styles.chartBody}>
        <ChartHeading title="Dữ liệu đặt phòng" description="Biến động số lượt đặt phòng theo từng khoảng thời gian, được tổng hợp trực tiếp từ dữ liệu hệ thống." />
        <div className={styles.periods} role="group" aria-label="Khoảng thời gian biểu đồ">
          {periodOptions.map((option) => <button key={option.value} type="button" className={`${styles.periodButton} ${period === option.value ? styles.periodButtonActive : ""}`} aria-pressed={period === option.value} onClick={() => setPeriod(option.value)}>{option.label}</button>)}
        </div>
        <LineChart values={travelSeries.values} labels={travelSeries.labels} />
      </div></div></div></div>

      <div className="row">
        <div className="col-lg-8 grid-margin stretch-card"><div className={`${styles.chartCard} card w-100`}><div className={styles.chartBody}>
          <ChartHeading title={`Doanh thu theo tháng · ${monthlyRevenue.year}`} description="Doanh thu ước tính theo giá phòng và số đêm của từng lượt đặt, đơn vị triệu VNĐ." />
          <BarChart values={monthlyRevenue.values} labels={monthLabels} />
        </div></div></div>
        <div className="col-lg-4 grid-margin stretch-card"><div className={`${styles.chartCard} card w-100`}><div className={`${styles.chartBody} d-flex flex-column w-100`}>
          <ChartHeading title="Công suất phòng" />
          <DonutChart percentage={occupancy} label="Đang sử dụng" />
          <div className={styles.capacityLegend}><div><span>Tổng số phòng</span><strong>{formatNumber(state.rooms.total)}</strong></div><div><span>Đang lưu trú</span><strong>{formatNumber(activeBookings)}</strong></div></div>
          <Link className={`${styles.actionButton} btn btn-primary mt-auto`} href={routes.admin.rooms}>Quản lý phòng</Link>
        </div></div></div>
      </div>

      <div className="row"><div className="col-12 stretch-card"><div className={`${styles.chartCard} card w-100`}><div className={styles.chartBody}>
        <div className="d-flex justify-content-between align-items-baseline mb-3 gap-3 flex-wrap"><div><h2 className={styles.cardTitle}>Đặt phòng gần đây</h2><p className={styles.description}>Các bản ghi mới nhất theo mã đặt phòng.</p></div><Link className="btn btn-primary" href={routes.admin.bookingAdd}><Icon className="me-1" name="plus" size={18} />Thêm đặt phòng</Link></div>
        <div className="table-responsive"><table className="table table-hover mb-0 align-middle"><thead><tr><th scope="col">Mã</th><th scope="col">Phòng</th><th scope="col">Khách hàng</th><th scope="col">Thời gian</th><th scope="col">Số khách</th></tr></thead><tbody>
          {recentBookings.map((booking) => <tr key={booking.id}><td>#{booking.id}</td><td>{roomById.get(booking.maPhong) ?? `Phòng #${booking.maPhong}`}</td><td>{userById.get(booking.maNguoiDung) ?? `Người dùng #${booking.maNguoiDung}`}</td><td>{formatDate(booking.ngayDen)} → {formatDate(booking.ngayDi)}</td><td>{booking.soLuongKhach}</td></tr>)}
          {!loading && recentBookings.length === 0 && <tr><td colSpan={5} className="text-center text-muted py-4">Chưa có đặt phòng.</td></tr>}
        </tbody></table></div>
      </div></div></div></div>
    </div>
  );
}
