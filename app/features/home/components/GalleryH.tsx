import Image from "next/image";

export default function GalleryH() {
  return (
    <section id="gallery" className="content gallery gallery1">
      <div className="container">
        <div className="section-title title-white">
          <h2>
            Beautiful View of <span>Hotux</span>
          </h2>
          <p className="mar-bottom-30">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ex
            neque, sodales accumsan sapien et, auctor vulputate quam donec vitae
            consectetur turpis
          </p>
        </div>
      </div>
      <div className="gallery-main gallery-slider">
        <div className="gallery-image">
          <Image
            width={100}
            height={300}
            src="/assets/images/gallery/gallery1.jpg"
            alt="1"
          />
        </div>
        <div className="gallery-image">
          <Image
            width={100}
            height={300}
            src="/assets/images/gallery/gallery2.jpg"
            alt="2"
          />
        </div>
        <div className="gallery-image">
          <Image
            width={100}
            height={300}
            src="/assets/images/gallery/gallery3.jpg"
            alt="3"
          />
        </div>
        <div className="gallery-image">
          <Image
            width={100}
            height={300}
            src="/assets/images/gallery/gallery4.jpg"
            alt="4"
          />
        </div>
        <div className="gallery-image">
          <Image
            width={100}
            height={300}
            src="/assets/images/gallery/gallery5.jpg"
            alt="5"
          />
        </div>
        <div className="gallery-image">
          <Image
            width={100}
            height={300}
            src="/assets/images/gallery/gallery6.jpg"
            alt="6"
          />
        </div>
        <div className="gallery-image">
          <Image
            width={100}
            height={300}
            src="/assets/images/gallery/gallery7.jpg"
            alt="7"
          />
        </div>
      </div>
    </section>
  );
}
