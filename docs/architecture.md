# Ghép giao diện và mở rộng source

## 1. Đặt giao diện tĩnh vào đúng lớp

1. Tách header/footer/sidebar thành component trong `templates/` hoặc `component/navigation/`.
2. Chuyển HTML phần nội dung thành component trong `features/<nghiep-vu>/components/`.
3. Page trong `app/` chỉ import và render component nghiệp vụ.
4. Đổi `class` thành `className`, `for` thành `htmlFor`; đóng thẻ JSX; đổi inline style thành object.
5. Dùng `Link` của Next.js cho chuyển trang và lấy URL từ `route/`.
6. Chép ảnh/font vào `public/assets/`. Ví dụ file `public/assets/images/room.jpg` có URL `/assets/images/room.jpg`.
7. Với ảnh local, có thể dùng `next/image` cùng width/height hoặc fill. Ảnh backend cần cấu hình `images.remotePatterns` cho host ảnh thực tế trong `next.config.ts`.
8. Tách CSS riêng vào `*.module.css` cạnh component. CSS toàn site import sau Bootstrap trong root layout.
9. Đổi `onclick`, jQuery, querySelector và script thao tác DOM sang React state/event. Chỉ thêm `"use client"` vào component cần hook, event hoặc browser API.

Không cần chuyển toàn bộ ứng dụng sang Client Component. Các layout và page mặc định là Server Component; ReduxProviders, BootstrapProviders, form và danh sách tương tác là Client Component.

`BootstrapProviders` nạp Bootstrap bundle phía client, khởi tạo Carousel/Tooltip theo `data-bs-*` và dispose instance khi chuyển route. CSS Bootstrap dùng package đã cài, không nạp lại qua CDN. Các plugin jQuery/Slick/Swiper của giao diện tĩnh vẫn được tải theo từng feature và cleanup riêng để không xung đột với dashboard. Tailwind dùng utilities với prefix `tw-` trong globals.css; Preflight đã tắt để dùng cùng Bootstrap/Hotux.

Header/footer Hotux nằm tại `app/component/navigation/`. `ClientTemplate` quản lý header, main, footer, skip link và liên kết về đầu trang. `PageTemplate` dùng lại `ClientTemplate`, thêm tiêu đề và breadcrumb. Layout cha `(client)/layout.tsx` chỉ passthrough. Dùng `content="bare"` khi component nghiệp vụ đã có section/container, tránh lồng container và tăng gutter hai lần. CSS legacy được `BootstrapProviders` khai báo từ `public/assets/css`; JS legacy chỉ tải khi component thực sự cần plugin đó. About, Contact, Blog, RoomList và dashboard hiện không cần JS legacy.

`features/home/components/HomePage.tsx` là nội dung chung cho hai route trang chủ. Parent này tải phòng và vị trí; các section con đọc cùng state và giữ hành vi thử lại. Không import một `page.tsx` từ route khác để tái sử dụng nội dung.

`features/rooms/components/RoomList.tsx` nhận `locationId` tùy chọn và `search`. Toàn bộ phòng dùng `rooms.requests.list`; phòng theo vị trí dùng slice riêng `locationRooms` để giữ kiểm tra request cũ. Lịch trống được tải bằng service vào state cục bộ, không ghi đè danh sách đặt phòng của tài khoản. `CardRoom` dùng hai kiểu list/grid và giữ ngày, số khách trong URL. Tiện nghi dùng chung từ `features/rooms/room-amenities.ts`.

## 2. Quản lý route và menu

`app/(client)/rooms/[id]/page.tsx` tạo URL `/rooms/123` và kế thừa `rooms/layout.tsx`. Tên `(client)` không nằm trong URL. Route thực tế vẫn do thư mục `app/` quyết định; `app/route/` chỉ là registry để các component dùng cùng một URL.

Các route được tách theo phạm vi:

- `route/client.ts`: trang public và route chi tiết phòng.
- `route/auth.ts`: đăng nhập và đăng ký.
- `route/admin.ts`: các trang quản trị.
- `route/navigation.ts`: menu header, menu client và menu admin.
- `route/match.ts`: kiểm tra active route, bao gồm alias `/trang-chu`.
- `route/web.ts`: các hằng số URL dạng `HOME_PAGE`, `ROOMS_PAGE` để tra cứu nhanh.
- `route/webSeo.ts`: danh sách route cần dùng cho metadata/SEO.
- `route/index.ts`: facade `routes` tương thích với code hiện tại và các export theo nhóm.

```tsx
import Link from "next/link";
import { clientRoutes } from "@/route";

<Link href={clientRoutes.rooms.detail(123)}>Chi tiết phòng</Link>
```

Khi thêm trang, tạo `page.tsx` đúng thư mục, thêm URL vào nhóm route tương ứng, rồi thêm một `NavItem` vào `navigation.ts`. Header Hotux dùng `hotuxNavigation`; sidebar admin lấy tên/URL từ `adminNavigation`, còn `component/admin/admin-navigation.ts` chỉ bổ sung icon. `isRouteActive` kiểm tra theo ranh giới segment để tránh `/rooms` và `/rooms-other` trùng nhau.

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

1. Tạo `store/type/amenities/index.ts`.
2. Thêm endpoint Swagger vào `route/core.api.ts` và endpoint local tương ứng vào `route/next.api.ts`.
3. Tạo `app/api/amenities/[[...path]]/route.ts`, dùng helper trong `app/api/_shared/proxy-route.ts`, rồi thêm policy chính xác vào `services/proxy.ts`.
4. Tạo service bằng `createCrudService<Amenity, CreateAmenity, UpdateAmenity>(nextApi.amenities.base)`.
5. Tạo `store/thunk/amenities/index.ts`, khai báo `fetchAmenities` bằng `createAsyncThunk` và gọi service trong try/catch.
6. Tạo `store/slice/amenities/index.ts`, viết rõ addCase pending/fulfilled/rejected và dùng `store/request-state.ts`.
7. Tạo `store/reducer/amenities/index.ts`, đăng ký tại `store/reducer/index.ts`, rồi thêm component/page/menu.

Lấy `features/locations/` làm mẫu. Các service import `nextApi` từ `route/next.api.ts` thay vì viết chuỗi URL hoặc gọi trực tiếp endpoint Swagger. Nếu API khác chuẩn CRUD, override phương thức trong service như users.remove (query string) hoặc bookings.list (theo người dùng). Hàm tạo CRUD service chỉ dùng cho HTTP chung; logic riêng nằm trong domain service.

Tài nguyên mới chỉ bật `{ patch: true }` sau khi backend có endpoint PATCH và đã cập nhật policy proxy.

## 4. Nối form với store

```tsx
"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createRoom, fetchRooms, fetchRoomDetail } from "@/store/thunk/room";
import type { CreateRoom } from "@/store/type/room";

// Bên trong component:
const dispatch = useAppDispatch();
const request = useAppSelector((state) => state.rooms.requests.create);

async function save(values: CreateRoom) {
  const result = await dispatch(createRoom(values));
  if (createRoom.fulfilled.match(result)) {
    await dispatch(fetchRooms());
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
  const task = dispatch(fetchRoomDetail(id));
  return () => task.abort();
}, [dispatch, id]);
```

## 5. Thunk tùy chỉnh cho endpoint đặc biệt

```ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiThunkConfig } from "@/store/type/request";
import { toApiError } from "@/services/api-utils";
import { roomsService } from "@/features/rooms/rooms.service";

export const uploadRoomImage = createAsyncThunk<unknown, { id: number; file: File }, ApiThunkConfig>(
  "rooms/uploadImage",
  async ({ id, file }, { getState, signal, rejectWithValue }) => {
    try {
      return await roomsService.uploadImage(id, file, { signal, token: getState().auth.token });
    } catch (error) {
      return rejectWithValue(toApiError(error));
    }
  },
);
```

Thunk truyền token người dùng và AbortSignal vào service, chuẩn hóa lỗi bằng rejectWithValue. Thêm pending/fulfilled/rejected vào slice nếu cần lưu trạng thái upload dùng chung. File/FormData chỉ dùng làm đối số yêu cầu, không lưu vào Redux state. Với file input: đọc `event.target.files?.[0]` rồi truyền vào thunk.

## 6. Authentication

ReduxProviders giữ một store ổn định bằng lazy useState. Không export store singleton trên server. Đây là cách áp dụng nguyên tắc store theo instance/request trong [hướng dẫn Redux Toolkit cho Next.js](https://redux-toolkit.js.org/usage/nextjs).

Login nhận `{ user, token }`. Redux và session cookie chỉ lưu profile đã whitelist cùng token trong tối đa 30 ngày hoặc đến khi đóng hẳn phiên trình duyệt. Cookie dùng chung giữa các tab trong cùng phiên. Logout xóa phiên và reset state riêng tư; danh mục phòng/vị trí công khai được giữ lại. `ReduxProviders` khôi phục phiên sau hydration; xem `docs/auth-session.md`. Chưa có endpoint refresh/me trong Swagger để tự kiểm chứng lại phiên phía server.

Guard `RequireAuth role="ADMIN"` đặt một lần tại layout admin. Các page bên dưới chỉ render nội dung. `ResourcePanel` là bảng đọc dùng chung cho năm tài nguyên; không tự tạo chức năng ghi khi chưa có form và validation tương ứng.

RequireAuth dùng cho trải nghiệm điều hướng. Khi phát triển thành sản phẩm thực, cần session được kiểm chứng phía server và phân quyền backend, không dựa vào giá trị role phía client.
