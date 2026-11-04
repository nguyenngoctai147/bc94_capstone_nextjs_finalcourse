"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EmptyState, LoadingSpinner } from "@/component/ui";
import { routes } from "@/route";
import { locationsService } from "@/features/locations/locations.service";
import { bookingsService } from "@/features/bookings/bookings.service";
import type { Booking } from "@/store/type/bookings";
import type { Location } from "@/store/type/location";
import { createReview } from "@/store/thunk/reviews";
import { getLoginHref } from "@/features/auth/auth-navigation";
import { reviewsService } from "@/features/reviews/reviews.service";
import type { RoomReview } from "@/store/type/reviews";
import {
  available,
  checkoutAfter,
  createBookingDraft,
  flowKeys,
  today,
  type Search,
} from "@/features/reservations/flow";
import { toApiError } from "@/services/api-utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { roomsService } from "../rooms.service";
import { RELATED_ROOM_LIMIT, selectRelatedRooms } from "../room-list.utils";
import type { Room } from "@/store/type/room";
import { fetchRoomDetail } from "@/store/thunk/room";
import {
  RelatedRooms,
  RoomBookingSidebar,
  RoomDetailGallery,
  RoomDetailHeading,
  RoomDetailTabs,
  type ReviewFormValue,
  type RoomDetailTab,
} from "./RoomDetailSections";
import styles from "@/theme/features/rooms/room-detail.module.css";

const initialReviewForm: ReviewFormValue = { stars: "5", content: "" };
type RelatedRoomsState = { roomId: number; items: Room[] } | null;
type RoomAvailabilityState = {
  roomId: number;
  attempt: number;
  status: "loading" | "succeeded" | "failed";
  bookings: Booking[];
} | null;

export function RoomDetail({ id, search }: { id: number; search?: Search | null }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selected, requests } = useAppSelector((state) => state.rooms);
  const { user, token, hydrated } = useAppSelector((state) => state.auth);
  const request = requests.detail;
  const room = request.status === "succeeded" && selected?.id === id ? selected : null;
  const [tab, setTab] = useState<RoomDetailTab>("overview");
  const [reviews, setReviews] = useState<RoomReview[]>([]);
  const [relatedState, setRelatedState] = useState<RelatedRoomsState>(null);
  const [roomAvailability, setRoomAvailability] =
    useState<RoomAvailabilityState>(null);
  const [availabilityAttempt, setAvailabilityAttempt] = useState(0);
  const [location, setLocation] = useState<Location | null>(null);
  const [stay, setStay] = useState({ checkIn: search?.checkIn ?? today(), checkOut: search?.checkOut ?? checkoutAfter(today(), 1) });
  const [guests, setGuests] = useState(search?.guests ?? 1);
  const [formError, setFormError] = useState("");
  const [reserveBusy, setReserveBusy] = useState(false);
  const [reviewForm, setReviewForm] = useState(initialReviewForm);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);

  useEffect(() => {
    const task = dispatch(fetchRoomDetail(id));
    return () => task.abort();
  }, [dispatch, id]);

  const roomId = room?.id;

  useEffect(() => {
    if (!roomId) return;

    const controller = new AbortController();

    void bookingsService
      .list({ signal: controller.signal })
      .then(({ data }) => {
        if (controller.signal.aborted) return;

        setRoomAvailability({
          roomId,
          attempt: availabilityAttempt,
          status: "succeeded",
          bookings: data.filter((booking) => booking.maPhong === roomId),
        });
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setRoomAvailability({
          roomId,
          attempt: availabilityAttempt,
          status: "failed",
          bookings: [],
        });
      });

    return () => controller.abort();
  }, [availabilityAttempt, roomId]);

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
  const availability =
    roomAvailability?.roomId === room.id &&
    roomAvailability.attempt === availabilityAttempt
      ? roomAvailability
      : { status: "loading" as const, bookings: [] };

  const handleReserve = async () => {
    const selection: Search = { ...stay, guests, roomId: room.id, locationId: room.maViTri };
    const draft = createBookingDraft(room, selection);

    if (!hydrated) return;
    if (!draft) {
      setFormError(`Chọn ngày hợp lệ và tối đa ${room.khach} khách.`);
      return;
    }

    setReserveBusy(true);
    setFormError("");

    try {
      const latestBookings = await bookingsService.list({
        ...(token ? { token } : {}),
      });

      if (!available(room, draft, latestBookings.data)) {
        setFormError(
          "Phòng không còn trống trong khoảng ngày đã chọn. Vui lòng chọn ngày khác.",
        );
        return;
      }

      sessionStorage.setItem(flowKeys.search, JSON.stringify(selection));
      sessionStorage.setItem(flowKeys.draft, JSON.stringify(draft));
      sessionStorage.removeItem(flowKeys.confirmation);

      const bookingHref = routes.reservation.booking;
      router.push(
        user && token ? bookingHref : getLoginHref(bookingHref),
      );
    } catch (cause) {
      setFormError(
        toApiError(cause).message ||
          "Không thể kiểm tra phòng trống. Vui lòng thử lại.",
      );
    } finally {
      setReserveBusy(false);
    }
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
          busy={reserveBusy}
          availabilityStatus={availability.status}
          bookings={availability.bookings}
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
            void handleReserve();
          }}
          onRetryAvailability={() => {
            setAvailabilityAttempt((value) => value + 1);
          }}
        />
      </aside>
    </div></div></section>
    <RelatedRooms rooms={related} search={search} />
  </>;
}
