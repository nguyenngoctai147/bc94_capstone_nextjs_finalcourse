import { notFound } from "next/navigation";
import { RoomDetail } from "@/features/rooms/components/RoomDetail";
import {
  searchFromParams,
  type SearchParams,
} from "@/features/reservations/flow";
import { PageTemplate } from "@/templates/PageTemplate";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const roomId = Number(id);
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(roomId) || roomId < 1)
    notFound();
  return (
    <PageTemplate
      title="Chi tiết phòng"
      breadcrumb="Chi tiết phòng"
      content="bare"
    >
      <RoomDetail id={roomId} search={searchFromParams(await searchParams)} />
    </PageTemplate>
  );
}
