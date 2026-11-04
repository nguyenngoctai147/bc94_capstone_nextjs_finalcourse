# Redux Toolkit store

Store được chia theo domain để giữ cách đọc quen thuộc của cấu trúc reducer/saga, nhưng cơ chế bất đồng bộ dùng Redux Toolkit Thunk.

```text
store/
  type/<domain>/index.ts       Model, DTO và state type
  thunk/<domain>/index.ts      createAsyncThunk, gọi service của feature
  slice/<domain>/index.ts      createSlice, pending/fulfilled/rejected
  reducer/<domain>/index.ts    Export reducer của domain
  reducer/index.ts             combineReducers và quy tắc reset khi logout
  index.ts                     makeStore và type AppStore/AppDispatch
```

Thứ tự mở code khi học hoặc kiểm tra một luồng là `type → service → thunk → slice → reducer → component`.

Component chỉ import đúng trách nhiệm cần dùng:

```ts
import { fetchRooms } from "@/store/thunk/room";
import { logout } from "@/store/slice/auth";
import type { Room } from "@/store/type/room";
```

Không export một store singleton. `ReduxProviders` gọi `makeStore()` để mỗi lần khởi tạo ứng dụng có một store riêng; thunk middleware đã được Redux Toolkit cấu hình mặc định.
