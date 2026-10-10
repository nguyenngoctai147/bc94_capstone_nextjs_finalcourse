import { RequireAuth } from "@/components/auth/RequireAuth";
import { LiveBookingManagement } from "@/features/bookings/components/LiveBookingManagement";

export default function Page() {
  return <RequireAuth role="ADMIN"><LiveBookingManagement /></RequireAuth>;
}
