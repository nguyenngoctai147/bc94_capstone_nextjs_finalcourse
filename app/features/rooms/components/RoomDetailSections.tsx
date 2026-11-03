"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEventHandler } from "react";
import { ApiImage } from "@/components/ui/ApiImage";
import CardRoom from "@/components/ui/CardRoom";
import { Pagination } from "@/components/ui/Pagination";
import { routes } from "@/config/routes";
import type { Location } from "@/features/locations/locations.types";
import type { RoomReview } from "@/features/reviews/reviews.types";
import { StayDateFields } from "@/features/reservations/components/StayDateFields";
import { roomAmenities } from "../room-amenities";
import { RoomAmenityIcon } from "./RoomAmenityIcon";
import type { Room } from "../rooms.types";
import { withStaySearch, type Search } from "@/features/reservations/flow";
import styles from "@/css/features/rooms/room-detail.module.css";

export type RoomDetailTab =
  | "overview"
  | "price"
  | "places"
  | "location"
  | "reviews";
export type ReviewFormValue = { stars: string; content: string };

const tabs: readonly { key: RoomDetailTab; label: string }[] = [
  { key: "overview", label: "Tổng quan" },
  { key: "price", label: "Giá phòng" },
  { key: "places", label: "Xung quanh" },
  { key: "location", label: "Vị trí" },
  { key: "reviews", label: "Đánh giá" },
];

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(date);
};

const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, index) => (
    <i
      key={index}
      className={`fa fa-star ${index < Math.round(rating) ? "checked" : ""}`}
      aria-hidden="true"
    />
  ));

export function RoomDetailGallery({ room }: { room: Room }) {
  return (
    <div className="detail-slider">
      <div className="slider-1 slider-for">
        <div className={`detail-slider-item ${styles.mainImage}`}>
          <ApiImage
            src={room.hinhAnh}
            width={1200}
            height={760}
            sizes="(max-width: 991px) 100vw, 66vw"
            alt={`Phòng ${room.tenPhong}`}
            preload
            fallback={
              <div className={styles.imageFallback}>
                Chỗ nghỉ chưa cập nhật ảnh phòng
              </div>
            }
          />
        </div>
      </div>
      <div
        className={`slider-1 slider-nav ${styles.thumbnailList}`}
        aria-label="Ảnh thu nhỏ"
      >
        <div className={`detail-slider-item ${styles.thumbnail}`}>
          <ApiImage
            src={room.hinhAnh}
            width={240}
            height={150}
            alt={`Ảnh thu nhỏ của ${room.tenPhong}`}
            fallback={<div className="bg-light p-4" />}
          />
        </div>
      </div>
    </div>
  );
}

export function RoomDetailHeading({
  room,
  rating,
  reviewCount,
}: {
  room: Room;
  rating: number | null;
  reviewCount: number;
}) {
  return (
    <div className={`detail-title ${styles.titleRow}`}>
      <div className="title-left">
        <h1 className="h3">{room.tenPhong}</h1>
        <div
          className={`rating ${styles.ratingLine}`}
          aria-label={
            rating ? `${rating.toFixed(1)} trên 5 sao` : "Chưa có đánh giá"
          }
        >
          {rating ? (
            <>
              {renderStars(rating)}
              <span className="ms-2">
                {rating.toFixed(1)} · {reviewCount} đánh giá
              </span>
            </>
          ) : (
            <span>Chưa có đánh giá</span>
          )}
        </div>
      </div>
      <div className="title-right pull-right">
        <div className="title-price">
          <h3>
            ${room.giaTien.toLocaleString("vi-VN")}
            <span>/Đêm</span>
          </h3>
        </div>
      </div>
    </div>
  );
}

function OverviewPanel({ room }: { room: Room }) {
  const amenities = roomAmenities.filter(({ key }) => room[key]);
  return (
    <div className={`detail-overview detail-box ${styles.detailBox}`}>
      <h2 className="h4">Tổng quan và tiện nghi</h2>
      <p style={{ whiteSpace: "pre-line" }}>
        {room.moTa || "Chỗ nghỉ chưa cập nhật mô tả chi tiết."}
      </p>
      <div className={styles.facts}>
        <p>
          <i className="fa fa-users me-2" aria-hidden="true" />
          Tối đa {room.khach} khách
        </p>
        <p>
          <i className="fa fa-bed me-2" aria-hidden="true" />
          {room.phongNgu} phòng ngủ · {room.giuong} giường
        </p>
        <p>
          <i className="fa fa-tint me-2" aria-hidden="true" />
          {room.phongTam} phòng tắm
        </p>
        <p>
          <i className="fa fa-map-marker me-2" aria-hidden="true" />
          Mã vị trí #{room.maViTri}
        </p>
      </div>
      {amenities.length > 0 ? (
        <ul className={`amenities ${styles.amenities}`}>
          {amenities.map(({ key, label }) => (
            <li key={key}>
              <RoomAmenityIcon amenity={key} /> {label}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">
          Chỗ nghỉ chưa cập nhật danh sách tiện nghi.
        </p>
      )}
    </div>
  );
}

function PricePanel({ price }: { price: number }) {
  const days = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  return (
    <div className={`price-table detail-box ${styles.detailBox}`}>
      <h2 className="h4">Giá phòng theo đêm</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              {days.map((day) => (
                <td key={day}>{day}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {days.map((day) => (
                <td key={day}>${price.toLocaleString("vi-VN")}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-muted">
        Giá hiển thị là giá niêm yết cho một phòng trong một đêm.
      </p>
    </div>
  );
}

function PlacesPanel({
  rooms,
  search,
}: {
  rooms: Room[];
  search?: Search | null;
}) {
  return (
    <div className={`detail-places detail-box ${styles.detailBox}`}>
      <h2 className="h4">Các lựa chọn tại cùng khu vực</h2>
      {rooms.length > 0 ? (
        <div className="service-outer">
          <div className="row">
            {rooms.map((room) => (
              <div className="col-md-4 col-sm-6 mar-bottom-20" key={room.id}>
                <article className="service-item">
                  <div className={`service-image ${styles.placeImage}`}>
                    <ApiImage
                      src={room.hinhAnh}
                      width={420}
                      height={280}
                      sizes="(max-width: 767px) 100vw, 33vw"
                      alt={room.tenPhong}
                      fallback={
                        <div className={styles.imageFallback}>Chưa có ảnh</div>
                      }
                    />
                  </div>
                  <div className="service-content">
                    <h3 className={styles.placeTitle}>
                      <Link
                        href={withStaySearch(
                          routes.rooms.detail(room.id),
                          search,
                        )}
                      >
                        {room.tenPhong}
                      </Link>
                    </h3>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Hiện chưa có phòng khác tại cùng vị trí.</p>
      )}
    </div>
  );
}

function LocationPanel({
  location,
  room,
}: {
  location: Location | null;
  room: Room;
}) {
  return (
    <div className={`detail-map detail-box ${styles.detailBox}`}>
      <div className="detail-location">
        <h2 className="h4">Vị trí chỗ nghỉ</h2>
        <div className={styles.locationGrid}>
          <div className={styles.locationItem}>
            <i className="fa fa-map-marker" aria-hidden="true" />
            <p>
              {location
                ? `${location.tenViTri}, ${location.tinhThanh}`
                : `Vị trí #${room.maViTri}`}
            </p>
          </div>
          <div className={styles.locationItem}>
            <i className="fa fa-globe" aria-hidden="true" />
            <p>{location?.quocGia || "Chưa cập nhật quốc gia"}</p>
          </div>
          <div className={styles.locationItem}>
            <i className="fa fa-info" aria-hidden="true" />
            <p>Liên hệ chỗ nghỉ sau khi đặt phòng được xác nhận.</p>
          </div>
        </div>
      </div>
      <div className={styles.locationVisual}>
        <ApiImage
          src={location?.hinhAnh}
          width={1000}
          height={440}
          sizes="(max-width: 991px) 100vw, 66vw"
          alt={location ? `Khu vực ${location.tenViTri}` : "Khu vực chỗ nghỉ"}
          fallback={
            <div className={styles.imageFallback}>Chưa có ảnh khu vực</div>
          }
        />
        <p className={styles.locationCaption}>
          API hiện chưa cung cấp tọa độ, vì vậy trang hiển thị thông tin và ảnh
          khu vực thay cho bản đồ.
        </p>
      </div>
    </div>
  );
}

function ReviewsPanel({
  reviews,
  page,
  form,
  error,
  success,
  submitting,
  signedIn,
  onPageChange,
  onFormChange,
  onSubmit,
}: {
  reviews: RoomReview[];
  page: number;
  form: ReviewFormValue;
  error: string;
  success: string;
  submitting: boolean;
  signedIn: boolean;
  onPageChange: (page: number) => void;
  onFormChange: (value: ReviewFormValue) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(reviews.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visibleReviews = reviews.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className={`detail-review ${styles.detailBox}`}>
      <h2 className="h4">Đánh giá ({reviews.length})</h2>
      <div className="review-outer">
        {reviews.length > 0 ? (
          <ul>
            {visibleReviews.map((review) => (
              <li key={review.id}>
                <article className="review-item">
                  <div className="review-image">
                    <ApiImage
                      src={review.avatar}
                      width={82}
                      height={82}
                      alt={review.tenNguoiBinhLuan}
                      className={styles.reviewAvatar}
                      fallback={
                        <div className={styles.reviewAvatarFallback}>
                          <i className="fa fa-user" aria-hidden="true" />
                        </div>
                      }
                    />
                  </div>
                  <div className="review-content">
                    <h3 className="h5">{review.tenNguoiBinhLuan}</h3>
                    <div
                      className={styles.reviewRating}
                      aria-label={`${review.saoBinhLuan} trên 5 sao`}
                    >
                      {renderStars(review.saoBinhLuan)}
                    </div>
                    <p className={`date ${styles.reviewDate}`}>
                      {formatDate(review.ngayBinhLuan)}
                    </p>
                    <p>{review.noiDung}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p>Phòng này chưa có đánh giá.</p>
        )}
        {reviews.length > pageSize && (
          <div className="d-flex justify-content-center mar-bottom-30">
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={reviews.length}
              onChange={onPageChange}
            />
          </div>
        )}
      </div>
      <div className={`comment-box ${styles.reviewForm}`}>
        <h2 className="h4">Để lại đánh giá</h2>
        {!signedIn && (
          <p>
            Bạn cần <Link href={routes.auth.login}>đăng nhập</Link> để gửi đánh
            giá.
          </p>
        )}
        <form onSubmit={onSubmit} noValidate>
          <div className="row">
            <div className="form-group col-md-4">
              <label htmlFor="review-stars">Số sao</label>
              <select
                id="review-stars"
                name="stars"
                className="form-select"
                value={form.stars}
                onChange={(event) =>
                  onFormChange({ ...form, stars: event.target.value })
                }
              >
                {[5, 4, 3, 2, 1].map((star) => (
                  <option value={star} key={star}>
                    {star} sao
                  </option>
                ))}
              </select>
            </div>
            <div className="textarea col-12">
              <label htmlFor="review-content">Nội dung</label>
              <textarea
                id="review-content"
                name="content"
                className="form-control"
                rows={5}
                value={form.content}
                placeholder="Chia sẻ trải nghiệm của bạn"
                onChange={(event) =>
                  onFormChange({ ...form, content: event.target.value })
                }
              />
            </div>
            {error && (
              <div className="col-12">
                <p className="alert alert-danger" role="alert">
                  {error}
                </p>
              </div>
            )}
            {success && (
              <div className="col-12">
                <p className="alert alert-success" role="status">
                  {success}
                </p>
              </div>
            )}
            <div className="col-12">
              <div className="comment-btn">
                <button
                  type="submit"
                  className="btn btn-orange"
                  disabled={submitting || !signedIn}
                >
                  {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function RoomDetailTabs({
  tab,
  room,
  reviews,
  related,
  location,
  search,
  reviewForm,
  reviewError,
  reviewSuccess,
  reviewSubmitting,
  reviewPage,
  signedIn,
  onTabChange,
  onReviewFormChange,
  onReviewPageChange,
  onReviewSubmit,
}: {
  tab: RoomDetailTab;
  room: Room;
  reviews: RoomReview[];
  related: Room[];
  location: Location | null;
  search?: Search | null;
  reviewForm: ReviewFormValue;
  reviewError: string;
  reviewSuccess: string;
  reviewSubmitting: boolean;
  reviewPage: number;
  signedIn: boolean;
  onTabChange: (tab: RoomDetailTab) => void;
  onReviewFormChange: (value: ReviewFormValue) => void;
  onReviewPageChange: (page: number) => void;
  onReviewSubmit: FormEventHandler<HTMLFormElement>;
}) {
  return (
    <div id="room-detail-tabs">
      <ul className={`nav nav-pills ${styles.tabList}`} role="tablist">
        {tabs.map(({ key, label }) => (
          <li className="nav-item" role="presentation" key={key}>
            <button
              id={`room-tab-${key}`}
              type="button"
              role="tab"
              aria-controls={`room-panel-${key}`}
              aria-selected={tab === key}
              className={`nav-link ${styles.tabButton} ${tab === key ? "active" : ""}`}
              onClick={() => onTabChange(key)}
            >
              {label}
              {key === "reviews" ? ` (${reviews.length})` : ""}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content clearfix">
        <div
          id={`room-panel-${tab}`}
          className="tab-pane fade show active"
          role="tabpanel"
          aria-labelledby={`room-tab-${tab}`}
          tabIndex={0}
        >
          {tab === "overview" && <OverviewPanel room={room} />}
          {tab === "price" && <PricePanel price={room.giaTien} />}
          {tab === "places" && <PlacesPanel rooms={related} search={search} />}
          {tab === "location" && (
            <LocationPanel location={location} room={room} />
          )}
          {tab === "reviews" && (
            <ReviewsPanel
              reviews={reviews}
              page={reviewPage}
              form={reviewForm}
              error={reviewError}
              success={reviewSuccess}
              submitting={reviewSubmitting}
              signedIn={signedIn}
              onPageChange={onReviewPageChange}
              onFormChange={onReviewFormChange}
              onSubmit={onReviewSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function RoomBookingSidebar({
  room,
  featuredRoom,
  stay,
  guests,
  error,
  onStayChange,
  onGuestsChange,
  onSubmit,
}: {
  room: Room;
  featuredRoom: Room | null;
  stay: Pick<Search, "checkIn" | "checkOut">;
  guests: number;
  error: string;
  onStayChange: (stay: Pick<Search, "checkIn" | "checkOut">) => void;
  onGuestsChange: (guests: number) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  return (
    <div className={`detail-sidebar ${styles.sidebar}`}>
      <div
        className={`sidebar-form reservation-form ${styles.reservationForm}`}
      >
        <div className="form-price">
          <Image
            className={styles.priceIcon}
            src="/assets/images/icons/bed-orange.png"
            width={58}
            height={58}
            alt=""
          />
          <div className="title-price">
            <h2>
              ${room.giaTien.toLocaleString("vi-VN")}
              <span>/Đêm</span>
            </h2>
          </div>
        </div>
        <form className="banner-form form-style-2" onSubmit={onSubmit}>
          <div className="form-content">
            <div className={`form-content-inner ${styles.sidebarFormContent}`}>
              <StayDateFields
                idPrefix="room-detail"
                value={stay}
                onChange={onStayChange}
              />
              <div className="table-item">
                <div className="form-group form-icon">
                  <label htmlFor="room-detail-guests">Số khách</label>
                  <select
                    id="room-detail-guests"
                    className="form-select wide"
                    value={guests}
                    onChange={(event) =>
                      onGuestsChange(Number(event.target.value))
                    }
                  >
                    {Array.from(
                      { length: room.khach },
                      (_, index) => index + 1,
                    ).map((count) => (
                      <option value={count} key={count}>
                        {count} khách
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {error && (
                <div className="table-item">
                  <p className="text-danger" role="alert">
                    {error}
                  </p>
                </div>
              )}
              <div className="table-item">
                <div className="form-btn">
                  <button type="submit" className="btn btn-orange w-100">
                    Đặt phòng ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="sidebar-support">
        <h3>Hỗ trợ và tư vấn</h3>
        <p>Kiểm tra đúng ngày lưu trú và số khách trước khi tiếp tục.</p>
        <p>
          <i className="fa fa-phone" aria-hidden="true" /> 1900 1234
        </p>
      </div>
      {featuredRoom && (
        <Link
          className="sidebar-room d-block"
          href={routes.rooms.detail(featuredRoom.id)}
        >
          <div className="sr-image">
            <ApiImage
              src={featuredRoom.hinhAnh}
              width={520}
              height={420}
              sizes="(max-width: 991px) 100vw, 33vw"
              alt={featuredRoom.tenPhong}
              className={styles.sidebarRoomImage}
              fallback={<div className={styles.imageFallback}>Chưa có ảnh</div>}
            />
          </div>
          <div className="room-title sr-content">
            <h3>{featuredRoom.tenPhong}</h3>
            <p>${featuredRoom.giaTien.toLocaleString("vi-VN")}/Đêm</p>
          </div>
        </Link>
      )}
    </div>
  );
}

export function RelatedRooms({
  rooms,
  search,
}: {
  rooms: Room[];
  search?: Search | null;
}) {
  if (rooms.length === 0) return null;

  const renderRelatedRooms = () =>
    rooms.map((room) => (
      <div className="col-lg-4 col-md-6 mar-bottom-30 d-flex" key={room.id}>
        <CardRoom room={room} search={search} />
      </div>
    ));

  return (
    <section className="related-rooms">
      <div className="container">
        <div className="section-title">
          <h2>
            Khám phá <span>phòng khác</span>
          </h2>
          <p>Những lựa chọn khác tại cùng điểm đến.</p>
        </div>
        <div className="room-outer">
          <div className="row team-slider">{renderRelatedRooms()}</div>
        </div>
        <div className="section-btn pad-top-30">
          <Link href={routes.rooms.list} className="btn btn-black">
            Khám phá tất cả phòng
          </Link>
        </div>
      </div>
    </section>
  );
}
