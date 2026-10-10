import { RequireAuth } from "@/components/auth/RequireAuth";
import { AddBookingRoomPage } from "@/features/bookings/components/AddBookingRoomPage";

export default function Page() {
  return (
    <RequireAuth role="ADMIN">
      <AddBookingRoomPage />
    </RequireAuth>
  );
}
