"use client";

/* eslint-disable @next/next/no-img-element -- static Hotux booking markup. */
import Link from "next/link";
import { routes } from "@/config/routes";
import { ReservationProgress } from "./AvailabilityPage";

const services = [
  "10 Bedrooms",
  "Wifi",
  "Television",
  "Hot Water",
  "Dinner",
  "Quick Services",
  "A/C",
  "Laundry Services",
  "AirPort Taxi",
] as const;

function Stars() {
  return (
    <div className="rating">
      <span className="fa fa-star checked" />
      <span className="fa fa-star checked" />
      <span className="fa fa-star checked" />
      <span className="fa fa-star checked" />
      <span className="fa fa-star checked" />
    </div>
  );
}

function Field({
  type = "text",
  placeholder,
}: {
  type?: "text" | "email";
  placeholder: string;
}) {
  return <input type={type} placeholder={placeholder} />;
}

export function BookingPage() {
  return (
    <section className="content">
      <div className="container">
        <ReservationProgress active={3} />
        <div className="booking">
          <div className="row">
            <div className="col-lg-8">
              <div className="booking-content">
                <div className="booking-image">
                  <img src="/assets/images/detail-slider/slider1.jpg" alt="image" />
                  <div className="booking-title">
                    <div className="title-left">
                      <h3>Luxury King Room</h3>
                      <Stars />
                    </div>
                    <div className="title-right pull-right">
                      <div className="title-price">
                        <h4 className="pad-top-15"><a href="#">$1200<span>/Night</span></a></h4>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="booking-desc mar-top-50">
                  <ul className="mar-bottom-15">
                    <li><i className="fa fa-bed" aria-hidden="true" /> 3 Bedrooms</li>
                    <li><i className="fa fa-wifi" aria-hidden="true" /> Wifi</li>
                    <li><i className="fa fa-tv" aria-hidden="true" /> Telivision</li>
                    <li><i className="fa fa-bath" aria-hidden="true" /> Hot Water</li>
                    <li><i className="fa fa-utensil-spoon" aria-hidden="true" /> Dinner</li>
                    <li><i className="fa fa-cogs" aria-hidden="true" /> Fast Service</li>
                    <li><i className="fa fa-thermometer" aria-hidden="true" /> AC</li>
                    <li><i className="fa fa-car" aria-hidden="true" /> Airport Taxi</li>
                  </ul>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in quam urna. Sed eu suscipit augue. Duis sollicitudin euismod velit, a lobortis felis pretium a. In facilisis maximus elit, sed fermentum sem lobortis at. Ut luctus euismod metus, eu malesuada orci malesuada sit amet mauris vitae sapien.</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ultrices felis est, vitae suscipit odio suscipit a. Integer sit amet eleifend nisi. Nam eu pulvinar eros.</p>
                </div>

                <div className="extra-services mar-top-50">
                  <h4 className="mar-bottom-30">Add Extra Services</h4>
                  <ul>
                    {services.map((service) => (
                      <li key={service}><span className="pretty p-default p-thick p-pulse mar-bottom-15"><input type="checkbox" /><span className="state p-warning-o"><label>{service}</label></span></span></li>
                    ))}
                  </ul>
                </div>

                <div className="personal-info mar-top-50">
                  <div className="form-title"><span>1</span><h4 className="mar-bottom-30">Personal Information</h4></div>
                  <form>
                    <div className="row">
                      <div className="col-md-6"><div className="form-group"><Field placeholder="First Name" /></div></div>
                      <div className="col-md-6"><div className="form-group"><Field placeholder="Last Name" /></div></div>
                      <div className="col-md-6"><div className="form-group"><Field placeholder="DOB" /></div></div>
                      <div className="col-md-6"><div className="form-group"><Field placeholder="Country" /></div></div>
                      <div className="col-md-6"><div className="form-group"><Field type="email" placeholder="Email" /></div></div>
                      <div className="col-md-6"><div className="form-group"><Field placeholder="Phone" /></div></div>
                      <div className="col-md-12"><div className="form-group mar-0"><textarea defaultValue="Message" /></div></div>
                    </div>
                  </form>
                </div>

                <div className="card-info mar-top-50">
                  <div className="form-title"><span>2</span><h4 className="mar-bottom-30">Payment Information</h4></div>
                  <form>
                    <div className="row">
                      <div className="col-md-6"><div className="form-group"><Field placeholder="Card Type" /></div></div>
                      <div className="col-md-6"><div className="form-group"><Field placeholder="Card Number" /></div></div>
                      <div className="col-md-6"><div className="form-group"><Field placeholder="Card Holder Name" /></div></div>
                      <div className="col-md-6"><div className="form-group"><Field placeholder="CVC" /></div></div>
                      <div className="col-md-3"><div className="form-group"><Field placeholder="Expiry Month" /></div></div>
                      <div className="col-md-3"><div className="form-group"><Field placeholder="Expiry Year" /></div></div>
                      <div className="col-md-3"><div className="form-group radio-group"><input type="radio" name="payment" />Via Credit Card</div></div>
                      <div className="col-md-3"><div className="form-group radio-group"><input type="radio" name="payment" />Via Paypal</div></div>
                      <div className="col-md-12 mar-top-15">
                        <div className="form-group mar-bottom-30"><input type="checkbox" /> I agree to the <a href="#">Terms and Conditions</a></div>
                        <div className="card-btn"><Link href={routes.reservation.confirmation} className="btn btn-orange">CONFIRM BOOKING</Link></div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="detail-sidebar">
                <div className="sidebar-reservation">
                  <h3>Your reservation</h3>
                  <div className="reservation-detail">
                    <div className="rd-top">
                      <div className="rd-box"><label>Check in</label><p className="bold">04</p><p>August, 2019<br />Monday</p></div>
                      <div className="rd-box"><label>Check out</label><p className="bold">13</p><p>August, 2019<br />Wednesday</p></div>
                    </div>
                    <div className="rd-top">
                      <div className="rd-box"><p className="bold">03</p><p>Guest</p></div>
                      <div className="rd-box"><p className="bold">10</p><p>Night</p></div>
                    </div>
                  </div>
                  <table className="reservation-table table"><tbody><tr><td>1 Room x 10 Nights</td><td>$12000</td></tr><tr><td>Tax</td><td>$80</td></tr></tbody><tfoot><tr><td>Total</td><td>$12080</td></tr></tfoot></table>
                </div>
                <div className="sidebar-support"><h3>Help and Support</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ut arnare</p><p><i className="fa fa-phone" /> 977 - 222 - 444 - 666</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
