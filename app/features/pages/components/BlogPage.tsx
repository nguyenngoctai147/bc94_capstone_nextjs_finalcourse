"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { routes } from "@/config/routes";
import styles from "@/css/features/pages/hotux-pages.module.css";

const posts = [
  { image: "news1.jpg", title: "Chọn chỗ nghỉ phù hợp cho chuyến đi mùa hè", category: "Kinh nghiệm", excerpt: "Bắt đầu từ số khách, số phòng ngủ và những tiện nghi mà cả nhóm thật sự cần." },
  { image: "news2.jpg", title: "Những điều cần kiểm tra trước khi đặt phòng", category: "Đặt phòng", excerpt: "Kiểm tra ngày lưu trú, sức chứa và chính sách của nơi ở trước bước xác nhận." },
  { image: "news3.jpg", title: "Gợi ý kỳ nghỉ thư giãn cho gia đình", category: "Cảm hứng", excerpt: "Ưu tiên không gian chung, bếp, máy giặt và khu vực thuận tiện khi đi cùng trẻ nhỏ." },
  { image: "news4.jpg", title: "Chuẩn bị cho chuyến đi cùng nhóm bạn", category: "Kinh nghiệm", excerpt: "Thống nhất ngân sách, số giường và phương án di chuyển để lựa chọn nhanh hơn." },
  { image: "news5.jpg", title: "Tiện nghi nào tạo nên kỳ nghỉ thoải mái?", category: "Tiện nghi", excerpt: "Wi-Fi, điều hòa, bếp và chỗ đỗ xe là những tiêu chí nên được kiểm tra từ đầu." },
  { image: "news6.jpg", title: "Theo dõi và quản lý đặt phòng của bạn", category: "Đặt phòng", excerpt: "Lưu mã đặt phòng và xem lại ngày nhận, ngày trả cùng số khách trong tài khoản." },
  { image: "news7.jpg", title: "Khám phá điểm đến theo cách riêng", category: "Cảm hứng", excerpt: "Chọn nơi ở làm điểm xuất phát thuận tiện cho những trải nghiệm bạn quan tâm." },
  { image: "news8.jpg", title: "Mẹo cân đối chi phí lưu trú", category: "Kinh nghiệm", excerpt: "So sánh giá theo đêm, số đêm và sức chứa thay vì chỉ nhìn vào giá niêm yết." },
] as const;

const recentPosts = posts.slice(0, 3);
const categories = ["Tất cả", "Kinh nghiệm", "Đặt phòng", "Cảm hứng", "Tiện nghi"] as const;
const PAGE_SIZE = 4;

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("Tất cả");
  const [page, setPage] = useState(1);
  const filteredPosts = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase("vi-VN");
    return posts.filter((post) => (category === "Tất cả" || post.category === category)
      && (!keyword || `${post.title} ${post.excerpt}`.toLocaleLowerCase("vi-VN").includes(keyword)));
  }, [category, query]);
  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visiblePosts = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <section className="details">
        <div className="container"><div className="row flex-row-reverse">
          <div className="col-lg-8">
            <div className="list-content"><div className="row">
              {visiblePosts.map((post) => <div className="col-lg-6 col-md-6" key={post.title}><article className="news-item">
                <div className={`news-image ${styles.postMedia}`}><Image src={`/assets/images/${post.image}`} alt={post.title} width={740} height={500} sizes="(max-width: 767px) 100vw, 50vw" /></div>
                <div className="news-content">
                  <p className="date">14 THÁNG 10, 2026</p><h2 className="h4">{post.title}</h2>
                  <div className="room-services"><ul><li><i className="fa fa-user" aria-hidden="true" /> Hotux</li><li><i className="fa fa-folder-open" aria-hidden="true" /> {post.category}</li></ul></div>
                  <p>{post.excerpt}</p><Link href={routes.rooms.list}>XEM PHÒNG <i className="fa fa-angle-double-right" aria-hidden="true" /></Link>
                </div>
              </article></div>)}
            </div></div>
            {visiblePosts.length === 0 && <div className="alert alert-light border">Không tìm thấy bài viết phù hợp.</div>}
            {pageCount > 1 && <nav className="pagination-content text-center" aria-label="Phân trang cẩm nang"><ul className="pagination">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <li className={number === currentPage ? "active" : ""} key={number}><button type="button" className={styles.pageButton} onClick={() => setPage(number)} aria-current={number === currentPage ? "page" : undefined}>{number}</button></li>)}
            </ul></nav>}
          </div>

          <aside className="col-lg-4">
            <div className="detail-sidebar">
              <div className="sidebar-search"><form role="search" onSubmit={(event) => event.preventDefault()}><label className="visually-hidden" htmlFor="blog-search">Tìm bài viết</label><input id="blog-search" className={styles.searchInput} type="search" placeholder="Tìm bài viết" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /><button type="submit" aria-label="Tìm"><i className="fa fa-search" /></button></form></div>
              <div className="sidebar-recent">
                <h3>Bài viết gần đây</h3>
                {recentPosts.map((post) => <article className="recent-item clearfix" key={post.title}><div className={`recent-image ${styles.recentMedia}`}><Image src={`/assets/images/${post.image}`} alt="" width={96} height={72} /></div><div className="recent-content"><h4>{post.title}</h4><p>14/10/2026</p></div></article>)}
              </div>
              <div className="sidebar-instagram"><h3>Khoảnh khắc Hotux</h3><div className={`instagram-inner ${styles.instagramGrid}`}>
                {Array.from({ length: 6 }, (_, index) => <Image src={`/assets/images/instagram${index + 1}.jpg`} alt="Không gian lưu trú" width={120} height={120} key={index} />)}
              </div></div>
              <div className="sidebar-tags"><h3>Chủ đề</h3><ul>{categories.map((item) => <li key={item}><button type="button" className={`${styles.tagButton} ${item === category ? styles.tagButtonActive : ""}`} onClick={() => { setCategory(item); setPage(1); }}>{item}</button></li>)}</ul></div>
              <div className="sidebar-category"><h3>Danh mục</h3><ul>{categories.slice(1).map((item) => <li key={item}><button type="button" className={styles.categoryButton} onClick={() => { setCategory(item); setPage(1); }}>{item}<span>{posts.filter((post) => post.category === item).length}</span></button></li>)}</ul></div>
              <div className="sidebar-room">
                <div className={`sr-image ${styles.sidebarRoomMedia}`}><Image src="/assets/images/sr1.jpg" alt="Phòng nổi bật" width={868} height={1300} sizes="(max-width: 991px) 100vw, 33vw" /></div>
                <div className="sr-content"><h3>Không gian dành cho bạn</h3><p>Khám phá phòng theo điểm đến, sức chứa và tiện nghi.</p><Link href={routes.rooms.list} className="btn btn-orange">Xem danh sách phòng</Link></div>
              </div>
            </div>
          </aside>
        </div></div>
      </section>

      <section className="related-rooms"><div className="container">
        <div className="section-title"><h2>Gợi ý <span>lưu trú</span></h2><p>Tiếp tục hành trình bằng những không gian được khách quan tâm.</p></div>
        <div className="row team-slider">{[1, 2, 3].map((number) => <div className="col-md-4 mar-bottom-30" key={number}><article className="team-item">
          <div className={`team-image ${styles.relatedRoomMedia}`}><Image src={`/assets/images/room-b${number}.jpg`} alt={`Không gian phòng ${number}`} width={900} height={700} sizes="(max-width: 767px) 100vw, 33vw" /></div>
          <div className="team-content"><h3 className="h4">Phòng nghỉ nổi bật</h3><Link href={routes.rooms.list}>Xem phòng</Link></div>
        </article></div>)}</div>
      </div></section>
    </>
  );
}
