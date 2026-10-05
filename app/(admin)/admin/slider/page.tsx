import { RequireAuth } from "@/components/auth/RequireAuth";
import { SliderManagementPage } from "@/features/sliders/components/SliderManagementPage";

export default function Page() {
  return <RequireAuth role="ADMIN"><SliderManagementPage /></RequireAuth>;
}
