# Route Handler API

Các API local được chia theo nghiệp vụ để component không gọi trực tiếp endpoint Swagger:

- `auth/signin`, `auth/signup`: chuyển tiếp xác thực tới backend.
- `auth/signout`: kết thúc phiên local; Swagger hiện không có endpoint đăng xuất.
- `room`, `booking`, `location`, `user`, `reviews`: chuyển tiếp CRUD và endpoint đặc biệt của từng tài nguyên.
- `profile/[id]`: alias hồ sơ cho endpoint chi tiết người dùng.
- `_shared`: helper dùng chung và không tạo URL public.

Luồng gọi API:

```text
feature service
  -> route/next.api.ts
  -> app/api/<resource>/route.ts
  -> route/core.api.ts
  -> services/api/backend-proxy.ts
  -> backend Swagger
```

Khi thêm tài nguyên mới, cần cập nhật đồng thời `core.api.ts`, `next.api.ts`, policy proxy và Route Handler tương ứng.
