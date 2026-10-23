"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EmptyState, LoadingSpinner } from "@/components/ui";
import { routes } from "@/config/routes";
import { locationsService } from "@/features/locations/locations.service";
import type { Location } from "@/features/locations/locations.types";
import { createReview } from "@/features/reviews/reviews.slice";
import { reviewsService } from "@/features/reviews/reviews.service";
import type { RoomReview } from "@/features/reviews/reviews.types";
import { checkoutAfter, today, validSearch, withStaySearch, type Search } from "@/features/reservations/flow";
import { toApiError } from "@/lib/api/errors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { roomsService } from "../rooms.service";
import { RELATED_ROOM_LIMIT, selectRelatedRooms } from "../room-list.utils";
import type { Room } from "../rooms.types";
import { fetchRoomDetail } from "../rooms.slice";
import {
  RelatedRooms,
  RoomBookingSidebar,
  RoomDetailGallery,
  RoomDetailHeading,
  RoomDetailTabs,
  type ReviewFormValue,
  type RoomDetailTab,
} from "./RoomDetailSections";
import styles from "./RoomDetail.module.css";

const initialReviewForm: ReviewFormValue = { stars: "5", content: "" };
type RelatedRoomsState = { roomId: number; items: Room[] } | null;

export function RoomDetail({ id, search }: { id: number; search?: Search | null }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selected, requests } = useAppSelector((state) => state.rooms);
  const { user, token } = useAppSelector((state) => state.auth);
  const request = requests.detail;
  const room = request.status === "succeeded" && selected?.id === id ? selected : null;
  const [tab, setTab] = useState<RoomDetailTab>("overview");
  const [reviews, setReviews] = useState<RoomReview[]>([]);
  const [relatedState, setRelatedState] = useState<RelatedRoomsState>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [stay, setStay] = useState({ checkIn: search?.checkIn ?? today(), checkOut: search?.checkOut ?? checkoutAfter(today(), 1) });
  const [guests, setGuests] = useState(search?.guests ?? 1);
  const [formError, setFormError] = useState("");
  const [reviewForm, setReviewForm] = useState(initialReviewForm);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);

  useEffect(() => {
    const task = dispatch(fetchRoomDetail(id));
    return () => task.abort();
  }, [dispatch, id]);

  useEffect(() => {
    if (!room) return;
    const controller = new AbortController();

    const loadRelatedRooms = async () => {
      let nearbyRooms: Room[] = [];

      try {
        nearbyRooms = await roomsService.byLocation(room.maViTri, {
          signal: controller.signal,
        });
      } catch {
        // The full catalogue below remains a safe fallback when this endpoint fails.
      }

      const nearbyRelatedRooms = selectRelatedRooms(room, nearbyRooms, []);
      if (nearbyRelatedRooms.length === RELATED_ROOM_LIMIT) {
        return nearbyRelatedRooms;
      }

      try {
        const catalogue = await roomsService.list({ signal: controller.signal });
        return selectRelatedRooms(room, nearbyRooms, catalogue.data);
      } catch {
        return nearbyRelatedRooms;
      }
    };

    void Promise.allSettled([
      reviewsService.byRoom(room.id, { signal: controller.signal }),
      loadRelatedRooms(),
      locationsService.detail(room.maViTri, { signal: controller.signal }),
    ]).then(([reviewResult, relatedResult, locationResult]) => {
      if (controller.signal.aborted) return;
      setReviews(reviewResult.status === "fulfilled" ? reviewResult.value : []);
      setRelatedState({
        roomId: room.id,
        items: relatedResult.status === "fulfilled" ? relatedResult.value : [],
      });
      setLocation(locationResult.status === "fulfilled" ? locationResult.value : null);
    });

    return () => controller.abort();
  }, [room]);

  const rating = useMemo(
    () => reviews.length
      ? reviews.reduce((total, review) => total + review.saoBinhLuan, 0) / reviews.length
      : null,
    [reviews],
  );

  if (request.status === "failed") {
    return <section className="content ds-content"><div className="container"><EmptyState title="Không thể tải thông tin phòng" description={request.error?.message} action={<button type="button" className="btn btn-orange" onClick={() => { void dispatch(fetchRoomDetail(id)); }}>Thử lại</button>} /></div></section>;
  }

  if (!room) {
    return <section className="content ds-content"><div className="container text-center py-5"><LoadingSpinner label="Đang tải thông tin phòng" /></div></section>;
  }

  const related = relatedState?.roomId === room.id ? relatedState.items : [];

  const handleReserve = () => {
    const selection: Search = { ...stay, guests, roomId: room.id, locationId: room.maViTri };
    if (!validSearch(selection) || guests > room.khach) {
      setFormError(`Chọn ngày hợp lệ và tối đa ${room.khach} khách.`);
      return;
    }
    router.push(withStaySearch(routes.reservation.forRoom(room.id), selection));
  };

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!user || !token) {
      setReviewError("Vui lòng đăng nhập để gửi đánh giá.");
      return;
    }

    const content = reviewForm.content.trim();
    if (content.length < 3) {
      setReviewError("Nội dung đánh giá cần ít nhất 3 ký tự.");
      return;
    }

    setReviewSubmitting(true);
    try {
      await dispatch(createReview({
        maPhong: room.id,
        maNguoiBinhLuan: user.id,
        ngayBinhLuan: new Date().toISOString(),
        noiDung: content,
        saoBinhLuan: Number(reviewForm.stars),
      })).unwrap();
      const nextReviews = await reviewsService.byRoom(room.id, { token });
      setReviews(nextReviews);
      setReviewForm(initialReviewForm);
      setReviewPage(1);
      setReviewSuccess("Đánh giá của bạn đã được gửi.");
    } catch (cause) {
      setReviewError(toApiError(cause).message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return <>
    <section className="details"><div className="container"><div className={`row ${styles.detailLayout}`}>
      <div className="col-lg-8">
        <RoomDetailGallery room={room} />
        <div className="detail-content">
          <RoomDetailHeading room={room} rating={rating} reviewCount={reviews.length} />
          <RoomDetailTabs
            tab={tab}
            room={room}
            reviews={reviews}
            related={related}
            location={location}
            search={search}
            reviewForm={reviewForm}
            reviewError={reviewError}
            reviewSuccess={reviewSuccess}
            reviewSubmitting={reviewSubmitting}
            reviewPage={reviewPage}
            signedIn={Boolean(user && token)}
            onTabChange={setTab}
            onReviewFormChange={(value) => {
              setReviewForm(value);
              setReviewError("");
              setReviewSuccess("");
            }}
            onReviewSubmit={handleReviewSubmit}
            onReviewPageChange={setReviewPage}
          />
        </div>
      </div>
      <aside className="col-lg-4">
        <RoomBookingSidebar
          room={room}
          featuredRoom={related[0] ?? null}
          stay={stay}
          guests={guests}
          error={formError}
          onStayChange={(value) => {
            setStay(value);
            setFormError("");
          }}
          onGuestsChange={(value) => {
            setGuests(value);
            setFormError("");
          }}
          onSubmit={(event) => {
            event.preventDefault();
            handleReserve();
          }}
        />
      </aside>
    </div></div></section>
    <RelatedRooms rooms={related} search={search} />
  </>;
}
