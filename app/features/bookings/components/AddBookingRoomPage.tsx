"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { shallowEqual } from "react-redux";
import { AdminPageHeader, Icon } from "@/components/admin";
import { Alert, Button, Input, LoadingSpinner, Select } from "@/components/ui";
import { routes } from "@/config/routes";
import { fetchRooms } from "@/features/rooms/rooms.slice";
import { fetchUsers } from "@/features/users/users.slice";
import { useForm } from "@/hooks/useForm";
import { toApiError } from "@/lib/api/errors";
import { localToday, positiveInteger, required, validDate } from "@/lib/validation/rules";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { available } from "@/features/reservations/flow";
import { createBooking, fetchBookings } from "../bookings.slice";

type BookingValues = {
  maPhong: string;
  maNguoiDung: string;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: string;
};

const initialValues: BookingValues = {
  maPhong: "",
  maNguoiDung: "",
  ngayDen: "",
  ngayDi: "",
  soLuongKhach: "1",
};

export function AddBookingRoomPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { rooms, users, bookings } = useAppSelector((state) => ({
    rooms: state.rooms,
    users: state.users,
    bookings: state.bookings,
  }), shallowEqual);
  const [submitError, setSubmitError] = useState("");
  const form = useForm<BookingValues>(initialValues, {
    maPhong: [required("Vui lòng chọn phòng."), positiveInteger],
    maNguoiDung: [required("Vui lòng chọn khách hàng."), positiveInteger],
    ngayDen: [
      required(),
      validDate,
      (value) => value >= localToday() ? undefined : "Ngày nhận phòng không được ở quá khứ.",
    ],
    ngayDi: [
      required(),
      validDate,
      (value, values) => value > values.ngayDen ? undefined : "Ngày trả phòng phải sau ngày nhận phòng.",
    ],
    soLuongKhach: [
      required(),
      positiveInteger,
      (value, values) => {
        const room = rooms.items.find((item) => item.id === Number(values.maPhong));
        return !room || Number(value) <= room.khach ? undefined : `Phòng tối đa ${room.khach} khách.`;
      },
    ],
  });

  useEffect(() => {
    const tasks = [dispatch(fetchRooms()), dispatch(fetchUsers()), dispatch(fetchBookings())];
    return () => tasks.forEach((task) => task.abort());
  }, [dispatch]);

  const loadingReferences = [rooms, users, bookings]
    .some((resource) => resource.requests.list.status === "idle" || resource.requests.list.status === "loading");
  const referenceError = [rooms, users, bookings]
    .find((resource) => resource.requests.list.status === "failed")?.requests.list.error?.message;

  const handleCreateBooking = form.handleSubmit(async (values) => {
    setSubmitError("");
    const room = rooms.items.find((item) => item.id === Number(values.maPhong));
    if (!room) {
      setSubmitError("Phòng đã chọn không còn trong danh sách. Vui lòng tải lại trang.");
      return;
    }

    const search = {
      checkIn: values.ngayDen,
      checkOut: values.ngayDi,
      guests: Number(values.soLuongKhach),
    };
    if (!available(room, search, bookings.items)) {
      setSubmitError("Phòng không còn trống trong khoảng ngày này hoặc vượt quá sức chứa.");
      return;
    }

    try {
      await dispatch(createBooking({
        maPhong: Number(values.maPhong),
        maNguoiDung: Number(values.maNguoiDung),
        ngayDen: `${values.ngayDen}T00:00:00`,
        ngayDi: `${values.ngayDi}T00:00:00`,
        soLuongKhach: Number(values.soLuongKhach),
      })).unwrap();
      router.push(routes.admin.bookings);
    } catch (error) {
      setSubmitError(toApiError(error).message);
    }
  });

  return (
    <>
      <AdminPageHeader
        title="Thêm đặt phòng"
        description="Tạo đặt phòng bằng dữ liệu phòng và người dùng đang có trên hệ thống."
        breadcrumbs={[
          { label: "Tổng quan", href: routes.admin.dashboard },
          { label: "Đặt phòng", href: routes.admin.bookings },
          { label: "Thêm đặt phòng" },
        ]}
        action={<Link href={routes.admin.bookings} className="btn btn-outline-primary"><Icon className="me-1" name="arrow-left" size={18} />Quay lại danh sách</Link>}
      />

      <div className="row">
        <div className="col-xl-8 col-lg-10 grid-margin stretch-card">
          <div className="card w-100">
            <div className="card-body">
              <h2 className="h5 mb-4">Thông tin lưu trú</h2>
              {loadingReferences && <LoadingSpinner label="Đang tải dữ liệu biểu mẫu" />}
              {referenceError && <Alert variant="danger">{referenceError}</Alert>}
              {submitError && <Alert variant="danger">{submitError}</Alert>}

              {!loadingReferences && !referenceError && (
                <form className="forms-sample" noValidate onSubmit={handleCreateBooking}>
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
                    <Button type="submit" loading={form.submitting}>Tạo đặt phòng</Button>
                    <Button type="reset" variant="outline-secondary" disabled={form.submitting} onClick={form.reset}>Làm lại</Button>
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
