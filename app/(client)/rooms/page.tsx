import { notFound } from "next/navigation";
import { RoomList } from "@/features/rooms/components/RoomList";
import {
  searchFromParams,
  type SearchParams,
} from "@/features/reservations/flow";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";
import { routes } from "@/config/routes";
import { PageTemplate } from "@/templates/PageTemplate";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const { maViTri } = query;
  let locationId: number | undefined;
  if (maViTri !== undefined) {
    if (typeof maViTri !== "string" || !/^[1-9]\d*$/.test(maViTri)) notFound();
    locationId = Number(maViTri);
    if (!Number.isSafeInteger(locationId)) notFound();
  }

  const search = searchFromParams(query);
  if (
    (query.checkIn !== undefined ||
      query.checkOut !== undefined ||
      query.guests !== undefined) &&
    !search
  ) {
    return (
      <PageTemplate
        title="Phòng lưu trú"
        breadcrumb="Phòng lưu trú"
        content="bare"
      >
        <section className="room-list">
          <div className="container">
            <EmptyState
              title="Thông tin tìm kiếm không hợp lệ"
              description="Chọn ngày nhận từ hôm nay, ngày trả sau ngày nhận và số khách hợp lệ."
              action={
                <Link className="btn btn-orange" href={routes.home}>
                  Tìm kiếm lại
                </Link>
              }
            />
          </div>
        </section>
      </PageTemplate>
    );
  }
  return (
    <PageTemplate
      title="Phòng lưu trú"
      breadcrumb="Phòng lưu trú"
      content="bare"
    >
      <RoomList
        key={`${locationId}-${search?.checkIn}-${search?.checkOut}-${search?.guests}`}
        locationId={locationId}
        search={search}
      />
    </PageTemplate>
  );
}
