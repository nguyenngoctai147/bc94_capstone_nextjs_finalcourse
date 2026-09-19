import { RequireAuth } from "@/components/auth/RequireAuth";
import { AccountProfile } from "@/features/auth/components/AccountProfile";
export default function Page() { return <><h1 className="mb-4">Tài khoản</h1><RequireAuth><AccountProfile /></RequireAuth></>; }
