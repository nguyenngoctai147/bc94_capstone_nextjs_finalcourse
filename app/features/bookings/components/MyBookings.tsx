"use client";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  LoadingSpinner,
} from "@/component/ui";
import { toApiError } from "@/services/api-utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Booking } from "@/store/type/bookings";
import { deleteBooking, fetchBookings } from "@/store/thunk/bookings";

export function MyBookings() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const state = useAppSelector((state) => state.bookings);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState("");

  useEffect(() => {
    if (!userId) return;
    const task = dispatch(fetchBookings({ maNguoiDung: userId }));
    return () => task.abort();
  }, [dispatch, userId]);

  if (state.requests.list.error)
    return <Alert variant="danger">{state.requests.list.error.message}</Alert>;
  if (
    state.requests.list.status === "loading" ||
    state.requests.list.status === "idle"
  )
    return <LoadingSpinner />;

  const bookings = state.items.filter((booking) => booking.maNguoiDung === userId);

  const handleOpenCancellation = (booking: Booking) => {
    setCancelError("");
    setCancelSuccess("");
    setBookingToCancel(booking);
  };

  const handleCloseCancellation = () => {
    if (state.requests.remove.status === "loading") return;
    setBookingToCancel(null);
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel || !userId) return;

    if (bookingToCancel.maNguoiDung !== userId) {
      setBookingToCancel(null);
      setCancelError("Bạn không có quyền hủy đặt phòng này.");
      return;
    }

    setCancelError("");
    try {
      const cancelledId = bookingToCancel.id;
      await dispatch(deleteBooking(cancelledId)).unwrap();
      setBookingToCancel(null);
      setCancelSuccess(`Đã hủy đặt phòng #${cancelledId} thành công.`);
    } catch (error) {
      setCancelError(toApiError(error).message);
    }
  };

  return (
    <>
      {cancelError && <Alert variant="danger">{cancelError}</Alert>}
      {cancelSuccess && <Alert variant="success">{cancelSuccess}</Alert>}

      {bookings.length === 0 ? (
        <EmptyState description="Bạn chưa có đặt phòng nào." />
      ) : (
        <div className="row g-3">
          {bookings.map((booking) => (
            <div className="col-md-6" key={booking.id}>
              <Card
                title={`Đặt phòng #${booking.id}`}
                footer={
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="danger"
                      disabled={state.requests.remove.status === "loading"}
                      onClick={() => handleOpenCancellation(booking)}
                    >
                      <i className="fa fa-times-circle me-2" aria-hidden="true" />
                      Hủy đặt phòng
                    </Button>
                  </div>
                }
              >
                <div className="d-flex flex-column gap-2">
                  <p className="mb-0">
                    <i className="fa fa-bed me-2 text-primary" aria-hidden="true" />
                    Phòng #{booking.maPhong} · {booking.soLuongKhach} khách
                  </p>
                  <p className="mb-0">
                    <i className="fa fa-calendar me-2 text-primary" aria-hidden="true" />
                    {booking.ngayDen.slice(0, 10)} → {booking.ngayDi.slice(0, 10)}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={bookingToCancel !== null}
        title="Xác nhận hủy đặt phòng"
        confirmLabel="Xác nhận hủy"
        loading={state.requests.remove.status === "loading"}
        onClose={handleCloseCancellation}
        onConfirm={handleCancelBooking}
      >
        <p>
          Bạn có chắc muốn hủy đặt phòng
          {bookingToCancel ? ` #${bookingToCancel.id}` : ""} không?
        </p>
        {bookingToCancel && (
          <div className="rounded border bg-light p-3">
            <strong>Phòng #{bookingToCancel.maPhong}</strong>
            <span className="d-block mt-1 text-muted">
              {bookingToCancel.ngayDen.slice(0, 10)} → {bookingToCancel.ngayDi.slice(0, 10)}
            </span>
          </div>
        )}
        <p className="mb-0 mt-3 text-danger">
          Thao tác này sẽ xóa đặt phòng khỏi tài khoản của bạn.
        </p>
      </ConfirmDialog>
    </>
  );
}
