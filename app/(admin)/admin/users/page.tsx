import { RequireAuth } from "@/components/auth/RequireAuth";
import { ResourcePanel } from "@/components/admin/ResourcePanel";
export default function Page() { return <><h1 className="mb-4">Quản lý người dùng</h1><RequireAuth role="ADMIN"><ResourcePanel resource="users" /></RequireAuth></>; }
