# JS Hotux đã tích hợp

Toàn bộ 15 file JS gốc được lưu nguyên bản trong `public/assets/legacy/js`. Chúng được giữ làm asset legacy và **không chạy toàn cục** vì phần lớn phụ thuộc vào jQuery, plugin DOM hoặc biến global. Việc copy file không có nghĩa là tự động thực thi file trên mọi route.

## File đã copy

`bootstrap.min.js`, `jquery-3.3.1.min.js`, `plugin.js`, `isotope.min.js`, `main.js`, `dashboard.js`, `chart.js`, `map.js`, `custom-nav.js`, `custom-gallery.js`, `custom-mixitup.js`, `custom-swiper1.js`, `custom-swiper2.js`, `custom-date.js`, `custom-singledate.js`.

Đường dẫn public của từng file là `/assets/legacy/js/<tên-file>`. Bản gốc có thể mở tại [public/assets/legacy/js](../public/assets/legacy/js).

## Phân tích phụ thuộc

| File | Quan sát | Nơi nên dùng sau khi chuyển đổi |
| --- | --- | --- |
| `jquery-3.3.1.min.js` | thư viện nền cho nhiều file khác | Không import toàn cục; chỉ giữ tạm cho plugin cũ |
| `bootstrap.min.js` | Bootstrap JS 5.2.2 | Không chạy cùng bản npm; chỉ dùng plugin Bootstrap cần thiết |
| `plugin.js` | file tổng hợp, khoảng 657 KB, dùng nhiều plugin | Bundle legacy của section cần giữ nguyên giao diện |
| `main.js` | entry point giao diện, phụ thuộc jQuery | Chuyển từng hành vi thành Client Component |
| `dashboard.js` | menu/wigdet dashboard, phụ thuộc jPanelMenu/jQuery | `app/(admin)/admin` |
| `custom-nav.js` | sticky header, menu và scroll | `app/templates/ClientTemplate.tsx` hoặc component navigation |
| `custom-gallery.js`, `custom-mixitup.js` | Isotope filter | component gallery/list có filter |
| `isotope.min.js` | thư viện layout/filter | Chỉ tải cùng gallery/filter |
| `custom-swiper1.js`, `custom-swiper2.js` | khởi tạo Swiper theo chiều dọc/ngang | `legacyScriptBundles` theo từng section |
| `custom-date.js`, `custom-singledate.js` | dateRangePicker qua jQuery | bundle section có date picker tĩnh |
| `chart.js` | CanvasJS chart, không phải Chart.js npm | dashboard component biểu đồ |
| `map.js` | khai báo `initMap` cho Google Maps | component bản đồ, cần Google Maps script/key riêng |

## Quản lý và nạp bundle legacy

Danh sách và bộ nạp dùng chung nằm tại [`app/lib/legacy/scripts.ts`](../app/lib/legacy/scripts.ts). Mỗi section chỉ import bundle tương ứng:

```tsx
"use client";

import { useEffect } from "react";
import { legacyScriptBundles, loadLegacyScripts } from "@/lib/legacy/scripts";

export function LegacyHomeScripts() {
  useEffect(() => {
    void loadLegacyScripts(legacyScriptBundles.hotuxHome);
  }, []);
  return null;
}
```

Thứ tự trong bundle giữ nguyên thư viện nền → plugin → file custom như HTML tĩnh. Không để token, dữ liệu booking hoặc thông tin riêng tư trong JS tĩnh.

## Hướng chuyển đổi khuyến nghị

1. Các section cần đúng animation/selector tĩnh dùng bundle trong `legacyScriptBundles`.
2. `custom-date.js` và `custom-singledate.js` giữ nguyên khi section còn dùng dateRangePicker.
3. `custom-swiper*.js`/gallery chỉ tải ở section có đúng markup tương ứng.
4. `chart.js`/`map.js` → widget admin lazy-load theo route.
5. `dashboard.js`, `main.js`, `plugin.js` → không chuyển nguyên file; tách từng hành vi đang thực sự xuất hiện trong HTML.

Các file hiện được lưu nguyên bản để không mất source. Code ứng dụng mới nằm trong `app/components`, `app/features`, `app/templates` và `app/store`.
