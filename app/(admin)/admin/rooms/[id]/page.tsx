import { notFound } from "next/navigation";
import { EditRoomPage } from "@/features/rooms/components/CreateRoomPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();
  const roomId = Number(id);
  if (!Number.isSafeInteger(roomId)) notFound();
  return <EditRoomPage roomId={roomId} />;
}
