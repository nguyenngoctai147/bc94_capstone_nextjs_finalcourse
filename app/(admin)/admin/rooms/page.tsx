import { RequireAuth } from "@/components/auth/RequireAuth";
import { ResourcePanel } from "@/components/admin/ResourcePanel";
export default function Page() { return <><h1 className="mb-4">Quản lý phòng</h1><RequireAuth role="ADMIN"><ResourcePanel resource="rooms" /></RequireAuth></>; }
