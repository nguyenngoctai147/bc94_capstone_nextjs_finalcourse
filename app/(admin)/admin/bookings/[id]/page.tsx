import { notFound } from "next/navigation";
import { EditBookingRoomPage } from "@/features/bookings/components/AddBookingRoomPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();

  const bookingId = Number(id);
  if (!Number.isSafeInteger(bookingId)) notFound();

  return <EditBookingRoomPage bookingId={bookingId} />;
}
