# Rà soát source và giao diện — 14/10/2026

Đây là báo cáo giai đoạn rà soát ban đầu. Source sau đó được tổ chức theo domain trong Redux; Axios phía ứng dụng và phía backend server được tách riêng. Cấu trúc hiện tại và thứ tự đọc code được trình bày tại [hướng dẫn study](study-architecture.md).

Kiến trúc chính phù hợp với ứng dụng hiện tại: route lắp ráp nội dung, feature giữ nghiệp vụ, service gọi API, thunk/slice quản lý trạng thái và UI dùng chung. Phần dư thừa tập trung ở giao diện mẫu, các luồng danh sách bị nhân đôi và CSS cũ.

## Phạm vi và cách kiểm tra

- Đọc quy tắc AGENTS.md và tài liệu Next.js 16.3.5 cài trong `node_modules/next/dist/docs/`.
- Lập đồ thị import/export TypeScript từ 44 file entry của App Router, kiểm tra các component không được route sử dụng và đối chiếu với tests/tài liệu trước khi xóa.
- Đọc các lớp API, store, session, route registry, template, giao diện public và các trang admin.
- Kiểm tra UI với dữ liệu đọc từ API trên trình duyệt, bao gồm desktop và viewport mobile 390px; không tạo, sửa hoặc xóa dữ liệu backend.
- Kiểm tra lint, TypeScript, regression tests và production build.

Số file `.ts`/`.tsx` trong `app/` giảm từ **179 xuống 171**; số entry route vẫn là **44**. Đã loại 12 file trùng hoặc không còn được dùng và thêm 4 file TypeScript có trách nhiệm rõ ràng: cấu hình thông tin site, nội dung trang chủ chung, dashboard dữ liệu thật và danh mục tiện nghi. CSS do ứng dụng quản lý được tập trung trong `app/theme` và vẫn dùng CSS Modules theo từng feature.

## Những vấn đề đã xử lý

| Vấn đề ban đầu | Kết quả |
| --- | --- |
| `/rooms` dùng phòng mẫu khi API đang tải/lỗi/rỗng; số lượng và sao đánh giá giả; nhiều bộ lọc không hoạt động | Chỉ hiển thị dữ liệu API; loading/error/empty rõ ràng. Bộ lọc phòng ngủ, giá, tiện nghi, sắp xếp và phân trang hoạt động |
| `RoomList` và `LocationRooms` lặp lại phần lớn layout và logic | Một RoomList nhận vị trí tùy chọn và ngày lưu trú; giữ slice riêng cho request theo vị trí |
| Thẻ phòng có ảnh/giá/nút đặt khác nhau giữa trang chủ và danh sách | CardRoom hỗ trợ list/grid, dùng ảnh thật và fallback, giữ mã phòng/ngày/số khách trong URL |
| Danh sách tiện nghi khai báo riêng ở từng màn hình | Một danh mục tiện nghi, key được giới hạn theo các field boolean của Room |
| Header/footer lặp ở ClientTemplate, PageTemplate và blog; `back-to-top` trùng ID; trang nội dung thiếu main | PageTemplate dùng ClientTemplate; một main, skip link, breadcrumb và liên kết về đầu trang có tên truy cập |
| Header có state mở menu nhưng thiếu nút; CSS legacy che menu và nút outline | Menu mobile có nút mở/đóng, ARIA và CSS đủ specificity; bộ lọc mobile có thể thu gọn; nút outline đọc được |
| Trang chủ import page của route khác và gọi danh sách vị trí hai lần | HomePage dùng chung cho hai URL; một parent tải dữ liệu phòng/vị trí cho các section |
| Nội dung English/Vietnamese, Lorem ipsum, FAQ nha khoa và các nút giả | Chuẩn hóa phần public sang tiếng Việt và nghiệp vụ lưu trú; blog có hướng dẫn đọc trực tiếp; liên hệ dùng email/điện thoại |
| Dashboard có số liệu khách hàng/revenue/storage và inbox mẫu | Tổng quan dùng số liệu từ API, kèm trạng thái tải/lỗi riêng cho từng tài nguyên |
| Admin users/reviews là danh sách mẫu; bookings có một luồng tải riêng thiếu cancellation và loading ban đầu | Năm danh sách admin dùng ResourcePanel, có tìm kiếm trong danh sách, phân trang, làm mới, loading/error/empty và abort khi rời trang |
| Menu admin khai báo tên/URL hai lần và active route khớp cả `users-other` | Sidebar đọc cùng registry và kiểm tra theo ranh giới segment; giữ các nhãn menu đang có |
| Admin logout chỉ dẫn về trang chủ | Dispatch logout để xóa phiên rồi chuyển về đăng nhập |
| Guard ADMIN lặp lại ở từng page | Kiểm tra một lần tại layout admin; các route bên dưới tiếp tục được bảo vệ |
| State danh sách đặt phòng dùng chung dễ hiển thị bản ghi ngoài tài khoản ở MyBookings | Lọc theo userId ngay khi render; kết quả xác nhận cũng ẩn khi đăng xuất/đổi tài khoản |
| CSS cho `.admin-shell`, metric/chart/card của một dashboard cũ không có markup sử dụng | Loại CSS cũ; giữ bridge navigation/sidebar cần thiết và design tokens |
| README/tài liệu ghi phiên chỉ ở bộ nhớ, không khớp implementation localStorage | Cập nhật theo ReduxProviders và auth.session hiện tại |

## Cấu trúc tiếp tục sử dụng

```text
app/(client|auth|admin)/  route và layout theo phạm vi
app/@modal/              parallel route và modal box dùng chung
app/templates/           khung trang dùng chung
app/features/            component và nghiệp vụ theo feature
app/component/ui/        primitive và thẻ dùng chung
app/component/admin/     shell và bảng tài nguyên admin
app/constants/           endpoint và thông tin site
app/route/               registry URL và navigation
app/services/http.ts     Axios phía client gọi Route Handler nội bộ
app/services/api.ts      Axios server kết nối backend Swagger
app/services/proxy.ts    proxy và policy cho Route Handler
app/services/crud.ts     CRUD dùng chung
app/services/api-utils.ts config, response và lỗi API
app/store/               typed hooks và hàm state của request
app/theme/               base, CSS Module theo feature và trang minh họa
app/types/               kiểu dữ liệu dùng chung
```

Không cần thêm tầng repository/use-case cho các màn hình này. Type, thunk, slice, reducer và domain service có trách nhiệm riêng; số file ở lớp dữ liệu không phải dấu hiệu dư thừa riêng lẻ.

`BookingForm` là biểu mẫu tham khảo chưa gắn vào route; `booking.validation.ts` vẫn được kiểm thử. `commons/legacy/dashboard-scripts.ts` được giữ cho khả năng tương thích và các test quản lý bundle, nhưng không tải trong dashboard hiện tại. Các facade route/endpoint hiện có được giữ để duy trì API import.

## Phần còn cần nối tiếp

1. `/admin/slider` và `/admin/users/detail` vẫn là trang minh họa; đã có thông báo rõ về phạm vi lưu. Phòng đã có form thêm mới tại `/admin/rooms/add`; các form cập nhật phòng và CRUD đầy đủ cho vị trí/bình luận vẫn cần validation riêng.
2. Thông tin liên hệ trong `constants/site.ts` vẫn là thông tin mẫu của Hotux. Thay bằng thông tin doanh nghiệp trước khi xuất bản.
3. CSS vendor public và dashboard vẫn có selector toàn cục. Khi tiếp tục thay theme, nên cô lập dần theo phạm vi; Next.js có thể giữ stylesheet khi điều hướng giữa route. Homepage vẫn cần Swiper/Slick/date picker legacy.
4. Danh sách phòng hiện tải danh mục để lọc/sắp xếp/phân trang nhất quán ở trình duyệt. Với danh mục lớn, cần backend hỗ trợ các bộ lọc tương ứng trước khi chuyển sang phân trang server.
5. Font có cả `public/assets/font/` và `fonts/`, nhưng `icons.css` tham chiếu trực tiếp `../font/`. Chưa xóa asset vendor vì cần kiểm tra toàn bộ URL CSS và plugin trước; video/font SVG cũng chiếm phần lớn dung lượng asset.
6. Guard UI và token localStorage chưa thay thế việc kiểm chứng phiên/phân quyền ở backend; giữ ghi chú kỹ thuật hiện có trong tài liệu session/API.

## Kiểm chứng

- 50/50 tests đạt. Regression tests bao phủ URL đặt đúng phòng/giữ ngày và số khách, dữ liệu thật/loading/error/empty của admin, phân trang, active route, phòng liên quan, payload thêm phòng và dữ liệu đặt phòng theo tài khoản.
- Browser: danh mục trả 148 phòng tại thời điểm kiểm tra; lọc 2 phòng ngủ + Wi-Fi còn 10 kết quả, sắp xếp giá tăng đúng. Kết quả tìm Quận 1 với ngày 01–03/11/2026 và 2 khách giữ đúng thông tin qua link chi tiết/đặt phòng. Số liệu này có thể thay đổi theo API.
- Desktop/mobile: xác nhận nút menu, mở/đóng bộ lọc, không tràn ngang ở viewport 390px và chỉ một main. Trang chủ giữ 6 thẻ phòng nổi bật, một h1 trong các slide gốc; carousel có clone DOM của plugin.
- Lint và typecheck đều đạt, không có lỗi hoặc cảnh báo.
- Typecheck và production build Webpack: đạt ở đợt rà soát đầu. Trong đợt chuyển sang cấu trúc học React, `npm run build` mặc định với Turbopack cũng đã đạt; không thay bundler trong package.json. Sau khi gộp/xóa các file thunk, đã khởi động lại dev server để bỏ cache tham chiếu đường dẫn cũ.
- Chưa kiểm tra thao tác ghi lên backend thật hoặc đăng nhập admin thật. Các danh sách admin được kiểm chứng bằng store fixture và test render; guard được kiểm tra với phiên chưa đăng nhập.
