# Ghép giao diện và mở rộng source

## 1. Đặt giao diện tĩnh vào đúng lớp

1. Tách header/footer/sidebar thành component trong `templates/` hoặc `components/navigation/`.
2. Chuyển HTML phần nội dung thành component trong `features/<nghiep-vu>/components/`.
3. Page trong `app/` chỉ import và render component nghiệp vụ.
4. Đổi `class` thành `className`, `for` thành `htmlFor`; đóng thẻ JSX; đổi inline style thành object.
5. Dùng `Link` của Next.js cho chuyển trang và lấy URL từ `config/routes/`.
6. Chép ảnh/font vào `public/assets/`. Ví dụ file `public/assets/images/room.jpg` có URL `/assets/images/room.jpg`.
7. Với ảnh local, có thể dùng `next/image` cùng width/height hoặc fill. Ảnh backend cần cấu hình `images.remotePatterns` cho host ảnh thực tế trong `next.config.ts`.
8. Tách CSS riêng vào `*.module.css` cạnh component. CSS toàn site import sau Bootstrap trong root layout.
9. Đổi `onclick`, jQuery, querySelector và script thao tác DOM sang React state/event. Chỉ thêm `"use client"` vào component cần hook, event hoặc browser API.

Không cần chuyển toàn bộ ứng dụng sang Client Component. Các layout và page mặc định là Server Component; StoreProvider, form và danh sách tương tác là Client Component.

Không có Bootstrap JS toàn cục trong khung này; các component hiện tại không cần JS plugin. Khi tích hợp plugin Bootstrap, khởi tạo phía client và dispose instance trong cleanup. Giữ CSS Bootstrap đã cài, không nạp lại qua CDN. Tailwind package cũ còn trong package.json nhưng không import CSS/preflight.

Header/footer Hotux từ HTML mẫu hiện đã được tách thành `app/components/navigation/HotuxHeader.tsx` và `HotuxFooter.tsx`. `ClientTemplate` dùng cho `/` và `/trang-chu`; các layout con của `app/(client)` dùng `PageTemplate` cho `rooms`, `bookings`, `account`, `blog`, `gioi-thieu`, `lien-he` và `ui`. Layout cha `(client)/layout.tsx` chỉ passthrough để không lồng hai template. Footer dùng ảnh tại `/assets/images/...`. CSS legacy vẫn được nạp từ `public/assets/css` trong root layout, còn JS legacy chỉ được tải theo từng page khi một component thực sự cần plugin đó.

## 2. Quản lý route và menu

`app/(client)/rooms/[id]/page.tsx` tạo URL `/rooms/123` và kế thừa `rooms/layout.tsx`. Tên `(client)` không nằm trong URL. Route thực tế vẫn do thư mục `app/` quyết định; `app/config/routes/` chỉ là registry để các component dùng cùng một URL.

Các route được tách theo phạm vi:

- `config/routes/client.ts`: trang public và route chi tiết phòng.
- `config/routes/auth.ts`: đăng nhập và đăng ký.
- `config/routes/admin.ts`: các trang quản trị.
- `config/routes/navigation.ts`: menu header, menu client và menu admin.
- `config/routes/match.ts`: kiểm tra active route, bao gồm alias `/trang-chu`.
- `config/routes/web.ts`: các hằng số URL dạng `HOME_PAGE`, `ROOMS_PAGE` để tra cứu nhanh.
- `config/routes/webSeo.ts`: danh sách route cần dùng cho metadata/SEO.
- `config/routes/index.ts`: facade `routes` tương thích với code hiện tại và các export theo nhóm.

```tsx
import Link from "next/link";
import { clientRoutes } from "@/config/routes";

<Link href={clientRoutes.rooms.detail(123)}>Chi tiết phòng</Link>
```

Khi thêm trang, tạo `page.tsx` đúng thư mục, thêm URL vào nhóm route tương ứng, rồi thêm một `NavItem` vào `navigation.ts`. Header Hotux dùng `hotuxNavigation`; sidebar dùng `clientNavigation` hoặc `adminNavigation`. `isRouteActive` kiểm tra theo ranh giới segment để tránh `/rooms` và `/rooms-other` trùng nhau.

AdminTemplate, AuthTemplate, ClientTemplate và PageTemplate là component dùng qua `layout.tsx`. Không dùng file đặc biệt `template.tsx` vì không cần remount toàn bộ layout mỗi lần chuyển trang. Khi thêm page nội dung mới, tạo `layout.tsx` cạnh page và bọc children bằng `PageTemplate` với `title`/`breadcrumb` tương ứng.

Dynamic params trong phiên bản Next này là Promise:

```tsx
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // kiểm tra id rồi render component
}
```

## 3. Thêm module mới

Ví dụ module mới có backend endpoint `/amenities` (chỉ là ví dụ, chưa có trong Swagger hiện tại):

1. Tạo `features/amenities/amenities.types.ts`.
2. Tạo `config/endpoints/amenities.ts` cho base path và các path đặc biệt, export module đó từ `config/endpoints/index.ts`, rồi thêm rule chính xác vào `lib/api/backend-policy.ts`.
3. Tạo service bằng `createCrudService<Amenity, CreateAmenity, UpdateAmenity>(endpoint)`.
4. Tạo thunk bằng `createCrudThunks("amenities", amenitiesService)`.
5. Tạo slice bằng `createCrudSlice("amenities", amenitiesThunks)`.
6. Thêm reducer vào `combineReducers` trong `store/index.ts`.
7. Thêm component/page/menu theo yêu cầu.

Lấy `features/locations/` làm mẫu. Các service nên import endpoint group tương ứng (`roomEndpoints`, `bookingEndpoints`...) thay vì nối chuỗi URL trong service. Nếu API khác chuẩn CRUD, override phương thức trong service như users.remove (query string) hoặc bookings.list (theo người dùng). Không sửa generic factory để nhét logic riêng của một module.

Tài nguyên mới chỉ bật `{ patch: true }` sau khi backend có endpoint PATCH và đã cập nhật policy proxy.

## 4. Nối form với store

```tsx
"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { roomsThunks } from "@/features/rooms/rooms.thunks";
import type { CreateRoom } from "@/features/rooms/rooms.types";

// Bên trong component:
const dispatch = useAppDispatch();
const request = useAppSelector((state) => state.rooms.requests.create);

async function save(values: CreateRoom) {
  const result = await dispatch(roomsThunks.create(values));
  if (roomsThunks.create.fulfilled.match(result)) {
    await dispatch(roomsThunks.list());
    // đóng form hoặc chuyển trang
  }
}
// request.status === "loading": vô hiệu hóa nút
// request.error?.message: hiển thị Alert
```

Có thể dùng `await dispatch(thunk(args)).unwrap()` với try/catch. Dùng `toApiError(error)` để lấy message. Việc gọi `dispatch` mà không unwrap không ném lỗi API ra catch; hãy dùng action matcher như ví dụ.

Với effect tải dữ liệu:

```tsx
useEffect(() => {
  const task = dispatch(roomsThunks.detail(id));
  return () => task.abort();
}, [dispatch, id]);
```

## 5. Thunk tùy chỉnh cho endpoint đặc biệt

```ts
import { createRequestThunk } from "@/store/create-api-thunk";
import { roomsService } from "@/features/rooms/rooms.service";

export const uploadRoomImage = createRequestThunk(
  "rooms/uploadImage",
  ({ id, file }: { id: number; file: File }, options) =>
    roomsService.uploadImage(id, file, options),
);
```

Factory tự chuyển token người dùng và AbortSignal vào service, chuẩn hóa lỗi bằng rejectWithValue. Thêm pending/fulfilled/rejected vào slice nếu cần lưu trạng thái upload dùng chung. File/FormData chỉ dùng làm đối số yêu cầu, không lưu vào Redux state. Với file input: đọc `event.target.files?.[0]` rồi truyền vào thunk.

## 6. Authentication

Một StoreProvider giữ một store ổn định bằng lazy useState. Không export store singleton trên server. Đây là cách áp dụng nguyên tắc store theo instance/request trong [hướng dẫn Redux Toolkit cho Next.js](https://redux-toolkit.js.org/usage/nextjs).

Login nhận `{ user, token }`. Redux chỉ lưu các field profile đã chọn cùng token; logout reset mọi slice để không giữ dữ liệu tài khoản trước. Phiên hiện chỉ sống trong bộ nhớ. Chưa có endpoint refresh/me trong Swagger để tự xây luồng khôi phục phiên đáng tin cậy.

RequireAuth dùng cho trải nghiệm điều hướng. Khi phát triển thành sản phẩm thực, cần session được kiểm chứng phía server và phân quyền backend, không dựa vào giá trị role phía client.
