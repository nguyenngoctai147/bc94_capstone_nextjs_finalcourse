# Cấu trúc theo cách học React, mở rộng cho Next.js

Source đã áp dụng mẫu của ListMovie, Movie, FormValidation, services/api.js và store/index.js được cung cấp. Giữ luồng dễ lần theo: component → dispatch thunk → service/API → slice → render dữ liệu.

## Đối chiếu với bài đã học

| Bài React | File tương ứng trong source |
| --- | --- |
| `ListMovie/index.jsx`: dispatch trong useEffect, selector và renderListMovie | `app/features/rooms/components/RoomList.tsx` và các section trong `features/home/components/` |
| `Movie.jsx`: component nhận movie qua props | `app/components/ui/CardRoom.tsx`, nhận room, search và variant |
| `ListMovie/slice.js`: createAsyncThunk + createSlice cùng file | `app/features/rooms/rooms.slice.ts`; các feature locations/bookings/users/reviews có cùng cách trình bày |
| `FormValidation/index.jsx`: state dữ liệu/lỗi, onChange/onBlur/onSubmit | `app/hooks/useForm.ts` và `features/auth/components/LoginForm.tsx`, `RegisterForm.tsx` |
| `services/api.js`: Axios dùng chung | `app/services/api.ts` |
| `store/index.js`: configureStore và các reducer | `app/store/index.ts`, được gắn vào React bằng `app/providers/StoreProvider.tsx` |

## Cấu trúc một feature

```text
app/features/rooms/
  rooms.types.ts               model và dữ liệu gửi API
  rooms.service.ts             endpoint và request của phòng
  rooms.slice.ts               thunk, initialState, createSlice và reducer
  location-rooms.slice.ts       trạng thái riêng của phòng theo vị trí
  room-list.utils.ts           hàm filter/sort thuần
  room-amenities.ts             danh mục tiện nghi dùng chung
  components/
    RoomList.tsx               component cha: Redux, state, effects, handlers
    RoomFilters.tsx            component con: props, callback, state mở/đóng
    RoomDetail.tsx             tải và hiển thị phòng theo id
    CreateRoomPage.tsx         form quản trị tạo phòng theo schema API
```

CSS không nằm rải trong từng folder component. Source CSS của ứng dụng được chia tại `app/css/base`, `app/css/features` và `app/css/examples`. Component vẫn import file `.module.css` của feature qua alias để giữ phạm vi class và để Next.js chỉ tải CSS cần cho route. CSS nguyên bản của template nằm trong `public/assets` vì các file đó còn phụ thuộc đường dẫn tương đối tới ảnh, font và plugin.

Các file `<feature>.thunks.ts` riêng và factory tự sinh thunk/slice đã được bỏ. Mở một file `.slice.ts` là có thể xem request, state và ba nhánh xử lý của Redux. `store/request-state.ts` chỉ chứa các type, giá trị ban đầu và hàm nhỏ dùng chung để tránh lặp việc đặt trạng thái request.

## Thứ tự đọc một component

1. Imports và type props.
2. Destructuring props, useAppDispatch/useAppSelector.
3. useState cho dữ liệu giao diện.
4. useEffect tải dữ liệu và cleanup.
5. Các hàm handleChange/handleReset/handleSubmit.
6. Hàm render danh sách hoặc trạng thái.
7. JSX return, truyền props cho component con.

RoomList dùng `renderRoomList()` để map phòng thành CardRoom giống `renderListMovie()` map phim thành Movie. Khi cần loading/error/empty, xử lý bằng các nhánh if rõ ràng trước khi map.

```tsx
useEffect(() => {
  const task = dispatch(fetchRooms());
  return () => task.abort();
}, [dispatch]);

const renderRoomList = () => {
  return visibleRooms.map((room) => (
    <CardRoom key={room.id} room={room} search={search} variant="list" />
  ));
};
```

`[dispatch]` và cleanup là phần bổ sung cho mẫu bài học: dependencies đầy đủ và request bị hủy khi component rời trang. Với phòng chi tiết, thêm id vào dependencies.

## Props và state

RoomList giữ `filters`, `sortOrder`, `page`. RoomFilters nhận `values`, `onChange`, `onReset`, `disabled` và giá cao nhất qua props. Khi checkbox/select thay đổi, component con gọi callback; cha cập nhật filters và đưa page về 1. State mở/đóng bộ lọc chỉ dùng trong RoomFilters.

CardRoom chỉ trình bày một phòng. Dữ liệu tải từ API không nằm trong thẻ. Variant list/grid giúp dùng lại cùng thẻ ở trang chủ và danh sách. Các component Input/Select/Textarea nhận label/value/error và event handler nên có thể dùng cho login, register, hồ sơ và form minh họa.

## Redux Toolkit và thunk

Trong rooms.slice.ts, `fetchRooms` gọi roomsService.list trong try/catch. `rejectWithValue(toApiError(error))` trả lỗi dạng dữ liệu thuần thay vì đưa toàn bộ AxiosError vào Redux. extraReducers viết rõ addCase cho pending, fulfilled và rejected.

State bài ListMovie có loading/data/error cho một request. Project này có danh sách, chi tiết và thao tác ghi cùng lúc, nên tách `requests.list`, `requests.detail`, `requests.create`, ...:

| Mẫu đã học | Trong project |
| --- | --- |
| data của danh sách | `state.rooms.items` |
| data chi tiết | `state.rooms.selected` |
| loading | `state.rooms.requests.list.status === "loading"` |
| error | `state.rooms.requests.list.error` |
| action tải danh sách | `fetchRooms()` |

requestId giúp phản hồi cũ không ghi đè yêu cầu mới. Các hàm startRequest/finishRequest/failRequest là nơi dùng lại quy tắc này. Khi ghi thành công, invalidated được bật để component tải lại danh sách; tránh giả định API luôn trả về một bản ghi đầy đủ.

useAppDispatch/useAppSelector là phiên bản có type của useDispatch/useSelector; cách dùng vẫn tương tự bài React. Store đăng ký từng reducer rõ ràng bằng configureStore. Next.js dùng makeStore theo Provider để dữ liệu của mỗi lần render server được tách riêng.

## Form validation

useForm giữ values/errors/submitting bằng useState. handleChange dùng destructuring name/value và spread để cập nhật field. handleBlur kiểm tra field; handleSubmit chặn submit mặc định, kiểm tra toàn bộ form và focus field sai đầu tiên. Khi đang gửi, submitLock và submitting ngăn gửi lặp.

Trong LoginForm có hàm handleLogin; RegisterForm có handleRegister; hồ sơ có handleSaveProfile. JSX chỉ gắn handler đã khai báo. Mỗi input hiển thị rõ name, value, error, onChange và onBlur. Rule validation nằm trong schema: required, email, minLength, số điện thoại, ngày hợp lệ hoặc rule tùy chỉnh xác nhận mật khẩu.

Trang `/ui` có form minh họa để thử validation và reset mà không gửi API. Phần tên label/id của input được component dùng chung nối đúng qua useId và ARIA.

## Axios và phần riêng của Next.js

Axios được tạo một lần trong services/api.ts. Domain service gọi api.get/post/put/delete và xử lý endpoint riêng. api trả phần content đã chuẩn hóa; component/thunk không phải tự đọc result.data.content ở mọi nơi.

Token phiên được thunk lấy từ getState tại thời điểm request; không giữ một token cũ được đọc lúc import file. tokenCybersoft của cấu hình được proxy server thêm từ môi trường. Code mẫu API đã học được tham khảo cách tổ chức, không chép token vào source client.

Route vẫn do thư mục app quyết định; dùng next/link thay react-router-dom. Component có hook/event cần use client. Params/searchParams động được await theo tài liệu Next.js của project. TypeScript bổ sung type cho props, model và thunk; code xử lý vẫn là các hàm và cú pháp ES6.

## Mở rộng dần

Với module mới, bắt đầu từ model → service list → thunk fetch → slice → component cha/con → route. Thêm form và thunk create/update khi UI có nhu cầu. Dùng rooms/locations làm mẫu, request-state/useForm/UI primitives làm phần dùng lại.

Khi tăng chức năng, giữ state UI cục bộ và state API dùng chung trong Redux; tách một component khi nó có trách nhiệm riêng hoặc được dùng nhiều nơi. Validation và trạng thái lỗi được bổ sung cùng chức năng. Các phần server/session/API policy hiện có tiếp tục làm nền cho luồng React này.

## Kiểm chứng sau refactor

- 50/50 tests đạt, bao gồm stale request, abort, lỗi API, reset store khi logout, bộ lọc kết hợp, phòng liên quan, payload thêm phòng và sort không sửa mảng Redux.
- Typecheck, lint và production build mặc định với Turbopack đều đạt.
- Production server trả HTTP 200 cho trang chủ, danh sách/chi tiết phòng, đặt phòng, đăng nhập và dashboard.
- Browser: lọc 2 phòng ngủ + Wi-Fi trả 10 kết quả tại thời điểm kiểm tra, giá tăng đúng; mở/reset bộ lọc trên mobile 390px hoạt động và không tràn ngang.
- Form minh họa `/ui`: kiểm tra required, email, onChange/onBlur, focus field lỗi đầu tiên, submit hợp lệ và reset. Form này không gọi backend.
- Chưa thực hiện thao tác ghi lên backend thật trong đợt kiểm tra này.
