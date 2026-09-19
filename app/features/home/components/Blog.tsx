import Image from "next/image";
import Link from "next/link";
import { routes } from "@/config/routes";

export default function Blog() {
  return (
    <section className="news pad-bottom-70">
      <div className="container">
        <div className="section-title">
          <h2>
            Latest <span>News</span>
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex
            neque, sodales accumsan sapien et, auctor vulputate quam donec vitae
            consectetur turpis
          </p>
        </div>
        <div className="news-outer">
          <div className="row">
            <div className="col-lg-4 col-md-12 mar-bottom-30">
              <div className="news-item">
                <div className="news-image">
                  <Image
                    width={500}
                    height={350}
                    src="/assets/images/news1.jpg"
                    alt="image 1"
                  />
                </div>
                <div className="news-content">
                  <p className="date mar-bottom-5">16 DECEMBER 2019</p>
                  <h4>
                    <Link href={routes.blog}>
                      Why choose Hotux Hotel to travel this summer
                    </Link>
                  </h4>
                  <div className="room-services mar-bottom-10">
                    <ul>
                      <li>
                        <Link href={routes.blog}>
                          <i className="fa fa-user" aria-hidden="true" /> By
                          Jack Daniels
                        </Link>
                      </li>
                      <li>
                        <Link href={routes.blog}>
                          <i className="fa fa-comment" aria-hidden="true" /> 3
                          comments
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vestibulum orci nulla, fermentum in faucibus a, interdum eu
                    nibh.
                  </p>
                  <Link href={routes.blog}>
                    READ MORE <i className="fa fa-angle-double-right" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mar-bottom-30">
              <div className="news-item">
                <div className="news-image">
                  <Image
                    width={500}
                    height={350}
                    src="/assets/images/news2.jpg"
                    alt="image 2"
                  />
                </div>
                <div className="news-content">
                  <p className="date mar-bottom-5">16 DECEMBER 2019</p>
                  <h4>
                    <Link href={routes.blog}>
                      Why choose Hotux Hotel to travel this summer
                    </Link>
                  </h4>
                  <div className="room-services mar-bottom-10">
                    <ul>
                      <li>
                        <Link href={routes.blog}>
                          <i className="fa fa-user" aria-hidden="true" /> By
                          Jack Daniels
                        </Link>
                      </li>
                      <li>
                        <Link href={routes.blog}>
                          <i className="fa fa-comment" aria-hidden="true" /> 3
                          comments
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vestibulum orci nulla, fermentum in faucibus a, interdum eu
                    nibh.
                  </p>
                  <Link href={routes.blog}>
                    READ MORE <i className="fa fa-angle-double-right" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mar-bottom-30">
              <div className="news-item">
                <div className="news-image">
                  <Image
                    width={500}
                    height={350}
                    src="/assets/images/news3.jpg"
                    alt="image 3"
                  />
                </div>
                <div className="news-content">
                  <p className="date mar-bottom-5">16 DECEMBER 2019</p>
                  <h4>
                    <Link href={routes.blog}>
                      Why choose Hotux Hotel to travel this summer
                    </Link>
                  </h4>
                  <div className="room-services mar-bottom-10">
                    <ul>
                      <li>
                        <Link href={routes.blog}>
                          <i className="fa fa-user" aria-hidden="true" /> By
                          Jack Daniels
                        </Link>
                      </li>
                      <li>
                        <Link href={routes.blog}>
                          <i className="fa fa-comment" aria-hidden="true" /> 3
                          comments
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vestibulum orci nulla, fermentum in faucibus a, interdum eu
                    nibh.
                  </p>
                  <Link href={routes.blog}>
                    READ MORE <i className="fa fa-angle-double-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
