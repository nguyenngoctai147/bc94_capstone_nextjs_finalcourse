import { notFound } from "next/navigation";
import { EditLocationPage } from "@/features/locations/components/CreateLocationPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();

  const locationId = Number(id);
  if (!Number.isSafeInteger(locationId)) notFound();

  return <EditLocationPage locationId={locationId} />;
}
