# CSS của giao diện
Bootstrap CSS được import một lần trong app/layout.tsx, trước app/globals.css.
- Tailwind CSS dùng phiên bản 3 để hỗ trợ prefix dạng `tw-` theo chuẩn dự án. Chỉ utility được nạp; `preflight` bị tắt trong `tailwind.config.js`, vì vậy Tailwind không thêm global reset hay ghi đè Bootstrap/Hotux.
- Luôn thêm prefix `tw-`: `tw-flex tw-flex-col tw-justify-center tw-gap-4`. Với variant, prefix đứng sau variant: `md:tw-flex-row`, `hover:tw-bg-slate-800`.
- Không dùng utility Tailwind không có prefix (`flex`, `p-4`, `text-center`); đó có thể là class Bootstrap hoặc CSS cũ.
- CSS dùng chung: app/globals.css hoặc file ở đây, import từ root layout.
- CSS riêng: colocate Component.module.css bên cạnh component để tránh trùng selector.
- Không thêm `@tailwind base` hoặc `@tailwind components` vào app/globals.css.
- Đặt ảnh/font ở public/assets/images và public/assets/fonts; URL bắt đầu bằng /assets/...
- Đưa hành vi JavaScript vào Client Component; không chạy script cũ thao tác toàn bộ DOM khi render.
