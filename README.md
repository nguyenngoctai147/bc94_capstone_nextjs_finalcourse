# Hotux — Đặt phòng & quản lý lưu trú

Source dùng Next.js **16.3.5 App Router**, React 19, TypeScript strict, Bootstrap **5.2.3** (phiên bản có sẵn trong project), Redux Toolkit, React Redux và Axios. Mục tiêu là khung để ghép giao diện HTML/CSS/JS của bạn, chưa phải sản phẩm hoàn chỉnh.

Tailwind CSS **3.4** cũng đã được cấu hình để dùng song song với Bootstrap/Hotux. Chỉ utilities được build và có prefix bắt buộc `tw-`, ví dụ `tw-flex tw-flex-col tw-justify-center`. Preflight/global reset của Tailwind đã tắt, nên các style Bootstrap và giao diện tĩnh không bị Tailwind ghi đè. Với variants dùng `md:tw-flex-row` hoặc `hover:tw-bg-slate-800`.

## Chạy project

Yêu cầu Node.js 22+ (đã kiểm thử bằng Node 24).

```bash
npm install
npm run dev
```

File `.env.local` đã được tạo từ `.env.example` nếu chưa tồn tại. Khi clone sang máy khác, copy file mẫu:

```powershell
Copy-Item .env.example .env.local
```

Điền **CYBERSOFT_TOKEN** trong `.env.local`, rồi khởi động lại dev server:

```dotenv
API_BASE_URL=https://airbnbnew.cybersoft.edu.vn/api
SWAGGER_URL=https://airbnbnew.cybersoft.edu.vn/swagger/index.html
CYBERSOFT_TOKEN=token_cua_ban
API_TIMEOUT_MS=15000
```

`API_BASE_URL` là địa chỉ API, bao gồm `/api`. Không dùng URL trang Swagger làm base URL.
`SWAGGER_URL` chỉ lưu đường dẫn tài liệu để tra cứu; ứng dụng không tự suy ra endpoint từ trang Swagger.
Không thêm tiền tố `NEXT_PUBLIC_` cho tokenCybersoft. File `.env.local` đã được Git bỏ qua; `.env.example` được phép commit.

Thiếu cấu hình không làm build thất bại. Khi gọi API, giao diện hiển thị thông báo lỗi cấu hình (HTTP 503).

## Các trang có sẵn

| URL | Layout / nội dung |
| --- | --- |
| `/`, `/trang-chu` | ClientTemplate, trang chủ Hotux |
| `/rooms`, `/rooms/[id]` | PageTemplate, danh sách/chi tiết phòng và form đặt phòng |
| `/bookings` | PageTemplate, đặt phòng theo người dùng đã đăng nhập |
| `/account` | PageTemplate, thông tin tài khoản |
| `/blog`, `/gioi-thieu`, `/lien-he`, `/ui` | PageTemplate cho các trang nội dung |
| `/login`, `/register` | AuthTemplate, form có validation |
| `/admin` | AdminTemplate, tổng quan từ dữ liệu API, yêu cầu ADMIN |
| `/admin/rooms`, `/admin/bookings`, `/admin/locations`, `/admin/users`, `/admin/reviews` | Danh sách API, tìm trong danh sách, phân trang và làm mới; yêu cầu ADMIN |
| `/admin/rooms/add` | Form Bootstrap thêm phòng, chọn vị trí và tiện nghi; yêu cầu ADMIN |
| `/admin/slider`, `/admin/bookings/add`, `/admin/users/detail` | Trang minh họa có thông báo rõ; chưa lưu lên backend |
| `/ui` | Xem và thử component Bootstrap, form mẫu không gửi API |
| `/api/auth/signin`, `/api/auth/signup`, `/api/auth/signout` | Route Handler xác thực |
| `/api/room`, `/api/booking`, `/api/location`, `/api/user`, `/api/profile`, `/api/reviews` | BFF theo từng tài nguyên, proxy an toàn tới CyberSoft |

## Cấu trúc

```text
app/
  layout.tsx                 # RootLayout + AppProviders
  globals.css                # Theme chung
  (client)/                  # Route group không xuất hiện trên URL
    layout.tsx               # passthrough để tách layout theo nhánh
    page.tsx                  # /, bọc ClientTemplate
    trang-chu/layout.tsx      # ClientTemplate cho /trang-chu
    trang-chu/page.tsx
    rooms/layout.tsx          # PageTemplate, rooms/[id] kế thừa
    rooms/page.tsx
    rooms/[id]/page.tsx
    bookings/layout.tsx       # PageTemplate
    bookings/page.tsx
    account/layout.tsx        # PageTemplate
    account/page.tsx
    blog/layout.tsx, ...      # PageTemplate cho các trang nội dung
  (auth)/                    # AuthTemplate: login, register
  (admin)/admin/             # AdminTemplate và các trang quản lý
  @modal/                    # Parallel route và modal box dùng chung
  api/                       # Route Handler chia theo auth và tài nguyên
    auth/                    # signin, signup, signout
    room/, booking/          # API phòng và đặt phòng
    location/, user/         # API vị trí và người dùng
    profile/, reviews/       # API hồ sơ và đánh giá
    _shared/                 # Helper proxy dùng chung, không tạo URL
  loading.tsx / error.tsx / not-found.tsx
  commons/
    validation/              # Hàm validation thuần
    legacy/                  # Bộ nạp script legacy có kiểm soát
  component/
    ui/                      # Button, Input, Select, Textarea, Card...
    auth/                    # RequireAuth
    navigation/              # HotuxHeader, HotuxFooter, menu tài khoản
    admin/                   # Khung bảng danh sách
    examples/                # Bộ component minh họa
  templates/                 # AdminTemplate, AuthTemplate, ClientTemplate, PageTemplate
  constants/
    site.ts                  # Thông tin website dùng chung
  route/
    core.api.ts              # Endpoint backend lấy từ Swagger
    next.api.ts              # Endpoint Route Handler local
    web.ts                   # Hằng số URL của website
    apiNotToken.ts           # Endpoint auth không cần token phiên
    *.ts                     # Route page, SEO và navigation
  features/
    <feature>/
      *.service.ts           # Gọi endpoint + Axios
      components/            # UI riêng theo nghiệp vụ
  hooks/                     # useForm và custom React hooks
  provider/                  # App, Bootstrap và Redux Providers
  services/
    http.ts                  # Axios phía client gọi Route Handler nội bộ
    api.ts                   # Axios server kết nối backend Swagger
    proxy.ts                 # Proxy dùng chung cho Route Handler
    crud.ts                  # CRUD service dùng chung
    api-utils.ts             # Config, lỗi và response API
  store/
    reducer/<domain>/        # Reducer theo domain và reducer gốc
    slice/<domain>/          # createSlice + pending/fulfilled/rejected
    thunk/<domain>/          # createAsyncThunk gọi domain service
    type/<domain>/           # Model, DTO và state type
    index.ts                 # makeStore, không tạo store singleton
    hooks.ts                 # Typed Redux hooks
    request-state.ts         # Request-state helpers dùng lại
  theme/                     # CSS nền tảng và CSS Module theo feature
  types/                     # Kiểu dữ liệu dùng chung
public/assets/
  images/                    # URL /assets/images/...
  fonts/
  legacy/                    # Lưu asset cũ để chuyển đổi dần; không tự chạy JS
docs/
  architecture.md            # Cách ghép HTML và thêm module
  api.md                     # Mapping Swagger, giới hạn, ví dụ CRUD/upload
  swagger.snapshot.json      # Swagger gốc đối chiếu ngày 2026-09-12
tests/                       # Test validation, Axios, thunk/slice, proxy
```

Giữ `app/` ở thư mục gốc để tiếp nối source khởi tạo. Alias `@/*` ưu tiên `app/*`, sau đó mới đến gốc project. Các trang chỉ lắp ráp component; logic nghiệp vụ nằm trong `features/`. `PageTemplate` dùng `ClientTemplate` để website chỉ có một header, một main và một footer.

`HomePage` là nội dung dùng chung cho `/` và `/trang-chu`, đồng thời tải danh sách phòng/vị trí một lần cho các section con. `/rooms` dùng cùng `RoomList` cho toàn bộ danh mục và truy vấn theo vị trí; bộ lọc, sắp xếp và phân trang áp dụng trên danh sách API đã tải. Không dùng phòng mẫu khi API lỗi hoặc chưa có dữ liệu.

Source áp dụng cách trình bày đã học trong React nhưng mở rộng theo domain: thunk, slice, reducer và type nằm ở các nhánh riêng trong `app/store`. Component cha tải dữ liệu, component con nhận props, state UI dùng useState và form có các hàm handleChange/handleBlur/submit riêng. Xem [hướng dẫn study và thứ tự đọc code](docs/study-architecture.md).

## Luồng dữ liệu

```text
Client Component
  → dispatch(thunk)
  → service → Axios /api/<resource>
  → Route Handler của resource → core.api.ts
  → proxy server → Axios + tokenCybersoft → CyberSoft
  → unwrap content → thunk fulfilled/rejected → slice → useAppSelector → UI
```

Từng tài nguyên có `list, detail, create, update, patch, remove`. Mỗi thao tác có trạng thái riêng ở `requests`: `idle / loading / succeeded / failed`, `error`, `requestId`. Phản hồi cũ không ghi đè yêu cầu mới; cleanup ở component hủy request bằng `.abort()`.

Sau thêm/sửa/xóa, `invalidated = true`; component nên gọi lại `list` để đồng bộ dữ liệu chính xác. Không tự giả định write response luôn là một bản ghi đầy đủ.

Ví dụ component: `features/rooms/components/RoomList.tsx`.
Ví dụ form gọi API: `features/bookings/components/BookingForm.tsx`.

## Component và validation

Import từ `@/component/ui`:

- `Button`: variant, size, loading, disabled; mặc định `type="button"`.
- `Input`, `Select`, `Textarea`: label, error, thuộc tính HTML; nối label và thông báo lỗi qua ARIA.
- `LoadingSpinner`, `Card`, `Alert`, `EmptyState`, `Pagination`.

Bootstrap CSS được import một lần, trước CSS của bạn. Các component mẫu dùng React để quản lý trạng thái; chưa import toàn bộ Bootstrap JS. Nếu ghép modal/dropdown cũ dùng `data-bs-*`, cần chuyển hành vi sang React hoặc khởi tạo đúng plugin Bootstrap ở `useEffect` và dispose khi unmount. Không import Bootstrap JS tại Server Component.

`useForm` hỗ trợ kiểm tra khi blur/submit, kiểm tra lại khi sửa lỗi, focus ô sai đầu tiên, chặn submit lặp và reset. Có rule required, email, minLength, phone, positiveInteger, validDate; thêm rule tùy ý bằng hàm trả về thông báo lỗi hoặc `undefined`.

Form đăng ký kiểm tra xác nhận mật khẩu. Form đặt phòng kiểm tra ngày hợp lệ, ngày trả sau ngày nhận, không nhận phòng ở quá khứ và số khách không vượt sức chứa. Đây là validation phía giao diện; backend vẫn phải kiểm tra quyền, dữ liệu, giá và phòng trống.

## Phạm vi đã dựng và phần cần nối tiếp

- Có service/thunk/slice CRUD cho phòng, đặt phòng, vị trí, người dùng, đánh giá; có service phân trang, tìm kiếm và upload theo Swagger.
- Axios hỗ trợ đủ **GET, POST, PUT, PATCH, DELETE**. **Swagger hiện không có PATCH**: service nghiệp vụ trả lỗi 405 rõ ràng; không tự thay PATCH bằng PUT. Đánh giá cũng không có GET chi tiết theo id. Xem `docs/api.md`.
- Trang quản trị đang có shell và bảng đọc dữ liệu. Bạn ghép form thêm/sửa/xóa từ giao diện tĩnh rồi nối vào thunk tương ứng.
- Login lưu user/token đã whitelist vào **Redux và session cookie**; phiên dùng chung giữa các tab, hết hạn sau tối đa 30 ngày hoặc khi đóng hẳn phiên trình duyệt. Chưa có refresh token hoặc cookie `HttpOnly`. Redux DevTools tắt mặc định để không ghi credential trong action metadata. Xem `docs/auth-session.md`.
- `RequireAuth` chỉ là guard giao diện. Backend phải xác thực và phân quyền trên từng endpoint. Proxy chỉ giới hạn path/method, giữ tokenCybersoft ở server và chuyển tiếp header `token`; nó chưa phải hệ thống session/authorization production. Đặc biệt Swagger có các endpoint users/dat-phong không khai báo user token; cần thống nhất bảo vệ backend trước triển khai thật.
- Swagger mô tả request nhưng không có response schema đầy đủ. Model phản hồi `content`, `user/token`, phân trang là adapter cần xác minh bằng token thật. Snapshot giúp đối chiếu khi backend thay đổi.
- Giao diện Hotux dùng asset có sẵn trong `public/assets`. Thông tin liên hệ mẫu được tập trung tại `app/constants/site.ts`; thay bằng thông tin doanh nghiệp trước khi xuất bản.
- Chưa gọi thao tác ghi vào backend thật. Test API dùng adapter/backend giả lập cục bộ.

## Kiểm tra

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

Test bao phủ 5 HTTP method, xóa users bằng query, tìm kiếm có phân trang, multipart upload, response 204, lỗi/thiếu cấu hình, giới hạn proxy, validation ngày/sức chứa, store độc lập, stale request, hủy request và logout.

Đọc tiếp: [Kiến trúc & ghép giao diện](docs/architecture.md) · [API & Swagger](docs/api.md) · [Rà soát source và giao diện](docs/source-review.md).
