"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { AdminPageHeader, Icon } from "@/component/admin";
import { Alert, Button, Input, LoadingSpinner, Select } from "@/component/ui";
import { routes } from "@/route";
import { fetchRooms } from "@/store/thunk/room";
import { fetchUsers } from "@/store/thunk/user";
import { useForm } from "@/hooks/useForm";
import { toApiError } from "@/services/api-utils";
import { localToday } from "@/commons/validation/rules";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { available } from "@/features/reservations/flow";
import {
  adminBookingFormSchema,
  initialAdminBookingFormValues,
  toAdminBookingFormValues,
  toCreateBooking,
  toUpdateBooking,
} from "../booking-admin-form";
import {
  createBooking,
  fetchBookingDetail,
  fetchBookings,
  updateBooking,
} from "@/store/thunk/bookings";

export function AddBookingRoomPage() {
  return <BookingEditorPage />;
}

export function EditBookingRoomPage({ bookingId }: { bookingId: number }) {
  return <BookingEditorPage bookingId={bookingId} />;
}

function BookingEditorPage({ bookingId }: { bookingId?: number }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { rooms, users, bookings } = useAppSelector((state) => ({
    rooms: state.rooms,
    users: state.users,
    bookings: state.bookings,
  }), shallowEqual);
  const [submitError, setSubmitError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const isEditing = bookingId !== undefined;
  const currentBooking = bookings.selected?.id === bookingId
    ? bookings.selected
    : null;
  const form = useForm(
    initialAdminBookingFormValues,
    adminBookingFormSchema(rooms.items),
  );
  const resetBookingForm = form.resetTo;

  useEffect(() => {
    const tasks = [dispatch(fetchRooms()), dispatch(fetchUsers()), dispatch(fetchBookings())];
    return () => tasks.forEach((task) => task.abort());
  }, [dispatch, loadAttempt]);

  useEffect(() => {
    if (!isEditing || bookingId === undefined) return;
    const task = dispatch(fetchBookingDetail(bookingId));
    return () => task.abort();
  }, [bookingId, dispatch, isEditing, loadAttempt]);

  useEffect(() => {
    if (
      !isEditing ||
      !currentBooking ||
      bookings.requests.detail.status !== "succeeded"
    ) {
      return;
    }
    resetBookingForm(toAdminBookingFormValues(currentBooking));
  }, [
    bookings.requests.detail.status,
    currentBooking,
    isEditing,
    resetBookingForm,
  ]);

  const detailRequest = bookings.requests.detail;
  const loadingReferences = [rooms, users, bookings]
    .some((resource) => resource.requests.list.status === "idle" || resource.requests.list.status === "loading");
  const referenceError = [rooms, users, bookings]
    .find((resource) => resource.requests.list.status === "failed")?.requests.list.error?.message;
  const loadingBooking = isEditing &&
    (detailRequest.status === "idle" || detailRequest.status === "loading");
  const loadError = referenceError || (isEditing && detailRequest.status === "failed"
    ? detailRequest.error?.message ?? "Không thể tải thông tin đặt phòng."
    : "");

  const handleSaveBooking = form.handleSubmit(async (values) => {
    setSubmitError("");
    if (isEditing && !currentBooking) {
      setSubmitError("Không thể xác định đặt phòng gốc. Vui lòng tải lại dữ liệu.");
      return;
    }

    const room = rooms.items.find((item) => item.id === Number(values.maPhong));
    if (!room) {
      setSubmitError("Phòng đã chọn không còn trong danh sách. Vui lòng tải lại trang.");
      return;
    }
    const customerId = currentBooking?.maNguoiDung ?? Number(values.maNguoiDung);
    if (!users.items.some((user) => user.id === customerId)) {
      setSubmitError("Khách hàng đã chọn không còn trong danh sách. Vui lòng tải lại trang.");
      return;
    }

    const search = {
      checkIn: values.ngayDen,
      checkOut: values.ngayDi,
      guests: Number(values.soLuongKhach),
    };
    const otherBookings = bookings.items.filter((booking) => booking.id !== bookingId);
    if (!available(room, search, otherBookings)) {
      setSubmitError("Phòng không còn trống trong khoảng ngày này hoặc vượt quá sức chứa.");
      return;
    }

    try {
      if (isEditing && bookingId !== undefined) {
        await dispatch(updateBooking({
          id: bookingId,
          data: toUpdateBooking(bookingId, values, customerId),
        })).unwrap();
      } else {
        await dispatch(createBooking(toCreateBooking(values))).unwrap();
      }
      router.push(routes.admin.bookings);
    } catch (error) {
      setSubmitError(toApiError(error).message);
    }
  });

  const handleReset = () => {
    if (currentBooking) {
      resetBookingForm(toAdminBookingFormValues(currentBooking));
    } else {
      form.reset();
    }
    setSubmitError("");
  };

  const title = isEditing ? "Sửa đặt phòng" : "Thêm đặt phòng";
  const description = isEditing
    ? "Điều chỉnh phòng, thời gian lưu trú và số khách; thông tin khách hàng được giữ nguyên."
    : "Tạo đặt phòng bằng dữ liệu phòng và người dùng đang có trên hệ thống.";
  return (
    <>
      <AdminPageHeader
        title={title}
        description={description}
        breadcrumbs={[
          { label: "Tổng quan", href: routes.admin.dashboard },
          { label: "Đặt phòng", href: routes.admin.bookings },
          { label: title },
        ]}
        action={<Link href={routes.admin.bookings} className="btn btn-outline-primary"><Icon className="me-1" name="arrow-left" size={18} />Quay lại danh sách</Link>}
      />

      <div className="row">
        <div className="col-xl-8 col-lg-10 grid-margin stretch-card">
          <div className="card w-100">
            <div className="card-body">
              <h2 className="h5 mb-4">Thông tin lưu trú</h2>
              {(loadingReferences || loadingBooking) && (
                <LoadingSpinner label={loadingBooking ? "Đang tải thông tin đặt phòng" : "Đang tải dữ liệu biểu mẫu"} />
              )}
              {loadError && (
                <Alert variant="danger">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                    <span>{loadError}</span>
                    <Button size="sm" variant="outline-primary" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>
                      Tải lại
                    </Button>
                  </div>
                </Alert>
              )}
              {submitError && <Alert variant="danger">{submitError}</Alert>}

              {!loadingReferences && !loadingBooking && !loadError && (
                <form className="forms-sample" noValidate onSubmit={handleSaveBooking}>
                  <div className="row">
                    <div className="col-lg-6">
                      <Select
                        label="Phòng"
                        name="maPhong"
                        required
                        options={[
                          { value: "", label: "Chọn phòng" },
                          ...rooms.items.map((room) => ({ value: room.id, label: `#${room.id} · ${room.tenPhong} (${room.khach} khách)` })),
                        ]}
                        value={form.values.maPhong}
                        error={form.errors.maPhong}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                      />
                    </div>
                    {isEditing ? (
                      <div className="col-lg-6">
                        <Input
                          label="Mã khách hàng"
                          name="maNguoiDung"
                          readOnly
                          value={form.values.maNguoiDung}
                          error={form.errors.maNguoiDung}
                          hint="Thông tin khách hàng được giữ nguyên khi sửa đặt phòng."
                        />
                      </div>
                    ) : (
                      <div className="col-lg-6">
                        <Select
                          label="Khách hàng"
                          name="maNguoiDung"
                          required
                          options={[
                            { value: "", label: "Chọn khách hàng" },
                            ...users.items.map((user) => ({ value: user.id, label: `#${user.id} · ${user.name} · ${user.email}` })),
                          ]}
                          value={form.values.maNguoiDung}
                          error={form.errors.maNguoiDung}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                        />
                      </div>
                    )}
                    <div className="col-lg-6">
                      <Input
                        label="Ngày nhận phòng"
                        name="ngayDen"
                        type="date"
                        min={localToday()}
                        required
                        value={form.values.ngayDen}
                        error={form.errors.ngayDen}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                      />
                    </div>
                    <div className="col-lg-6">
                      <Input
                        label="Ngày trả phòng"
                        name="ngayDi"
                        type="date"
                        min={form.values.ngayDen || localToday()}
                        required
                        value={form.values.ngayDi}
                        error={form.errors.ngayDi}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                      />
                    </div>
                    <div className="col-lg-6">
                      <Input
                        label="Số khách"
                        name="soLuongKhach"
                        type="number"
                        min={1}
                        max={rooms.items.find((room) => room.id === Number(form.values.maPhong))?.khach}
                        required
                        value={form.values.soLuongKhach}
                        error={form.errors.soLuongKhach}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-2 mt-2">
                    <Button type="submit" loading={form.submitting}>
                      {isEditing ? "Cập nhật đặt phòng" : "Tạo đặt phòng"}
                    </Button>
                    <Button type="reset" variant="outline-secondary" disabled={form.submitting} onClick={handleReset}>
                      {isEditing ? "Khôi phục dữ liệu" : "Làm lại"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
