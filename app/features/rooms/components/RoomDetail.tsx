"use client";

/* eslint-disable @next/next/no-img-element -- this component intentionally preserves the static theme's image markup. */
import Link from "next/link";
import { useEffect } from "react";
import { routes } from "@/config/routes";
import {
  initializeHotuxRoomDetail,
  legacyScriptBundles,
  loadLegacyScripts,
} from "@/lib/legacy/scripts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Room } from "../rooms.types";
import { roomsThunks } from "../rooms.thunks";

const DETAIL_IMAGES = Array.from(
  { length: 9 },
  (_, index) => `/assets/images/detail-slider/slider${index + 1}.jpg`,
);

const OVERVIEW =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis varius ligula non tellus euismod fermentum. Nulla quis enim ut est dapibus luctus quis quis enim. Ut bibendum ultricies nisl ut aliquam. Ut in arcu id nunc elementum ultricies eu eget lacus nam at neque lorem.";

const STATIC_ROOM = {
  id: 1,
  tenPhong: "Luxury King Room",
  giaTien: 1200,
  moTa: OVERVIEW,
} as const satisfies Pick<Room, "id" | "tenPhong" | "giaTien" | "moTa">;

const AMENITIES = [
  ["fa-glass", "Private bar", true],
  ["fa-car", "Transport", true],
  ["fa-wifi", "Free wifi", true],
  ["fa-bath", "Laundry service", true],
  ["fa-cogs", "Quick service", false],
  ["fa-map-marker", "City map", false],
  ["fa-life-ring", "Swimming pool", false],
  ["fa-bolt", "Smoking free", false],
] as const;

const FEATURES = [
  ["feature1.jpg", "ficon1.png", "Fitness club"],
  ["feature2.jpg", "ficon2.png", "Private Beach"],
  ["feature3.jpg", "ficon3.png", "Bicycle Hire"],
  ["feature4.jpg", "ficon4.png", "Restaurant"],
] as const;

const RELATED_ROOMS = [
  ["room1.jpg", "Super Luxury", "$1000/Night", "col-md-6 col-sm-6 col-xs-6"],
  ["room2.jpg", "Junior Suite", "$500/Night", "col-md-6 col-sm-6 col-xs-6"],
  ["room3.jpg", "Executive Suite", "$8120/Night", "col-md-6 col-sm-6 col-xs-6"],
  ["room4.jpg", "Royal Suite", "$500/Night", "col-md-6 col-sm-6 col-xs-12"],
] as const;

function Stars() {
  return (
    <>
      <span className="fa fa-star checked" />
      <span className="fa fa-star checked" />
      <span className="fa fa-star checked" />
      <span className="fa fa-star checked" />
      <span className="fa fa-star checked" />
    </>
  );
}

function Review({ image, nested = false }: { image: string; nested?: boolean }) {
  return (
    <div className="review-item">
      <div className="review-image">
        <img src={`/assets/images/${image}`} alt="image" />
      </div>
      <div className="review-content">
        <h5>Micheal Clordy</h5>
        <a href="#"><i className="fa fa-reply" aria-hidden="true" /> Reply</a>
        <p className="date">November 10,2018 at 3:10 pm</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id iaculis arcu. Aenean non dolor magna. In sed consectetur nisi. Sed venenatis, nibh sit amet sodales ullamcorper, ipsum orci condimentum tortor, et cursus veli.tturpis at justo. Vivamus pellentesque{nested ? " volutpat urna vel eleifend." : " volutpat urna vel eleifend."}
        </p>
      </div>
    </div>
  );
}

export function RoomDetail({ id }: { id: number }) {
  const dispatch = useAppDispatch();
  const { selected, requests } = useAppSelector((state) => state.rooms);
  const hasApiRoom = requests.detail.status === "succeeded" && selected?.id === id;
  const room = hasApiRoom ? selected : STATIC_ROOM;
  const price = `$${room.giaTien}`;
  const overview = room.moTa || OVERVIEW;

  useEffect(() => {
    const task = dispatch(roomsThunks.detail(id));
    void loadLegacyScripts(legacyScriptBundles.hotuxRoomDetail).then(
      initializeHotuxRoomDetail,
    );
    return () => task.abort();
  }, [dispatch, id]);

  return (
    <>
      <section className="details">
        <div className="container">
          <div className="detail-slider">
            <div className="slider-1 slider-for">
              {DETAIL_IMAGES.map((image) => (
                <div className="detail-slider-item" key={`main-${image}`}>
                  <img src={image} alt="image" />
                </div>
              ))}
            </div>
            <div className="slider-1 slider-nav">
              {DETAIL_IMAGES.map((image) => (
                <div className="detail-slider-item" key={`nav-${image}`}>
                  <img src={image} alt="image" />
                </div>
              ))}
            </div>
          </div>
          <div className="detail-content">
            <div className="detail-title">
              <div className="title-left">
                <h3>{room.tenPhong}</h3>
                <div className="rating"><Stars /></div>
              </div>
              <div className="title-right pull-right">
                <ul>
                  <li className="facebook"><i className="fa fa-facebook" /></li>
                  <li className="twitter"><i className="fa fa-twitter" /></li>
                  <li className="linkedin"><i className="fa fa-linkedin" /></li>
                  <li className="pinterest"><i className="fa fa-pinterest" /></li>
                </ul>
                <div className="title-price">
                  <h3>{price}<span>/Night</span></h3>
                </div>
              </div>
            </div>
            <div className="detail-overview">
              <div className="row">
                <div className="col-lg-8">
                  <div className="overview-outer">
                    <div className="overview-content mar-bottom-30">
                      <h4>Overview</h4>
                      <p>{overview}</p>
                      <p className="mar-0">{overview}</p>
                    </div>
                    <div className="price-table">
                      <h4>Price and Rates(/Night)</h4>
                      <table className="table table-bordered mar-0">
                        <thead><tr>{["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"].map((day) => <td key={day}>{day}</td>)}</tr></thead>
                        <tbody><tr>{Array.from({ length: 7 }, (_, index) => <td key={index}>{price}</td>)}</tr></tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="overwiew-map"><div id="map" style={{ height: "357px", width: "100%" }} /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="check-in">
        <div className="container">
          <div className="form-content">
            <div className="table-item"><div className="form-group"><div className="date-range-inner-wrapper"><input id="date-range2" className="form-control" defaultValue="Check In" /><span className="input-group-addon"><i className="fa fa-calendar" aria-hidden="true" /></span></div></div></div>
            <div className="table-item"><div className="form-group"><div className="date-range-inner-wrapper"><input id="date-range3" className="form-control" defaultValue="Check In" /><span className="input-group-addon"><i className="fa fa-calendar" aria-hidden="true" /></span></div></div></div>
            <div className="table-item"><div className="form-group form-icon"><select className="wide" defaultValue="0"><option value="0">Type</option><option value="1">0</option><option value="2">1</option><option value="3">2</option><option value="4">3</option><option value="5">4</option></select></div></div>
            <div className="table-item"><div className="form-group form-icon"><select className="wide" defaultValue="0"><option value="0">Destination</option><option value="1">0</option><option value="2">1</option><option value="3">2</option><option value="4">3</option><option value="5">4</option></select></div></div>
            <div className="table-item"><div className="form-btn"><a className="btn btn-orange">Check Availability</a></div></div>
          </div>
        </div>
      </section>

      <section className="amenities">
        <div className="container">
          <div className="section-title"><h3>Explore <span>Amenities</span></h3></div>
          <div className="amenities-content"><div className="row">
            {AMENITIES.map(([icon, label, margin]) => (
              <div className="col-lg-3 col-md-6" key={label}><div className={`amt-item${margin ? " mar-bottom-30" : ""}`}><div className="amt-icon"><i className={`fa ${icon}`} aria-hidden="true" /></div><h4>{label}</h4></div></div>
            ))}
          </div></div>
        </div>
      </section>

      <section className="detail-features">
        <div className="row">
          {FEATURES.map(([image, icon, label]) => (
            <div className="col-md-3 col-sm-6 col-xs-6" key={label}>
              <div className="feature-item"><div className="feature-image"><img src={`/assets/images/${image}`} alt="image" /></div><div className="feature-content"><img src={`/assets/images/icons/${icon}`} alt="image" /><h4><a href="#" className="white">{label}</a></h4></div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-reviews">
        <div className="container">
          <div className="section-title"><h2>Explore <span>Reviews</span></h2></div>
          <div className="review-outer">
            <ul>
              <li><Review image="review1.jpg" /><ul><li><Review image="review2.jpg" nested /></li></ul></li>
              <li><Review image="review3.jpg" /></li>
            </ul>
          </div>
          <div className="comment-box">
            <h4>Leave a message</h4>
            <form>
              <div className="row">
                <div className="form-group col-lg-3"><input type="text" className="form-control" id="fname" placeholder="First Name" /></div>
                <div className="form-group col-lg-3"><input type="text" className="form-control" id="lname" placeholder="Last Name" /></div>
                <div className="form-group col-lg-3"><input type="email" className="form-control" id="email" placeholder="Email" /></div>
                <div className="form-group col-lg-3"><input type="text" className="form-control" id="number" placeholder="Phone" /></div>
              </div>
              <div className="comment-btn text-center"><a href="#" className="btn btn-orange">Submit</a></div>
            </form>
          </div>
        </div>
      </section>

      <section className="related-rooms">
        <div className="container">
          <div className="section-title"><h2>Explore <span>Rooms</span></h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex neque, sodales accumsan sapien et, auctor vulputate quam donec vitae consectetur turpis</p></div>
          <div className="room-outer"><div className="row team-slider">
            {RELATED_ROOMS.map(([image, name, relatedPrice, serviceClass], index) => (
              <div className="col-md-4" key={name}>
                <div className="room-item"><div className="room-image"><img src={`/assets/images/${image}`} alt="image" /></div><div className="room-content">
                  <div className="room-title"><h4>{name}</h4><p><i className="fa fa-tag" /> {relatedPrice}</p><div className="deal-rating"><Stars /></div></div>
                  <div className="room-services mar-bottom-15"><div className="row"><div className={serviceClass}><i className="fa fa-bed" aria-hidden="true" /> 3 Bedrooms</div><div className={serviceClass}><i className="fa fa-wifi" aria-hidden="true" /> Quick Service</div></div></div>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum orci nulla, fermentum in faucibus a, interdum eu nibh.</p>
                  <div className="room-btns"><Link href={routes.rooms.detail(index + 1)} className="btn btn-black mar-right-10">VIEW DETAILS</Link><Link href={routes.reservation.availability} className="btn btn-orange">BOOK NOW</Link></div>
                </div></div>
              </div>
            ))}
          </div></div>
        </div>
      </section>
    </>
  );
}
