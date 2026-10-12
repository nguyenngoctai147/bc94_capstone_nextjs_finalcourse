import { notFound } from "next/navigation";
import { AvailabilityPage } from "@/features/reservations/components/AvailabilityPage";
import { searchFromParams, type SearchParams } from "@/features/reservations/flow";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const initialSearch = searchFromParams(query) ?? undefined;
  const { maPhong } = query;
  const key = JSON.stringify(query);
  if (maPhong === undefined) return <AvailabilityPage key={key} initialSearch={initialSearch} />;
  if (typeof maPhong !== "string" || !/^[1-9]\d*$/.test(maPhong)) notFound();
  const roomId = Number(maPhong);
  if (!Number.isSafeInteger(roomId)) notFound();
  return <AvailabilityPage key={key} roomId={roomId} initialSearch={initialSearch} />;
}
