/* eslint-disable @next/next/no-img-element -- preserve the supplied Hotux HTML asset markup. */

import Link from "next/link";
import { routes } from "@/config/routes";

export function VeChungToi() {
  return (
    <section className="about-style-3">
      <div className="container">
        <div className="about-inner">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="about-heading">
                <h2 className="title">
                  Comfort are <span>perfectly</span> combined here
                </h2>
                <div className="description">
                  <p>
                    This charming private 19th century mansion, which originally
                    belonged to the family, has been completely renovated with
                    care &amp; passion while respecting the spirit of place.
                  </p>
                  <p className="mar-bottom-30">
                    Hotux Hotel surrounded herself by a team of French artisans
                    to create a sophisticated place in a refined.
                  </p>
                  <Link href={routes.about} className="btn btn-orange">
                    READ MORE <i className="fa fa-angle-double-right" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="intro-thumb thumb">
                <img
                  className="intro-img-1"
                  src="/assets/images/intro-thumb-1.jpg"
                  alt="Image"
                />
                <img
                  className="intro-img-3"
                  src="/assets/images/intro-thumb-3.jpg"
                  alt="Image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
