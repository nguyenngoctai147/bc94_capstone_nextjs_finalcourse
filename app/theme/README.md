# CSS của giao diện

CSS do ứng dụng quản lý được đặt tập trung trong `app/theme`.

- `base`: token, foundation và CSS toàn ứng dụng; chỉ `globals.css` được import từ root layout.
- `features`: CSS Module theo từng nghiệp vụ; component import qua alias `@/theme/features/...` để Next.js chia CSS theo route.
- `examples`: CSS Module của trang minh họa hệ thống thiết kế.

Bootstrap được import một lần trong `app/layout.tsx` trước `base/globals.css`. Tailwind chỉ nạp utility có prefix `tw-`; preflight và component layer không được sử dụng để tránh ghi đè Bootstrap và Hotux.

CSS của template và dashboard trong `public/assets` là tài nguyên vendor. Các file này được giữ riêng vì còn dùng đường dẫn tương đối tới font, ảnh và plugin.
