# Đưa giao diện HTML/CSS/JS tĩnh vào Next.js

Thư mục tĩnh trong ảnh của bạn (`css`, `font`, `images`, `js`, `dashboard`, `mail`...) nên được tách theo cách sau:

```text
project/
├─ app/
│  ├─ globals.css                 # CSS toàn ứng dụng, đã import Bootstrap
│  ├─ styles/                     # ghi chú/quy ước CSS của project hiện tại
│  └─ features/...                # Component và CSS riêng theo nghiệp vụ
├─ app/
│  ├─ components/                 # component dùng chung hiện tại
│  ├─ features/                   # component/service theo nghiệp vụ
│  ├─ config/                     # routes/endpoints
│  └─ templates/                  # layout UI
├─ public/
│  └─ assets/
│     ├─ images/                  # ảnh đang có của bạn
│     ├─ fonts/                   # .woff, .woff2, .ttf, .eot, .svg font
│     └─ legacy/                  # JS/CSS cũ chỉ để tham khảo/chuyển đổi
└─ docs/
```

## CSS

CSS dùng chung đặt ở `app/globals.css` hoặc file CSS riêng rồi import từ `app/layout.tsx`. CSS của một component nên colocate bên cạnh component đó với tên `Component.module.css`.

```tsx
// app/layout.tsx — đã có trong source
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
```

Với các file trong thư mục HTML cũ:

- `bootstrap.min.css`: không chép lại; project đã dùng package Bootstrap 5.2.3.
- `style.css`, `default.css`, `plugin.css`: gộp phần cần thiết vào `app/globals.css`, hoặc đổi thành `app/features/<module>/<Module>.module.css`.
- `flight.css`, `icons.css`: giữ phần selector cần dùng; kiểm tra trùng tên với Bootstrap trước khi import.
- Không import CSS bằng `<link>` trong page và không để stylesheet trong `public` nếu bạn muốn Next.js bundling/giảm lỗi thứ tự CSS.

### Phân loại đúng bộ CSS trong ảnh

Không cần lấy cả sáu file vào mọi trang. Với project hiện tại, xử lý như sau:

| File | Nên làm gì |
| --- | --- |
| `bootstrap.min.css` | **Bỏ qua** vì Bootstrap đã cài bằng npm và đang import trong `app/layout.tsx`. Chỉ dùng file này nếu gỡ package Bootstrap, không dùng cả hai bản cùng lúc. |
| `default.css` | Lấy các biến, kiểu chữ và rule nền tảng cần thiết; đưa vào `app/globals.css` hoặc đổi thành `app/styles/default.css`. |
| `style.css` | Đây thường là CSS giao diện chính. Đưa phần dùng chung vào `app/globals.css`; phần riêng của trang vào `app/(client)/**/page.module.css` hoặc component tương ứng. |
| `icons.css` | Chỉ lấy nếu giao diện thật sự dùng các class icon của bộ cũ. Nếu có `@font-face`, sửa URL font thành `/assets/fonts/...`. |
| `plugin.css` | Chỉ lấy khi bạn dùng đúng plugin mà file này định dạng (slider, gallery, datepicker...). Không import toàn cục ngay từ đầu. |
| `flight.css` | Chỉ lấy cho màn hình/module có class `flight`; không phải CSS bắt buộc của Airbnb. |

Trong source này, sáu file đã được giữ nguyên tại `public/assets/css`. Root layout nạp `default.css`, `flight.css`, `icons.css`, `plugin.css`, `style.css` bằng các thẻ stylesheet sau Bootstrap và trước CSS tùy biến. Bản `bootstrap.min.css` cũng được lưu để đối chiếu nhưng không nạp vì project đã dùng Bootstrap npm. Cách dùng `<link>` là có chủ ý để giữ nguyên các đường dẫn `url(../images/...)` của bộ CSS tĩnh.

Thứ tự an toàn khi cần dùng CSS cũ là: Bootstrap package → `default.css` → `flight.css` → `icons.css` → `plugin.css` → `style.css` → CSS module riêng. Trước khi copy, tìm `url(...)` trong file và đổi các đường dẫn tương đối tới ảnh/font sang `/assets/images/...` và `/assets/fonts/...`.

Template gốc dùng cả `/assets/font` và `/assets/fonts`; project giữ hai đường dẫn tương thích trong `public/assets/font` và `public/assets/fonts` để các `url(...)` nguyên bản không bị hỏng. Các ảnh CSS hiện trỏ tương đối từ `public/assets/css` tới `public/assets/images`.

Bộ Flaticon đã được nạp bằng `/assets/fonts/flaticon.css`. File `_flaticon.scss` được giữ lại cùng bộ font để tra cứu/mở rộng mapping icon, nhưng không import trực tiếp vì project chưa bật Sass; file `.scss` không cần thiết cho trình duyệt khi `flaticon.css` đã có sẵn.

Thứ tự hiện tại là Bootstrap trước CSS tùy biến, nên selector trong `app/globals.css` có thể override Bootstrap. Không import Tailwind preflight cùng Bootstrap.

## Font

Chép các file font vào `public/assets/fonts`, ví dụ:

```text
public/assets/fonts/Flaticon.woff
public/assets/fonts/Flaticon.ttf
public/assets/fonts/iconsmind.woff
```

Khi CSS dùng `url`, đường dẫn bắt đầu từ root web, không bắt đầu bằng `public`:

```css
@font-face {
  font-family: "Flaticon";
  src: url("/assets/fonts/Flaticon.woff") format("woff");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

Các file `.eot` chỉ cần giữ nếu còn hỗ trợ trình duyệt rất cũ. Với font icon, nên giữ class/icon mapping cũ trong một CSS riêng và đổi dần sang SVG hoặc icon component khi chỉnh giao diện.

## Images và video

Ảnh local đặt trong `public/assets/images` và dùng URL `/assets/images/...`:

```tsx
import Image from "next/image";

<Image src="/assets/images/room1.jpg" alt="Phòng lưu trú" width={640} height={420} />
```

Ảnh nền trong CSS cũng dùng URL này:

```css
.hero { background-image: url("/assets/images/bner.png"); }
```

Giữ cấu trúc thư mục con (`room-list`, `slider`, `icons`...) để đường dẫn cũ dễ đổi. Không viết `src="public/assets/..."`; thư mục `public` đã là web root.

Ảnh trả về từ backend cần dùng `next/image` với host đã khai báo trong `next.config.ts`, hoặc dùng thẻ `<img>` nếu chưa biết host. Không đưa URL ảnh backend trực tiếp vào CSS cứng.

## JavaScript

Đây là phần không nên chép nguyên thư mục `js` vào `public` rồi nhúng toàn cục. JS HTML cũ thường dùng `querySelector`, jQuery, `onclick`, slider hoặc Bootstrap plugin; các thao tác đó cần chuyển thành React component:

### Phân loại đúng bộ JS trong ảnh

| File | Cách xử lý trong Next.js |
| --- | --- |
| `bootstrap.min.js` | Thường **không cần copy**. Nếu dùng Modal/Dropdown/Carousel của Bootstrap, cài package đã có và khởi tạo plugin trong Client Component. Không nạp cùng lúc nhiều bản Bootstrap JS. |
| `jquery-3.3.1.min.js` | Không nạp toàn cục. Chỉ giữ tạm trong `public/assets/legacy/js` nếu một plugin cũ bắt buộc jQuery; ưu tiên thay plugin bằng React. |
| `plugin.js` | File tổng hợp rất lớn; không lấy ngay. Chỉ xác định plugin nào thật sự được dùng, rồi thay bằng component/library tương ứng. |
| `main.js` | Thường là entry point khởi tạo nhiều plugin. Không import nguyên file; tách từng phần cần thiết vào component Client và `useEffect`. |
| `custom-nav.js` | Chuyển thành state của header/menu trong `app/templates` hoặc `app/components/navigation`. |
| `custom-gallery.js`, `custom-swiper1.js`, `custom-swiper2.js` | Chỉ dùng cho màn hình có gallery/slider; chuyển thành component `Gallery`/`Swiper` riêng, không chạy trên mọi route. |
| `custom-date.js`, `custom-singledate.js` | Chỉ dùng cho datepicker. Form đặt phòng hiện đã có input `type="date"` và validation riêng; chưa cần hai file này. |
| `custom-mixtup.js`, `isotope.min.js` | Chỉ dùng nếu có lọc/sắp xếp layout lưới kiểu portfolio. Không cần cho danh sách phòng cơ bản. |
| `chart.js`, `map.js` | Chỉ dùng ở dashboard có biểu đồ/bản đồ. Tách thành `app/(admin)/admin/**` và Client Component tương ứng. |
| `dashboard.js` | Không import nguyên file. Tách các widget dashboard thành component quản trị; chart/map/plugin chỉ tải ở trang cần dùng. |

Quy tắc chọn nhanh: trang khách thường cần `custom-nav` và có thể cần gallery/swiper; trang chi tiết phòng có thể cần gallery/swiper; trang đặt phòng dùng date validation hiện có; dashboard mới cần `chart`, `map` hoặc `dashboard`; `jquery`, `plugin`, `isotope` chỉ giữ khi không thể thay thế.

Các file `images/` nằm trong thư mục `js` của template không phải JavaScript; gộp chúng vào `public/assets/images` cùng ảnh hiện có.

```tsx
"use client";
import { useState } from "react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return <button aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>;
}
```

Quy tắc chuyển đổi:

- `js` điều khiển menu/modal/form → component trong `app/components/` hoặc `app/templates/`.
- `js` chỉ gọi API → service/thunk trong `app/features/<module>/`.
- `js` khởi tạo plugin Bootstrap → Client Component, gọi trong `useEffect`, và dispose khi unmount.
- `js` là thư viện bên thứ ba chưa chuyển đổi → chỉ khi thật cần mới đặt bản tĩnh ở `public/assets/legacy`, rồi nạp bằng `next/script` trong component client cụ thể; không nạp toàn site.
- Không lưu token hoặc thông tin người dùng trong file JS tĩnh.

Ví dụ plugin cần DOM:

```tsx
"use client";
import { useEffect, useRef } from "react";

export function LegacyWidget() {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Khởi tạo plugin với element.current nếu thực sự cần.
    return () => {
      // dispose plugin ở đây.
    };
  }, []);
  return <div ref={element} />;
}
```

## `dashboard`, `mail`, `documentation`

Đây là các nhóm giao diện, không phải asset public. Tách HTML của chúng thành route/component:

- phần admin/dashboard → `app/(admin)/admin` và `templates/AdminTemplate.tsx`;
- phần login/register/mail → `app/(auth)` và `templates/AuthTemplate.tsx`;
- phần website khách → `app/(client)` và `templates/ClientTemplate.tsx`;
- hình ảnh, font, favicon → `public/assets`.

Page trong `app` chỉ lắp ráp component. Chuyển `class` thành `className`, `for` thành `htmlFor`, `href` nội bộ thành `Link`, và thêm `"use client"` chỉ cho component có state/event/browser API.

## Tóm tắt đường dẫn

| File tĩnh cũ | Nơi đặt / cách dùng |
| --- | --- |
| `css/*.css` | `app/globals.css` hoặc `*.module.css`, import trong code |
| `font/*` | `public/assets/fonts/*`, dùng `/assets/fonts/...` |
| `images/*` | `public/assets/images/*`, dùng `/assets/images/...` |
| `js/*` | chuyển thành React component/service/thunk; bản cũ tạm thời vào `public/assets/legacy` |
| `dashboard/*` | component/page trong `app/(admin)` |
| `mail/*` | component/page trong `app/(auth)` hoặc feature tương ứng |

Trong source hiện tại, ảnh mẫu đã ở `public/assets/images`. Bạn có thể copy `font` vào `public/assets/fonts`, sau đó chuyển từng màn hình từ `dashboard`/`mail` vào route group tương ứng. Xem thêm [docs/architecture.md](./architecture.md) và trang demo component tại `/ui`.

Phần JavaScript đã copy vào `public/assets/legacy/js`; xem [docs/static-js.md](./static-js.md) để biết phụ thuộc và cách nạp có kiểm soát.
