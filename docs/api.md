# Tích hợp Swagger CyberSoft

Đã đọc [Swagger UI](https://airbnbnew.cybersoft.edu.vn/swagger/index.html) và [Swagger JSON](https://airbnbnew.cybersoft.edu.vn/swagger/v1/swagger.json) ngày 2026-09-12. Bản đối chiếu nằm trong `swagger.snapshot.json`.

Base URL: `https://airbnbnew.cybersoft.edu.vn/api`.

## Method theo backend

| Tài nguyên | Danh sách | Chi tiết | Tạo | Cập nhật | Xóa |
| --- | --- | --- | --- | --- | --- |
| /phong-thue | GET / | GET /{id} | POST / | PUT /{id} | DELETE /{id} |
| /vi-tri | GET / | GET /{id} | POST / | PUT /{id} | DELETE /{id} |
| /dat-phong | GET / | GET /{id} | POST / | PUT /{id} | DELETE /{id} |
| /users | GET / | GET /{id} | POST / | PUT /{id} | DELETE /?id={id} |
| /binh-luan | GET / | Không có | POST / | PUT /{id} | DELETE /{id} |

Các dấu / ở bảng là tương đối so với đường dẫn tài nguyên. **Không có PATCH trong Swagger.** `api.patch` có sẵn ở tầng HTTP để mở rộng, nhưng proxy và CRUD service hiện báo lỗi 405. Không thay bằng PUT với payload thiếu field.

## Endpoint bổ sung đã có service

- `authService.login`: POST /auth/signin.
- `authService.register`: POST /auth/signup; form đăng ký cố định role USER.
- `roomsService.search`, `locationsService.search`, `usersService.search`: GET /{resource}/phan-trang-tim-kiem, query pageIndex/pageSize/keyword.
- `roomsService.byLocation`: GET /phong-thue/lay-phong-theo-vi-tri?maViTri=...
- `bookingsService.byUser`: GET /dat-phong/lay-theo-nguoi-dung/{MaNguoiDung}.
- `reviewsService.byRoom`: GET /binh-luan/lay-binh-luan-theo-phong/{MaPhong}.
- `usersService.byName`: GET /users/search/{TenNguoiDung}.
- `roomsService.uploadImage`: POST /phong-thue/upload-hinh-phong?maPhong=...
- `locationsService.uploadImage`: POST /vi-tri/upload-hinh-vitri?maViTri=...
- `usersService.uploadAvatar`: POST /users/upload-avatar.

### Chọn vị trí và đặt phòng

Trang chủ tải `GET /vi-tri` để hiển thị các điểm đến. Thẻ điểm đến và ô tìm kiếm dẫn tới `/rooms?maViTri=<id>`. Trang kết quả gọi `GET /vi-tri/{id}` để hiển thị tên vị trí và `GET /phong-thue/lay-phong-theo-vi-tri?maViTri=<id>` để lấy toàn bộ phòng của vị trí đó. Kết quả có sắp xếp và nút xem thêm; trạng thái rỗng hoặc lỗi API không hiển thị phòng mẫu.

Nút đặt trên mỗi phòng mở `/reservation/availability?maPhong=<id>`. Sau khi khách chọn ngày và số người, bước tiếp theo lấy chi tiết phòng đó rồi kiểm tra đơn đặt trước khi xác nhận. `POST /vi-tri` trong Swagger dùng để **tạo vị trí**, không dùng cho thao tác khách chọn vị trí.

Upload dùng **FormData**, tên field **formFile**. Không tự gán Content-Type multipart/form-data; browser phải thêm boundary. Proxy chuyển tiếp byte và Content-Type nguyên vẹn.

Với rooms/locations/users, gọi thunk.list có query sẽ chọn endpoint phân trang; không truyền query sẽ tải danh sách thường. Với bookings, truyền `{ maNguoiDung: user.id }` để dùng endpoint theo người dùng.

## Registry endpoint

Đường dẫn được quản lý tập trung trong `app/route/` và chia thành ba lớp:

- `core.api.ts`: hằng số `CORE_*` và `coreApi`, phản ánh endpoint backend trong Swagger.
- `next.api.ts`: hằng số `NEXT_*` và `nextApi`, phản ánh Route Handler local mà browser được phép gọi.
- `web.ts`: URL page của website, chỉ dùng cho điều hướng và liên kết.
- `apiNotToken.ts`: danh sách endpoint backend không cần token phiên người dùng.

Service của feature chỉ import `nextApi`. Route Handler trong `app/api` import `coreApi` hoặc `CORE_*`, nhờ đó component không biết URL backend thật và `tokenCybersoft` không đi vào client bundle.

## Gọi qua store

```ts
await dispatch(roomsThunks.list({ pageIndex: 1, pageSize: 9, keyword: "biển" }));
await dispatch(roomsThunks.detail(123));
await dispatch(roomsThunks.create(roomDto));
await dispatch(roomsThunks.update({ id: 123, data: fullRoomDto }));
await dispatch(roomsThunks.remove(123));

// Có sẵn khung PATCH, nhưng hiện trả lỗi 405 do backend chưa hỗ trợ:
await dispatch(roomsThunks.patch({ id: 123, data: { wifi: true } }));

// Endpoint xóa users thực tế là DELETE /users?id=123:
await dispatch(usersThunks.remove(123));
```

PUT sử dụng DTO đầy đủ. Create DTO bỏ id; update DTO cũng bỏ id vì id nằm trên path. Users update không có password theo Swagger. Các field còn lại dùng tên backend (tenPhong, ngayDen, maNguoiDung...) để dễ đối chiếu.

## Gọi Axios service trực tiếp

```ts
import { roomsService } from "@/features/rooms/rooms.service";

const page = await roomsService.search(
  { pageIndex: 1, pageSize: 10, keyword: "" },
  { signal: controller.signal, token: userToken },
);

await roomsService.uploadImage(roomId, file, { token: userToken });
```

Service phía browser gọi các endpoint local `/api/<resource>` từ `next.api.ts`; không gọi service browser này trực tiếp trong Server Component. Nếu cần SSR data fetching, thêm service server riêng với cấu hình server và quyền phù hợp. Không export env bí mật từ module dùng chung cho client.

Lớp HTTP phía client tại `services/http.ts` cung cấp `api.get/post/put/patch/delete<T>`, query, signal và token; adapter unwrap `{statusCode, content}`. Lớp server tại `services/api.ts` là Axios instance cấu hình `API_BASE_URL` và tự thêm `tokenCybersoft`; Axios có sẵn GET, POST, PUT, PATCH, DELETE. `proxy.ts` giữ policy và chuyển tiếp request. DELETE 204 không buộc phải có JSON.

## Proxy và token

Browser → `/api/room` → Route Handler room → `coreApi.room.base` → `API_BASE_URL + /phong-thue`.

- **tokenCybersoft**: lấy từ CYBERSOFT_TOKEN trên server, không nằm trong client bundle.
- **token**: token đăng nhập người dùng được thunk lấy từ Redux và gửi qua header đúng tên Swagger.
- Chỉ relay các path/method đã cho phép; chặn traversal, URL tùy ý, redirect upstream và mutation khác Origin.
- Không relay cookie hoặc response header nhạy cảm. Response đặt Cache-Control: no-store.
- Timeout phía server lấy từ env; Axios browser timeout 20 giây. Nếu tăng API_TIMEOUT_MS vượt 20 giây, đồng thời điều chỉnh client timeout.
- Giới hạn request chuyển tới backend 10 MB, response 20 MB. Khi triển khai, thêm giới hạn upload/body ở reverse proxy để chặn trước khi đọc body vào bộ nhớ.

Đây là proxy phục vụ scaffold, không thêm phân quyền backend. TokenCybersoft là khóa truy cập dịch vụ, không thay thế việc kiểm tra quyền tài khoản.

## Giới hạn xác minh

Swagger hiện chỉ khai báo request model và response 200 không có schema. Các kiểu response user/token, content và phân trang đã được tách riêng để chỉnh khi có response thật. Model RoomReview là adapter dự kiến cho endpoint bình luận theo phòng.

Không có tokenCybersoft trong phiên thiết lập nên chưa xác minh end-to-end với backend thật, đơn vị tiền, rule availability, hay quyền trên các API ghi. Test dùng mock/local server, không tạo hoặc xóa dữ liệu thật.
