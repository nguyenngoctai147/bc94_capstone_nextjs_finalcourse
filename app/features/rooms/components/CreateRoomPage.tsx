"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminPageHeader, Icon } from "@/component/admin";
import { Alert, Button, Input, LoadingSpinner, Select, Textarea } from "@/component/ui";
import { routes } from "@/route";
import { fetchLocations } from "@/store/thunk/location";
import { useForm } from "@/hooks/useForm";
import { toApiError } from "@/services/api-utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import styles from "@/theme/features/rooms/room-admin.module.css";
import { roomAmenities } from "../room-amenities";
import { RoomAmenityIcon } from "./RoomAmenityIcon";
import { initialRoomFormValues, roomFormSchema, toCreateRoom, toRoomFormValues, toUpdateRoom } from "../room-form";
import { createRoom, fetchRoomDetail, updateRoom } from "@/store/thunk/room";

const numberFields = [
  { name: "khach", label: "Số khách tối đa" },
  { name: "phongNgu", label: "Số phòng ngủ" },
  { name: "giuong", label: "Số giường" },
  { name: "phongTam", label: "Số phòng tắm" },
] as const;

export function CreateRoomPage() {
  return <RoomEditorPage />;
}

export function EditRoomPage({ roomId }: { roomId: number }) {
  return <RoomEditorPage roomId={roomId} />;
}

function RoomEditorPage({ roomId }: { roomId?: number }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const locations = useAppSelector((state) => state.locations);
  const rooms = useAppSelector((state) => state.rooms);
  const isEditing = roomId !== undefined;
  const currentRoom = rooms.selected?.id === roomId ? rooms.selected : null;
  const [submitError, setSubmitError] = useState("");
  const [locationAttempt, setLocationAttempt] = useState(0);
  const [roomAttempt, setRoomAttempt] = useState(0);
  const form = useForm(initialRoomFormValues, roomFormSchema);
  const resetRoomForm = form.resetTo;

  useEffect(() => {
    const task = dispatch(fetchLocations());
    return () => task.abort();
  }, [dispatch, locationAttempt]);

  useEffect(() => {
    if (!isEditing || roomId === undefined) return;
    const task = dispatch(fetchRoomDetail(roomId));
    return () => task.abort();
  }, [dispatch, isEditing, roomAttempt, roomId]);

  useEffect(() => {
    if (!isEditing || !currentRoom || rooms.requests.detail.status !== "succeeded") return;
    resetRoomForm(toRoomFormValues(currentRoom));
  }, [currentRoom, isEditing, resetRoomForm, rooms.requests.detail.status]);

  const locationRequest = locations.requests.list;
  const roomRequest = rooms.requests.detail;
  const loadingLocations = locationRequest.status === "idle" || locationRequest.status === "loading";
  const loadingRoom = isEditing && (roomRequest.status === "idle" || roomRequest.status === "loading");

  const handleSaveRoom = form.handleSubmit(async (values) => {
    setSubmitError("");
    const locationId = Number(values.maViTri);
    if (!locations.items.some(({ id }) => id === locationId)) {
      setSubmitError("Vị trí đã chọn không còn trong danh sách. Vui lòng tải lại dữ liệu.");
      return;
    }

    try {
      if (isEditing && roomId !== undefined) {
        await dispatch(updateRoom({ id: roomId, data: toUpdateRoom(roomId, values) })).unwrap();
      } else {
        await dispatch(createRoom(toCreateRoom(values))).unwrap();
      }
      router.push(routes.admin.rooms);
    } catch (error) {
      setSubmitError(toApiError(error).message);
    }
  });

  const handleReset = () => {
    if (currentRoom) resetRoomForm(toRoomFormValues(currentRoom));
    else form.reset();
    setSubmitError("");
  };

  const renderNumberFields = () => numberFields.map(({ name, label }) => (
    <div className="col-md-6 col-xl-3" key={name}>
      <Input label={label} name={name} type="number" min={1} step={1} required value={form.values[name]} error={form.errors[name]} onChange={form.handleChange} onBlur={form.handleBlur} />
    </div>
  ));

  const renderAmenities = () => roomAmenities.map(({ key, label }) => (
    <label className={`${styles.amenityOption} ${form.values[key] === "true" ? styles.amenityOptionSelected : ""}`} htmlFor={`room-${key}`} key={key}>
      <input id={`room-${key}`} className={`form-check-input ${styles.amenityInput}`} name={key} type="checkbox" value="true" checked={form.values[key] === "true"} disabled={form.submitting} onChange={form.handleChange} />
      <span className={styles.amenityIcon}><RoomAmenityIcon amenity={key} /></span>
      <span className={styles.amenityText}>{label}</span>
    </label>
  ));

  const title = isEditing ? "Sửa phòng" : "Thêm phòng";
  const description = isEditing
    ? "Cập nhật thông tin, sức chứa, giá, vị trí và tiện nghi của phòng theo API phòng thuê."
    : "Tạo phòng mới với thông tin sức chứa, giá, vị trí và tiện nghi theo API phòng thuê.";

  return (
    <>
      <AdminPageHeader
        title={title}
        description={description}
        breadcrumbs={[{ label: "Tổng quan", href: routes.admin.dashboard }, { label: "Phòng", href: routes.admin.rooms }, { label: title }]}
        action={<Link href={routes.admin.rooms} className="btn btn-outline-primary"><Icon className="me-1" name="arrow-left" size={18} />Quay lại danh sách</Link>}
      />

      <div className="row"><div className="col-12 grid-margin stretch-card"><div className="card w-100"><div className="card-body">
        {submitError && <Alert variant="danger">{submitError}</Alert>}
        {locationRequest.status === "failed" && <Alert variant="danger"><div className="d-flex flex-wrap align-items-center justify-content-between gap-2"><span>{locationRequest.error?.message ?? "Không thể tải danh sách vị trí."}</span><Button size="sm" variant="outline-primary" onClick={() => setLocationAttempt((attempt) => attempt + 1)}>Tải lại</Button></div></Alert>}
        {isEditing && roomRequest.status === "failed" && <Alert variant="danger"><div className="d-flex flex-wrap align-items-center justify-content-between gap-2"><span>{roomRequest.error?.message ?? "Không thể tải thông tin phòng."}</span><Button size="sm" variant="outline-primary" onClick={() => setRoomAttempt((attempt) => attempt + 1)}>Tải lại</Button></div></Alert>}

        {loadingLocations || loadingRoom ? (
          <div className="py-4"><LoadingSpinner label={loadingRoom ? "Đang tải thông tin phòng" : "Đang tải danh sách vị trí"} /></div>
        ) : locationRequest.status !== "failed" && (!isEditing || roomRequest.status !== "failed") && (
          <form className="forms-sample" noValidate onSubmit={handleSaveRoom}>
            <section className="mb-4" aria-labelledby="room-basic-heading">
              <h2 id="room-basic-heading" className="h5 mb-3">Thông tin cơ bản</h2>
              <div className="row">
                <div className="col-lg-8"><Input label="Tên phòng" name="tenPhong" required placeholder="Ví dụ: Deluxe hướng biển" value={form.values.tenPhong} error={form.errors.tenPhong} onChange={form.handleChange} onBlur={form.handleBlur} /></div>
                <div className="col-lg-4"><Select label="Vị trí" name="maViTri" required options={[{ value: "", label: "Chọn vị trí" }, ...locations.items.map((location) => ({ value: location.id, label: `#${location.id} · ${location.tenViTri}, ${location.tinhThanh}` }))]} value={form.values.maViTri} error={form.errors.maViTri} onChange={form.handleChange} onBlur={form.handleBlur} /></div>
                <div className="col-12"><Textarea label="Mô tả" name="moTa" required rows={5} value={form.values.moTa} error={form.errors.moTa} onChange={form.handleChange} onBlur={form.handleBlur} /></div>
                <div className="col-lg-8"><Input label="URL hình ảnh" name="hinhAnh" type="url" placeholder="https://airbnbnew.cybersoft.edu.vn/images/..." hint="Dùng URL ảnh được website hỗ trợ hoặc để trống và cập nhật sau." value={form.values.hinhAnh} error={form.errors.hinhAnh} onChange={form.handleChange} onBlur={form.handleBlur} /></div>
                <div className="col-lg-4"><Input label="Giá mỗi đêm (USD)" name="giaTien" type="number" min={1} step={1} required value={form.values.giaTien} error={form.errors.giaTien} onChange={form.handleChange} onBlur={form.handleBlur} /></div>
              </div>
            </section>

            <section className="mb-4" aria-labelledby="room-capacity-heading"><h2 id="room-capacity-heading" className="h5 mb-3">Sức chứa</h2><div className="row">{renderNumberFields()}</div></section>
            <fieldset className="mb-4"><legend className="h5 mb-3">Tiện nghi</legend><div className={styles.amenityGrid}>{renderAmenities()}</div></fieldset>

            {locations.items.length === 0 && <Alert variant="warning">Chưa có vị trí để gắn cho phòng.</Alert>}
            <div className={styles.formActions}>
              <Button type="submit" loading={form.submitting} disabled={locations.items.length === 0}>{isEditing ? "Cập nhật phòng" : "Tạo phòng"}</Button>
              <Button type="button" variant="outline-secondary" disabled={form.submitting} onClick={handleReset}>{isEditing ? "Khôi phục dữ liệu" : "Làm lại"}</Button>
            </div>
          </form>
        )}
      </div></div></div></div>
    </>
  );
}
