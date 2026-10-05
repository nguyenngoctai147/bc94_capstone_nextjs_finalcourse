"use client";

import CardRoom from "@/components/ui/CardRoom";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { roomsThunks } from "@/features/rooms/rooms.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

const HOME_ROOM_LIMIT = 6;

export default function DatPhong() {
  const dispatch = useAppDispatch();
  const { items, requests } = useAppSelector((state) => state.rooms);
  const request = requests.list;
  const rooms = items.slice(0, HOME_ROOM_LIMIT);

  useEffect(() => {
    const task = dispatch(roomsThunks.list());
    return () => task.abort();
  }, [dispatch]);

  return (
    <section className="rooms rooms-style1 ds-section">
      <div className="container">
        <div className="section-title">
          <h2>
            Danh sách <span>chỗ nghỉ lý tưởng</span>
          </h2>
          <p>Những chỗ nghỉ nổi bật được đề xuất cho quý khách</p>
        </div>
        <div className="room-outer">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-layout">
            {request.status === "idle" || request.status === "loading" ? (
              <div className="tw-col-span-full tw-text-center tw-py-8">
                <LoadingSpinner label="Đang tải danh sách phòng" />
              </div>
            ) : request.status === "failed" ? (
              <div className="tw-col-span-full">
                <EmptyState
                  title="Không thể tải phòng"
                  description={request.error?.message}
                  action={
                    <button
                      type="button"
                      className="btn btn-orange"
                      onClick={() => {
                        void dispatch(roomsThunks.list());
                      }}
                    >
                      Thử lại
                    </button>
                  }
                />
              </div>
            ) : rooms.length > 0 ? (
              rooms.map((room) => <CardRoom key={room.id} room={room} />)
            ) : (
              <div className="tw-col-span-full">
                <EmptyState
                  title="Chưa có phòng"
                  description="Danh sách phòng hiện chưa có dữ liệu."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
