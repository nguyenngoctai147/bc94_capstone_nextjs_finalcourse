import { RequireAuth } from "@/components/auth/RequireAuth";
import { CompanyProfilePage } from "@/features/users/components/CompanyProfilePage";

export default function Page() {
  return <RequireAuth role="ADMIN"><CompanyProfilePage /></RequireAuth>;
}
