"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { bookingsService } from "@/features/bookings/bookings.service";
import { roomsService } from "@/features/rooms/rooms.service";
import { routes } from "@/route";
import type { Booking } from "@/store/type/bookings";
import type { Room } from "@/store/type/room";
import {
  checkoutAfter,
  countAvailableRooms,
  flowKeys,
  nights,
  validSearch,
  type Search,
} from "../flow";
import {
  DateRangeCalendar,
  ReservationProgress,
  type CalendarDateStatus,
} from "./ReservationUi";
import { StayDateFields } from "./StayDateFields";
import styles from "@/theme/features/reservations/reservation.module.css";

type AvailabilityData = {
  status: "loading" | "succeeded" | "failed";
  rooms: Room[];
  bookings: Booking[];
};

const initialAvailability: AvailabilityData = {
  status: "loading",
  rooms: [],
  bookings: [],
};

export function AvailabilityPage({
  roomId,
  initialSearch,
}: {
  roomId?: number;
  initialSearch?: Search;
}) {
  const router = useRouter();
  const locationId = initialSearch?.locationId;
  const [stay, setStay] = useState({
    checkIn: initialSearch?.checkIn ?? "",
    checkOut: initialSearch?.checkOut ?? "",
  });
  const [guests, setGuests] = useState(initialSearch?.guests ?? 1);
  const [availability, setAvailability] =
    useState<AvailabilityData>(initialAvailability);
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const roomsRequest = roomId
      ? roomsService
          .detail(roomId, { signal: controller.signal })
          .then((room) => [room])
      : roomsService
          .list({ signal: controller.signal })
          .then((response) => response.data);

    void Promise.all([
      roomsRequest,
      bookingsService.list({ signal: controller.signal }),
    ])
      .then(([rooms, bookingPage]) => {
        if (controller.signal.aborted) return;

        setAvailability({
          status: "succeeded",
          rooms,
          bookings: bookingPage.data,
        });
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setAvailability({
          status: "failed",
          rooms: [],
          bookings: [],
        });
      });

    return () => controller.abort();
  }, [retry, roomId]);

  const createSearch = (
    nextStay: Pick<Search, "checkIn" | "checkOut">,
  ): Search => ({
    ...nextStay,
    guests,
    ...(roomId ? { roomId } : {}),
    ...(locationId ? { locationId } : {}),
  });

  const countAvailable = (
    nextStay: Pick<Search, "checkIn" | "checkOut">,
  ) => {
    const search = createSearch(nextStay);

    if (!validSearch(search) || availability.status !== "succeeded") {
      return null;
    }

    return countAvailableRooms(
      availability.rooms,
      search,
      availability.bookings,
    );
  };

  const getDateStatus = (date: string): CalendarDateStatus | null => {
    const count = countAvailable({
      checkIn: date,
      checkOut: checkoutAfter(date, 1),
    });

    if (count === null) return null;
    if (count === 0) {
      return {
        type: "unavailable",
        label: "Không còn phòng phù hợp cho ngày này",
      };
    }

    if (count <= 2) {
      return {
        type: "limited",
        label: `Còn ${count} phòng phù hợp`,
      };
    }

    return {
      type: "available",
      label: `Còn ${count} phòng phù hợp`,
    };
  };

  const selectedAvailability = countAvailable(stay);
  const selectedAvailabilityMessage =
    selectedAvailability === null
      ? "Chọn ngày để xem số phòng còn lại."
      : selectedAvailability === 0
        ? "Không còn phòng phù hợp cho khoảng ngày và số khách đã chọn."
        : `Có ${selectedAvailability} phòng phù hợp cho khoảng ngày đã chọn.`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = createSearch(stay);

    if (!validSearch(search)) {
      setError(
        "Chọn ngày nhận phòng từ hôm nay, ngày trả sau ngày nhận và ít nhất 1 khách.",
      );
      return;
    }

    if (availability.status !== "succeeded") {
      setError("Đang tải lịch phòng. Vui lòng chờ hoặc thử lại.");
      return;
    }

    if (
      countAvailableRooms(availability.rooms, search, availability.bookings) ===
      0
    ) {
      setError(
        "Không còn phòng phù hợp. Vui lòng chọn khoảng ngày hoặc số khách khác.",
      );
      return;
    }

    try {
      sessionStorage.setItem(flowKeys.search, JSON.stringify(search));
      sessionStorage.removeItem(flowKeys.draft);
    } catch {
      setError(
        "Không thể lưu thông tin tìm kiếm. Vui lòng cho phép lưu trữ trên trình duyệt rồi thử lại.",
      );
      return;
    }

    router.push(routes.reservation.selectRoom);
  };

  const handleStayChange = (value: Pick<Search, "checkIn" | "checkOut">) => {
    setStay(value);
    setError("");
  };

  const handleRetry = () => {
    setAvailability(initialAvailability);
    setRetry((value) => value + 1);
  };

  return (
    <section className="content reservation-main">
      <div className="container">
        <ReservationProgress active={1} />
        {roomId && (
          <p className="text-center mar-bottom-30">
            Kiểm tra ngày trống cho phòng đã chọn (mã #{roomId}).
          </p>
        )}

        <form className="banner-form form-style-1" onSubmit={handleSubmit}>
          <div className="form-content">
            <StayDateFields
              idPrefix="reservation"
              value={stay}
              onChange={handleStayChange}
              showNights={false}
            />
            <div className="table-item">
              <div className="form-group">
                <label htmlFor="reservation-guests">Số khách</label>
                <input
                  id="reservation-guests"
                  className="form-control"
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(event) => {
                    setGuests(Number(event.target.value));
                    setError("");
                  }}
                  required
                />
              </div>
            </div>
            <div className="table-item">
              <div className="form-group">
                <label htmlFor="reservation-nights">Số đêm</label>
                <input
                  id="reservation-nights"
                  className="form-control"
                  value={Math.max(0, nights(stay)) || ""}
                  placeholder="Số đêm"
                  readOnly
                />
              </div>
            </div>
            <div className="table-item">
              <div className="form-btn mar-top-35">
                <button
                  type="submit"
                  className="btn btn-orange"
                  disabled={availability.status !== "succeeded"}
                >
                  {availability.status === "loading"
                    ? "Đang tải lịch..."
                    : "Kiểm tra phòng trống"}
                </button>
              </div>
            </div>
          </div>
          {error && <p role="alert" className="text-danger">{error}</p>}
        </form>

        <section className={styles.availabilityOverview} aria-live="polite">
          <div className={styles.availabilityOverviewHeader}>
            <div>
              <h2>Tình trạng phòng theo ngày</h2>
              <p>
                Lịch chỉ hiển thị số phòng phù hợp còn lại, không hiển thị thông tin cá nhân của khách đã đặt.
              </p>
            </div>
            <i className="fa fa-calendar-check-o" aria-hidden="true" />
          </div>
          {availability.status === "loading" && (
            <p className={styles.availabilityLoading}>Đang cập nhật lịch phòng...</p>
          )}
          {availability.status === "failed" && (
            <div className={styles.availabilityFailure} role="alert">
              <p>Chưa tải được dữ liệu phòng. Vui lòng thử lại.</p>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleRetry}
              >
                Tải lại lịch
              </button>
            </div>
          )}
          {availability.status === "succeeded" && (
            <>
              <div className={styles.availabilityOverviewLegend}>
                <span><i className={styles.legendAvailable} />Còn nhiều phòng</span>
                <span><i className={styles.legendLimited} />Còn ít phòng</span>
                <span><i className={styles.legendUnavailable} />Hết phòng phù hợp</span>
              </div>
              <p
                className={`${styles.availabilityOverviewMessage} ${selectedAvailability && selectedAvailability > 0 ? styles.availabilityOverviewAvailable : styles.availabilityOverviewUnavailable}`}
              >
                <i
                  className={`fa ${selectedAvailability && selectedAvailability > 0 ? "fa-check-circle" : "fa-info-circle"}`}
                  aria-hidden="true"
                />
                {selectedAvailabilityMessage}
              </p>
              <DateRangeCalendar
                value={stay}
                onChange={handleStayChange}
                isDateUnavailable={(date) =>
                  getDateStatus(date)?.type === "unavailable"
                }
                isStayUnavailable={(nextStay) => countAvailable(nextStay) === 0}
                getDateStatus={getDateStatus}
              />
            </>
          )}
        </section>
      </div>
    </section>
  );
}
