import { RequireAuth } from "@/components/auth/RequireAuth";
import { UserDetailPage } from "@/features/users/components/UserDetailPage";

export default function Page() {
  return (
    <RequireAuth role="ADMIN">
      <UserDetailPage />
    </RequireAuth>
  );
}
