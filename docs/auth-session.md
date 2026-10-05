# Phiên đăng nhập phía trình duyệt

Sau khi đăng nhập thành công, `StoreProvider` lưu phiên vào localStorage key `hotux.auth.session.v1`. Giá trị chỉ gồm `version`, `token` và hồ sơ người dùng đã whitelist. Mật khẩu và trạng thái request Redux không được lưu.

Khi ứng dụng tải lại, provider xác thực JSON rồi dispatch `hydrateSession`. Những dữ liệu thiếu, sai version hoặc lỗi JSON bị xóa khỏi trạng thái trong bộ nhớ. `useClientReady` giữ lần render đầu của các vùng phụ thuộc phiên giống hệt HTML từ server; `HotuxHeader` và `RequireAuth` chỉ dùng phiên đã lưu sau khi hydration hoàn tất. Cách này tránh lỗi hydration ngay cả khi Fast Refresh giữ Redux store cũ trong development.

`logout` xóa token/profile khỏi Redux và localStorage. Sự kiện `storage` đồng bộ đăng xuất hoặc đăng nhập giữa các tab mà không tạo vòng lặp ghi.

Access token trong localStorage phù hợp với API hiện tại cần token phía client. Khi backend hỗ trợ cookie `HttpOnly`, hãy chuyển token sang cookie đó để tăng khả năng chống XSS; module `auth.session.ts` là điểm tập trung để thay đổi cơ chế lưu.
