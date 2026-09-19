import { RequireAuth } from "@/components/auth/RequireAuth";
import { MyBookings } from "@/features/bookings/components/MyBookings";
export default function Page() {
  return (
    <>
      <h1 className="mb-4">Đặt phòng của tôi</h1>
      <RequireAuth>
        <MyBookings />
      </RequireAuth>
    </>
  );
}
