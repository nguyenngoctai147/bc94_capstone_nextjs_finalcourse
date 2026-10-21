import { notFound } from "next/navigation";
import { UserDetailPage } from "@/features/users/components/UserDetailPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: value } = await params;
  if (!/^[1-9]\d*$/.test(value)) notFound();
  const id = Number(value);
  if (!Number.isSafeInteger(id)) notFound();
  return <UserDetailPage id={id} />;
}
