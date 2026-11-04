<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Cách tổ chức code phục vụ study

- Page/layout theo App Router lắp ráp component; nghiệp vụ nằm trong `app/features/<feature>/`.
- Dùng ES6, destructuring, spread, arrow function và các hàm `map/filter`. Đặt tên `handle...` cho handler và `render...` cho phần render danh sách khi giúp đọc code rõ hơn.
- Component cha giữ state của luồng; component con nhận dữ liệu và callback bằng props. Chỉ thêm `"use client"` ở nơi dùng state, effect, event hoặc browser API.
- Tổ chức Redux theo domain trong `app/store`: type ở `type/<domain>/`, thunk ở `thunk/<domain>/`, slice ở `slice/<domain>/` và reducer ở `reducer/<domain>/`. Mỗi thư mục có `index.ts`; slice viết rõ `pending/fulfilled/rejected` và dùng các hàm trong `store/request-state.ts`.
- Component tải dữ liệu bằng `useEffect` + dispatch thunk và hủy request trong cleanup. Tên thunk thể hiện hành động, ví dụ `fetchRooms`, `fetchRoomDetail`, `createBooking`.
- Form dùng controlled input (`name`, `value`, `onChange`, `onBlur`), state dữ liệu/lỗi và handler submit riêng. Dùng lại `useForm`, Input, Select, Textarea, Button, Alert theo nhu cầu.
- `app/services/http.ts` là Axios gọi Route Handler nội bộ; `app/services/api.ts` là Axios server kết nối Swagger và thêm token cấu hình qua proxy. Domain service nằm trong `app/features/<feature>/`; token phiên được thunk truyền theo từng request.
- Giữ TypeScript strict và store theo từng Provider của Next.js. Khi mở rộng feature, bổ sung chức năng và validation tương ứng vào cấu trúc hiện có.
- Hướng dẫn đối chiếu với các bài React đã học nằm tại `docs/study-architecture.md`.
