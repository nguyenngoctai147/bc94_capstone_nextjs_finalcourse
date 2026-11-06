# Phiên đăng nhập phía trình duyệt

Sau khi đăng nhập thành công, `ReduxProviders` lưu phiên vào session cookie `hotux.auth.session.v3`. Giá trị chỉ gồm `version`, `token`, hồ sơ người dùng đã whitelist, `createdAt` và `expiresAt`. Mật khẩu và trạng thái request Redux không được lưu.

Session cookie dùng chung giữa các tab và không khai báo `Expires` hoặc `Max-Age`. Vì vậy, đóng một tab rồi mở tab khác trong cùng phiên trình duyệt vẫn giữ đăng nhập; đóng hẳn phiên trình duyệt sẽ kết thúc đăng nhập. Mốc `expiresAt` bên trong giới hạn phiên tối đa 30 ngày ngay cả khi trình duyệt chưa được đóng.

Khi ứng dụng tải, provider xác thực JSON và thời hạn rồi dispatch `hydrateSession`. Dữ liệu thiếu, sai version, quá hạn hoặc lỗi JSON bị xóa. `logout` xóa token/profile khỏi Redux và làm cookie hết hạn ngay. Provider cũng dọn các phiên auth cũ trong `localStorage` và `sessionStorage` để tránh xung đột.

Access token hiện vẫn cần ở phía client vì API Swagger chưa hỗ trợ cookie phiên `HttpOnly`. Module `auth.session.ts` là điểm tập trung để thay đổi cơ chế lưu khi backend hỗ trợ phương án an toàn hơn.
