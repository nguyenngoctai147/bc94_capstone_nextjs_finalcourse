import Image from "next/image";
import styles from "./GalleryH.module.css";

export default function GalleryH() {
  return (
    <section id="gallery" className="content gallery gallery1">
      <div className="container">
        <div className="section-title title-white">
          <h2>Không gian nghỉ dưỡng tại <span>Hotux</span></h2>
          <p className="mar-bottom-30">Khám phá một số hình ảnh không gian lưu trú và cảm hứng cho chuyến đi tiếp theo.</p>
        </div>
      </div>
      <div className="gallery-main gallery-slider" data-hotux-managed>
        {[1, 2, 3, 4, 5, 6, 7].map((number) => <div className={`gallery-image ${styles.galleryImage}`} key={number}>
          <Image src={`/assets/images/gallery/gallery${number}.jpg`} alt={`Không gian lưu trú ${number}`}
            width={800} height={800} sizes="(max-width: 767px) 50vw, (max-width: 1199px) 50vw, 25vw" />
        </div>)}
      </div>
    </section>
  );
}
