"use client";
import { useEffect } from "react";
import { Alert, Card, EmptyState, LoadingSpinner } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { bookingsThunks } from "../bookings.thunks";
export function MyBookings() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const state = useAppSelector((state) => state.bookings);
  useEffect(() => {
    if (!userId) return;
    const task = dispatch(bookingsThunks.list({ maNguoiDung: userId }));
    return () => task.abort();
  }, [dispatch, userId]);
  if (state.requests.list.error)
    return <Alert variant="danger">{state.requests.list.error.message}</Alert>;
  if (
    state.requests.list.status === "loading" ||
    state.requests.list.status === "idle"
  )
    return <LoadingSpinner />;
  if (!state.items.length)
    return <EmptyState description="Bạn chưa có đặt phòng nào." />;
  return (
    <div className="row g-3">
      {state.items.map((booking) => (
        <div className="col-md-6" key={booking.id}>
          <Card title={`Đặt phòng #${booking.id}`}>
            <p>
              Phòng #{booking.maPhong} · {booking.soLuongKhach} khách
            </p>
            <p className="mb-0">
              {booking.ngayDen.slice(0, 10)} → {booking.ngayDi.slice(0, 10)}
            </p>
          </Card>
        </div>
      ))}
    </div>
  );
}
