import { RequireAuth } from "@/components/auth/RequireAuth";
import { UserManagementPage } from "@/features/users/components/UserManagementPage";

export default function Page() {
  return <RequireAuth role="ADMIN"><UserManagementPage /></RequireAuth>;
}
