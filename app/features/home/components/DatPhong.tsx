"use client";

import { useMemo } from "react";
import CardRoom from "@/component/ui/CardRoom";
import { EmptyState } from "@/component/ui/EmptyState";
import { LoadingSpinner } from "@/component/ui/LoadingSpinner";
import { fetchRooms } from "@/store/thunk/room";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const HOME_ROOM_LIMIT = 6;

export default function DatPhong() {
  const dispatch = useAppDispatch();
  const { items, requests } = useAppSelector((state) => state.rooms);
  const reviews = useAppSelector((state) => state.reviews.items);
  const request = requests.list;
  const rooms = items.slice(0, HOME_ROOM_LIMIT);
  const ratingsByRoom = useMemo(() => {
    const totals = reviews.reduce((result, review) => {
      const current = result.get(review.maPhong) ?? { total: 0, count: 0 };
      result.set(review.maPhong, {
        total: current.total + review.saoBinhLuan,
        count: current.count + 1,
      });
      return result;
    }, new Map<number, { total: number; count: number }>());

    return new Map(
      Array.from(totals, ([roomId, value]) => [
        roomId,
        value.total / value.count,
      ]),
    );
  }, [reviews]);

  return (
    <section className="rooms ds-section">
      <div className="container">
        <div className="section-title">
          <h2>
            Danh sách <span>chỗ nghỉ lý tưởng</span>
          </h2>
          <p>Những chỗ nghỉ nổi bật được đề xuất cho quý khách</p>
        </div>
        <div className="room-outer">
          <div className="row">
            {request.status === "idle" || request.status === "loading" ? (
              <div className="col-12 text-center pad-top-30 pad-bottom-30">
                <LoadingSpinner label="Đang tải danh sách phòng" />
              </div>
            ) : request.status === "failed" ? (
              <div className="col-12">
                <EmptyState
                  title="Không thể tải phòng"
                  description={request.error?.message}
                  action={
                    <button
                      type="button"
                      className="btn btn-orange"
                      onClick={() => {
                        void dispatch(fetchRooms());
                      }}
                    >
                      Thử lại
                    </button>
                  }
                />
              </div>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <div
                  className="col-lg-4 col-md-6 mar-bottom-30 d-flex"
                  key={room.id}
                >
                  <CardRoom room={room} rating={ratingsByRoom.get(room.id)} />
                </div>
              ))
            ) : (
              <div className="col-12">
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
