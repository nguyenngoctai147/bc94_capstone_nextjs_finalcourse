"use client";

/* eslint-disable @next/next/no-img-element -- static Hotux confirmation markup. */
import { ReservationProgress } from "./AvailabilityPage";

const services = [
  ["fa-bed", "3 Bedrooms"],
  ["fa-wifi", "Wifi"],
  ["fa-bed", "Television"],
  ["fa-wifi", "Hot Water"],
  ["fa-bed", "Dinner"],
  ["fa-wifi", "AC"],
  ["fa-bed", "Airport Taxi"],
  ["fa-wifi", "Quick Service"],
] as const;

function Stars() {
  return <div className="rating"><span className="fa fa-star checked" /><span className="fa fa-star checked" /><span className="fa fa-star checked" /><span className="fa fa-star checked" /><span className="fa fa-star checked" /></div>;
}

export function ConfirmationPage() {
  return (
    <section className="content">
      <div className="container">
        <ReservationProgress active={4} />

        <div className="success-notify">
          <div className="success-icon"><i className="fa fa-check" /></div>
          <div className="success-content">
            <h4 className="white mar-bottom-5">Payment Confirmed</h4>
            <p className="white mar-0">Thank you, your payment has been successful and your booking is now confirmed.A confirmation email has been sent to cyclone.themes@gmail.com.</p>
          </div>
          <div className="cancel-icon"><i className="fa fa-times" /></div>
        </div>

        <div className="confirmation booking-content mar-top-60">
          <div className="row">
            <div className="col-lg-8">
              <div className="confirmation-content">
                <div className="booking-image">
                  <img src="/assets/images/detail-slider/slider1.jpg" alt="image" />
                  <div className="booking-title">
                    <div className="title-left"><h3>Luxury King Room</h3><Stars /></div>
                    <div className="title-right pull-right"><div className="title-price"><h4 className="pad-top-15"><a href="#">$1200<span>/Night</span></a></h4></div></div>
                  </div>
                </div>

                <div className="other-details detail-table mar-top-50">
                  <h4 className="mar-bottom-30">Order Details</h4>
                  <table className="table"><tbody>
                    <tr><td>Booking id:</td><td>289-569-215</td></tr>
                    <tr><td>First Name:</td><td>Cyclone</td></tr>
                    <tr><td>Last Name:</td><td>Themes</td></tr>
                    <tr><td>DOB:</td><td>March 08, 1989</td></tr>
                    <tr><td>Country:</td><td>Nepal</td></tr>
                    <tr><td>Email:</td><td>cyclone.themes@gmail.com</td></tr>
                    <tr><td>Phone</td><td>977 - 222 - 444 - 666</td></tr>
                    <tr><td>Zip Code</td><td>44600</td></tr>
                    <tr><td>Address:</td><td>445 Mount Eden Road, Basundhara, Chakrapath</td></tr>
                  </tbody></table>
                </div>

                <div className="extra-services mar-top-50">
                  <h4 className="mar-bottom-30">Add Extra Services</h4>
                  <ul>{services.map(([icon, label]) => <li key={label}><i className={`fa ${icon}`} aria-hidden="true" /> {label}</li>)}</ul>
                </div>
                <div className="payment mar-top-50"><h4 className="mar-bottom-30">Payment</h4><div className="payment-desc"><p>Payment is done via Paypal</p></div></div>
                <div className="payment mar-top-50"><h4 className="mar-bottom-30">View Booking Details</h4><div className="payment-desc"><p>https://www.hotelhotux.com.np/bookingdetails/saurav</p></div></div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="detail-sidebar">
                <div className="sidebar-reservation">
                  <h4 className="text-capitalize">Your reservation</h4>
                  <div className="reservation-detail">
                    <div className="rd-top"><div className="rd-box"><label>Check in</label><p className="bold">04</p><p>August, 2019<br />Monday</p></div><div className="rd-box"><label>Check out</label><p className="bold">13</p><p>August, 2019<br />Wednesday</p></div></div>
                    <div className="rd-top"><div className="rd-box"><p className="bold">03</p><p>Guest</p></div><div className="rd-box"><p className="bold">10</p><p>Night</p></div></div>
                  </div>
                  <table className="reservation-table table"><tbody><tr><td>1 Room x 10 Nights</td><td>$12000</td></tr><tr><td>Tax</td><td>$80</td></tr></tbody><tfoot><tr><td>Total</td><td>$12080</td></tr></tfoot></table>
                </div>
                <div className="sidebar-support"><h4 className="text-capitalize">Help and Support</h4><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ut arnare</p><p><i className="fa fa-phone" /> 977 - 222 - 444 - 666</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
