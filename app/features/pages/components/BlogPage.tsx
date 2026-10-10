import Image from "next/image";
import Link from "next/link";
import { routes } from "@/config/routes";

const posts = [
  "news1.jpg", "news2.jpg", "news3.jpg", "news1.jpg", "news2.jpg",
  "news3.jpg", "news1.jpg", "news2.jpg", "news3.jpg",
];

function BlogPost({ image, last }: { image: string; last: boolean }) {
  return (
    <div className={`col-lg-4 ${last ? "col-md-12" : "col-md-6"}`}>
      <div className="news-item">
        <div className="news-image">
          <Image src={`/assets/images/${image}`} alt="image" width={500} height={350} />
        </div>
        <div className="news-content">
          <p className="date">16 DECEMBER 2019</p>
          <h4>Why choose Hotux Hotel to travel this summer</h4>
          <div className="room-services">
            <ul>
              <li><i className="fa fa-user" aria-hidden="true" /> By Jack Daniels</li>
              <li><i className="fa fa-comment" aria-hidden="true" /> 3 comments</li>
            </ul>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum orci nulla, fermentum in faucibus a, interdum eu nibh.</p>
          <Link href={routes.blog}>READ MORE <i className="fas fa-angle-double-right" /></Link>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <>
      <section className="breadcrumb-outer">
        <div className="container">
          <div className="breadcrumb-content">
            <h2>Blog List</h2>
            <nav aria-label="breadcrumb">
              <ul className="breadcrumb">
                <li className="breadcrumb-item"><Link href={routes.home}>Home</Link></li>
                <li className="breadcrumb-item active" aria-current="page">Blog List</li>
              </ul>
            </nav>
          </div>
        </div>
      </section>
      <section className="details">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="list-content">
                <div className="row">
                  {posts.map((image, index) => <BlogPost key={`${image}-${index}`} image={image} last={index === posts.length - 1} />)}
                </div>
              </div>
              <nav className="pagination-content text-center">
                <ul className="pagination">
                  <li className="page-item"><Link href={routes.blog} className="page-link"><i className="fa fa-angle-double-left" aria-hidden="true" /></Link></li>
                  <li className="page-item active"><Link href={routes.blog} className="page-link">1</Link></li>
                  <li className="page-item"><Link href={routes.blog} className="page-link">2</Link></li>
                  <li className="page-item"><Link href={routes.blog} className="page-link">3</Link></li>
                  <li className="page-item"><Link href={routes.blog} className="page-link">4</Link></li>
                  <li className="page-item"><Link href={routes.blog} className="page-link">...</Link></li>
                  <li className="page-item"><Link href={routes.blog} className="page-link">10</Link></li>
                  <li><Link href={routes.blog} className="page-link"><i className="fa fa-angle-double-right" aria-hidden="true" /></Link></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
