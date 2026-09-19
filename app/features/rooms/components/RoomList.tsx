"use client";

/* eslint-disable @next/next/no-img-element -- this component intentionally preserves the static theme's image markup. */
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { routes } from "@/config/routes";
import { legacyScriptBundles, loadLegacyScripts } from "@/lib/legacy/scripts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Room } from "../rooms.types";
import { roomsThunks } from "../rooms.thunks";

const PAGE_SIZE = 5;
const STATIC_IMAGES = [
  "/assets/images/room-list/grid1.jpg",
  "/assets/images/room-list/grid2.jpg",
  "/assets/images/room-list/grid3.jpg",
  "/assets/images/room-list/grid4.jpg",
  "/assets/images/room-list/grid5.jpg",
] as const;

const ROOM_TYPES = [
  "Single Rooms",
  "Double Rooms",
  "Studio Rooms",
  "Kingsize Rooms",
  "Presidentsuite Rooms",
  "Murphy Rooms",
  "Connecting Rooms",
] as const;

const SERVICES = [
  "24/7 Reception",
  "Parking",
  "Bar",
  "Restaurant",
  "Satellite Television",
  "Lift/ELevator",
  "Luggage Storage",
] as const;

type RoomListCard = Pick<
  Room,
  "id" | "tenPhong" | "giaTien" | "moTa" | "phongNgu"
>;

const STATIC_ROOMS = [
  {
    id: 1,
    tenPhong: "Standard Suite",
    giaTien: 900,
    phongNgu: 3,
    moTa: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex neque, sodales accumsan sapien et, auctor vulputate quam donec vitae consectetur turpis",
  },
  {
    id: 2,
    tenPhong: "Deluxe Suite",
    giaTien: 800,
    phongNgu: 3,
    moTa: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex neque, sodales accumsan sapien et, auctor vulputate quam donec vitae consectetur turpis",
  },
  {
    id: 3,
    tenPhong: "Superior Suite",
    giaTien: 1000,
    phongNgu: 3,
    moTa: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex neque, sodales accumsan sapien et, auctor vulputate quam donec vitae consectetur turpis",
  },
  {
    id: 4,
    tenPhong: "Normal Suite",
    giaTien: 200,
    phongNgu: 3,
    moTa: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex neque, sodales accumsan sapien et, auctor vulputate quam donec vitae consectetur turpis",
  },
  {
    id: 5,
    tenPhong: "Royal Suite",
    giaTien: 1200,
    phongNgu: 3,
    moTa: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex neque, sodales accumsan sapien et, auctor vulputate quam donec vitae consectetur turpis",
  },
] as const satisfies readonly RoomListCard[];

function visiblePages(page: number, count: number) {
  if (count <= 5) return Array.from({ length: count }, (_, index) => index + 1);
  const pages = [1, 2, 3, 4, count];
  return [...new Set(pages.filter((item) => item <= count))];
}

function StaticCheckbox({
  label,
  last = false,
}: {
  label: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`pretty p-default p-thick p-pulse${last ? "" : " mar-bottom-15"}`}
    >
      <input type="checkbox" />
      <div className="state p-warning-o">
        <label>{label}</label>
      </div>
    </div>
  );
}

function Rating({ stars }: { stars: number }) {
  return (
    <span className="rating">
      {Array.from({ length: stars }, (_, index) => (
        <span className="fa fa-star" key={index} />
      ))}
    </span>
  );
}

export function RoomList({ embedded = false }: { embedded?: boolean } = {}) {
  const dispatch = useAppDispatch();
  const state = useAppSelector((root) => root.rooms);
  const [page, setPage] = useState(1);
  const query = useMemo(
    () => ({ pageIndex: page, pageSize: PAGE_SIZE, keyword: "" }),
    [page],
  );
  const request = state.requests.list;
  const hasApiRooms = request.status === "succeeded" && state.items.length > 0;
  const rooms = hasApiRooms ? state.items : STATIC_ROOMS;
  const total = hasApiRooms ? state.total : 80;
  const pageCount = hasApiRooms
    ? Math.max(1, Math.ceil(total / PAGE_SIZE))
    : 10;
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, total);

  useEffect(() => {
    const task = dispatch(roomsThunks.list(query));
    return () => task.abort();
  }, [dispatch, query]);

  useEffect(() => {
    void loadLegacyScripts(legacyScriptBundles.hotuxRoomList);
  }, []);

  const roomListContent = (
        <div className="row flex-row-reverse">
          <div className="col-lg-9">
            <div className="list-results">
              <div className="list-results-sort pad-top-5">
                <p className="mar-0">
                  Showing {first}-{last} of {total} results
                </p>
              </div>
              <div className="click-menu">
                <select
                  className="wide"
                  defaultValue="0"
                  aria-label="Sort rooms"
                >
                  <option data-icon="fa fa-long-arrow-alt-up" value="0">
                    Price
                  </option>
                  <option data-icon="fa fa-user" value="1">
                    Name
                  </option>
                  <option data-icon="fa fa-star" value="2">
                    Rating
                  </option>
                </select>
                <div className="change-list f-active mar-right-10">
                  <Link href={routes.rooms.list} aria-label="List view">
                    <i className="fa fa-bars" />
                  </Link>
                </div>
                <div className="change-grid">
                  <Link href={routes.rooms.list} aria-label="Grid view">
                    <i className="fa fa-th" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="list-content">
              <div className="list-grid">
                {rooms.map((room, index) => (
                    <StaticRoomCard key={room.id} room={room} index={index} embedded={embedded} />
                ))}
              </div>
            </div>

            {total > 0 ? (
              <nav
                className="pagination-content text-center"
                aria-label="Room list pagination"
              >
                <ul className="pagination">
                  <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                    <a
                      href="#"
                      className="page-link"
                      onClick={(event) => {
                        event.preventDefault();
                        setPage(1);
                      }}
                      aria-label="First page"
                    >
                      <i
                        className="fa fa-angle-double-left"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                  {visiblePages(page, pageCount).map((item, index, items) => (
                    <Fragment key={item}>
                      {index === items.length - 1 &&
                      item - items[index - 1] > 1 ? (
                        <li className="page-item">
                          <a
                            href="#"
                            className="page-link"
                            onClick={(event) => event.preventDefault()}
                          >
                            ...
                          </a>
                        </li>
                      ) : null}
                      <li
                        className={`page-item${page === item ? " active" : ""}`}
                      >
                        <a
                          href="#"
                          className="page-link"
                          onClick={(event) => {
                            event.preventDefault();
                            setPage(item);
                          }}
                        >
                          {item}
                        </a>
                      </li>
                    </Fragment>
                  ))}
                  <li
                    className={`page-item${page === pageCount ? " disabled" : ""}`}
                  >
                    <a
                      href="#"
                      className="page-link"
                      onClick={(event) => {
                        event.preventDefault();
                        setPage(pageCount);
                      }}
                      aria-label="Last page"
                    >
                      <i
                        className="fa fa-angle-double-right"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                </ul>
              </nav>
            ) : null}
          </div>

          <div className="col-lg-3 sidebar">
            <div className="list-sidebar">
              <div className="room-type list-sidebar-item">
                <h4>Room Types</h4>
                {ROOM_TYPES.map((type, index) => (
                  <StaticCheckbox
                    key={type}
                    label={type}
                    last={index === ROOM_TYPES.length - 1}
                  />
                ))}
              </div>
              <div className="price list-sidebar-item">
                <h4>Price</h4>
                <div className="range-slider">
                  <div
                    data-min="0"
                    data-max="2000"
                    data-unit="$"
                    data-min-name="min_price"
                    data-max-name="max_price"
                    className="range-slider-ui ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all"
                    aria-disabled="false"
                  >
                    <span className="min-value">0 $</span>
                    <span className="max-value">2000 $</span>
                    <div
                      className="ui-slider-range ui-widget-header ui-corner-all full"
                      style={{ left: "0%", width: "100%" }}
                    />
                  </div>
                  <div className="clearfix" />
                </div>
              </div>
              <div className="ratings list-sidebar-item">
                <h4>Ratings</h4>
                {[5, 5, 3, 2, 1].map((stars, index, ratings) => (
                  <StaticCheckbox
                    key={`${stars}-${index}`}
                    label={<Rating stars={stars} />}
                    last={index === ratings.length - 1}
                  />
                ))}
              </div>
              <div className="services list-sidebar-item">
                <h4>Services</h4>
                {SERVICES.map((service, index) => (
                  <StaticCheckbox
                    key={service}
                    label={service}
                    last={index === SERVICES.length - 1}
                  />
                ))}
              </div>
              <div className="info-1 list-sidebar-item">
                <i className="fa fa-phone-volume" />
                <h5>Need help? Call us</h5>
                <a href="tel://004542344599" className="phone">
                  +45 423 445 99
                </a>
                <small>Monday to Friday 9.00am - 7.30pm</small>
              </div>
            </div>
          </div>
        </div>
  );

  return embedded ? (
    <div className="room-list mar-top-60">{roomListContent}</div>
  ) : (
    <section className="room-list"><div className="container">{roomListContent}</div></section>
  );
}

function StaticRoomCard({
  room,
  index,
  embedded,
}: {
  room: RoomListCard;
  index: number;
  embedded: boolean;
}) {
  const image = STATIC_IMAGES[index % STATIC_IMAGES.length];
  const stars = index === 3 ? 4 : 5;

  return (
    <div className="room-grid">
      <div className="grid-image">
        <img src={image} alt="image" />
      </div>
      <div className="grid-content">
        <div className="room-title">
          <h4>{room.tenPhong}</h4>
          <p className="mar-top-5">
            <i className="fa fa-tag" /> ${room.giaTien}/Night
          </p>
          <div className="deal-rating">
            {Array.from({ length: stars }, (_, star) => (
              <span className="fa fa-star checked" key={star} />
            ))}
          </div>
        </div>
        <div className="room-detail">
          <p>
            {room.moTa ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex neque, sodales accumsan sapien et, auctor vulputate quam donec vitae consectetur turpis"}
          </p>
        </div>
        <div className="room-services">
          <div className="row">
            <div className={embedded ? "col-md-4 col-sm-6 col-xs-6" : "col-md-6 col-sm-6 col-xs-6"}>
              <i className="fa fa-bed" aria-hidden="true" /> {room.phongNgu}{" "}
              Bedrooms
            </div>
            <div className={embedded ? "col-md-4 col-sm-6 col-xs-6" : "col-md-6 col-sm-6 col-xs-6"}>
              <i className="fa fa-wifi" aria-hidden="true" /> Quick Service
            </div>
          </div>
        </div>
        <div className="grid-btn mar-top-20">
          <Link
            href={routes.rooms.detail(room.id)}
            className="btn btn-black mar-right-10"
          >
            VIEW DETAILS
          </Link>
          <Link href={routes.reservation.availability} className="btn btn-orange">
            BOOK NOW
          </Link>
        </div>
      </div>
    </div>
  );
}
