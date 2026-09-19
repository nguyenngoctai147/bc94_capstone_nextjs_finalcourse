"use client";
import { useEffect } from "react";
import { Alert, EmptyState, LoadingSpinner } from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { roomsThunks } from "@/features/rooms/rooms.thunks";
import { bookingsThunks } from "@/features/bookings/bookings.thunks";
import { usersThunks } from "@/features/users/users.thunks";
import { locationsThunks } from "@/features/locations/locations.thunks";
import { reviewsThunks } from "@/features/reviews/reviews.thunks";
type Resource = "rooms" | "bookings" | "users" | "locations" | "reviews";
export function ResourcePanel({ resource }: { resource: Resource }) {
  const dispatch = useAppDispatch(); const state = useAppSelector((root) => root[resource]);
  useEffect(() => {
    function load() {
      switch (resource) {
        case "rooms": return dispatch(roomsThunks.list());
        case "bookings": return dispatch(bookingsThunks.list());
        case "users": return dispatch(usersThunks.list());
        case "locations": return dispatch(locationsThunks.list());
        case "reviews": return dispatch(reviewsThunks.list());
      }
    }
    const task = load(); return () => task.abort();
  }, [dispatch, resource]);
  if (state.requests.list.error) return <Alert variant="danger">{state.requests.list.error.message}</Alert>;
  if (state.requests.list.status === "idle" || state.requests.list.status === "loading") return <LoadingSpinner />;
  if (!state.items.length) return <EmptyState />;
  return <div className="card"><div className="table-responsive"><table className="table table-hover align-middle mb-0">
    <caption className="px-3">Danh sách hiện có</caption>
    <thead><tr><th scope="col" className="ps-3">Mã</th><th scope="col">Thông tin</th><th scope="col">Chi tiết</th></tr></thead>
    <tbody>{state.items.map((item) => <tr key={item.id}>
      <td className="ps-3">{item.id}</td>
      <td>{"tenPhong" in item ? item.tenPhong : "name" in item ? item.name : "tenViTri" in item ? item.tenViTri : "noiDung" in item ? item.noiDung : `Phòng #${item.maPhong}`}</td>
      <td>{"email" in item ? item.email : "giaTien" in item ? item.giaTien : "tinhThanh" in item ? item.tinhThanh : "saoBinhLuan" in item ? `${item.saoBinhLuan}/5` : `${item.ngayDen.slice(0, 10)} → ${item.ngayDi.slice(0, 10)}`}</td>
    </tr>)}</tbody>
  </table></div></div>;
}
