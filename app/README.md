# Cấu trúc thư mục `app`

- `(admin)`, `(auth)`, `(client)`: route group của App Router.
- `@modal`: parallel route dành cho modal và các modal box dùng chung.
- `api`: route handler phía server, chia theo auth và từng tài nguyên backend.
- `commons`: template, validation và tiện ích dùng chung.
- `component`: component giao diện tái sử dụng.
- `constants`: hằng số cấu hình không thuộc URL, ví dụ thông tin website.
- `features`: nghiệp vụ, service và state theo từng tính năng.
- `hooks`: custom React hooks.
- `provider`: provider cấp ứng dụng.
- `route`: registry URL website, endpoint backend và endpoint API local.
- `services`: `api.ts`, `http.ts`, `proxy.ts`, `crud.ts`, `api-utils.ts` dùng cho Axios và proxy API.
- `store`: Redux store, hook và request state.
- `theme`: CSS nền tảng và CSS Module theo tính năng.
- `types`: kiểu dữ liệu dùng chung giữa nhiều tính năng.

Các file `page.tsx` và `layout.tsx` chỉ lắp ráp component. Nghiệp vụ tiếp tục nằm trong `features`, còn kiểu dữ liệu riêng của từng nghiệp vụ vẫn đặt cạnh feature tương ứng.
