import { notFound } from "next/navigation";
import { RoomDetail } from "@/features/rooms/components/RoomDetail";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const roomId = Number(id);
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(roomId) || roomId < 1)
    notFound();
  return <RoomDetail id={roomId} />;
}
