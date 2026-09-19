# Stay — Khung Next.js cho đặt phòng & quản lý Airbnb

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
| `/admin` | AdminTemplate, trang điều hướng mẫu công khai |
| `/admin/rooms`, `/admin/bookings`, `/admin/locations`, `/admin/users`, `/admin/reviews` | Khung danh sách, yêu cầu vai trò ADMIN ở giao diện |
| `/ui` | Xem và thử component Bootstrap, form mẫu không gửi API |
| `/api/backend/[...path]` | Proxy server tới backend CyberSoft |

## Cấu trúc

```text
app/
  layout.tsx                 # Bootstrap CSS + StoreProvider
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
  api/backend/[...path]/     # Route Handler: Axios gọi backend
  loading.tsx / error.tsx / not-found.tsx
  components/
    ui/                      # Button, Input, Select, Textarea, Card...
    auth/                    # RequireAuth
    navigation/              # NavLinks, AccountMenu
    admin/                   # Khung bảng danh sách
    examples/                # Bộ component minh họa
  config/
    routes/                  # web.ts, webSeo.ts, domain routes, navigation
    endpoints/               # core.api.ts, next.api.ts, apiNotToken.ts, tài nguyên
  templates/                 # AdminTemplate, AuthTemplate, ClientTemplate
  features/
    <feature>/
      *.types.ts             # Model và DTO
      *.service.ts           # Gọi endpoint + Axios
      *.thunks.ts            # Async actions
      *.slice.ts             # State và reducer
      components/            # UI riêng theo nghiệp vụ
  lib/
    api/                     # HTTP, proxy, policy, response, lỗi, CRUD service
    validation/              # Hàm validation thuần
  store/                     # makeStore, typed hooks, CRUD factory, thunk factory
  providers/                 # StoreProvider theo từng instance, không singleton
  hooks/                     # useForm
  styles/                    # Hướng dẫn CSS
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

Giữ `app/` ở thư mục gốc để tiếp nối source khởi tạo. Alias `@/*` trỏ tới gốc project. Các trang chỉ lắp ráp component; logic nghiệp vụ nằm trong `features/`.

## Luồng dữ liệu

```text
Client Component
  → dispatch(thunk)
  → service → Axios /api/backend
  → Next.js Route Handler → Axios + tokenCybersoft → CyberSoft
  → unwrap content → thunk fulfilled/rejected → slice → useAppSelector → UI
```

Từng tài nguyên có `list, detail, create, update, patch, remove`. Mỗi thao tác có trạng thái riêng ở `requests`: `idle / loading / succeeded / failed`, `error`, `requestId`. Phản hồi cũ không ghi đè yêu cầu mới; cleanup ở component hủy request bằng `.abort()`.

Sau thêm/sửa/xóa, `invalidated = true`; component nên gọi lại `list` để đồng bộ dữ liệu chính xác. Không tự giả định write response luôn là một bản ghi đầy đủ.

Ví dụ component: `features/rooms/components/RoomList.tsx`.
Ví dụ form gọi API: `features/bookings/components/BookingForm.tsx`.

## Component và validation

Import từ `@/components/ui`:

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
- Login lưu user/token **trong bộ nhớ Redux**; reload trang sẽ cần đăng nhập lại. Chưa có refresh token, cookie session hoặc khôi phục phiên. Redux DevTools tắt mặc định để không ghi credential trong action metadata.
- `RequireAuth` chỉ là guard giao diện. Backend phải xác thực và phân quyền trên từng endpoint. Proxy chỉ giới hạn path/method, giữ tokenCybersoft ở server và chuyển tiếp header `token`; nó chưa phải hệ thống session/authorization production. Đặc biệt Swagger có các endpoint users/dat-phong không khai báo user token; cần thống nhất bảo vệ backend trước triển khai thật.
- Swagger mô tả request nhưng không có response schema đầy đủ. Model phản hồi `content`, `user/token`, phân trang là adapter cần xác minh bằng token thật. Snapshot giúp đối chiếu khi backend thay đổi.
- Chưa ghép bộ HTML/CSS/images riêng của bạn vì chúng chưa có trong repository. Các trang hiện tại là giao diện mẫu có thể thay thế.
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

Đọc tiếp: [Kiến trúc & ghép giao diện](docs/architecture.md) · [API & Swagger](docs/api.md).
