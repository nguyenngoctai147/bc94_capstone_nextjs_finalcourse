# Hotux design system

## Cấu trúc và nguồn thiết lập

- `app/styles/design-tokens.css`: nguồn duy nhất cho giá trị màu, font, cỡ chữ, spacing, width, radius, shadow và focus.
- `app/styles/design-foundations.css`: quy tắc sử dụng token, bridge cho Hotux và các component dùng chung. Scope `.ds-site` dành cho website; `.ds-foundation` cho nội dung độc lập. Không reset plugin hoặc dashboard.
- `app/components/ui/Typography.tsx`: phân cấp chữ và căn chỉnh, độc lập với thẻ HTML.
- `app/components/ui/Layout.tsx`: Container, Stack, Cluster; không cần lặp lại padding/gap thủ công.
- `tailwind.config.js`: semantic utilities đọc cùng CSS variables; tiếp tục dùng prefix `tw-`, không bật Preflight.
- `/ui`: trang mẫu Typography, Màu sắc, Spacing, Chiều rộng và Components. CSS Modules cô lập bố cục của trang mẫu khỏi theme legacy.

## Các quyết định thiết kế

Giữ màu cam Hotux `--ds-brand` cho nhận diện. `--ds-primary` đậm hơn dành cho nút có chữ trắng và văn bản nhấn mạnh. Màu trạng thái có cả màu chữ và màu nền nhẹ; luôn kèm mô tả/icon, không dựa riêng vào màu.

Poppins cho tiêu đề, Lato cho nội dung, Roboto giữ nguyên cho dashboard. Cỡ chữ dùng rem; H1–H3 và lead dùng clamp để giãn theo viewport. Body 16px/1.65; label 14px; caption 12px (khi font gốc trình duyệt là 16px). Giữ thẻ heading theo cấu trúc tài liệu, không chọn thẻ chỉ vì kích thước.

Spacing theo nhịp 4px: 4/8/12/16/20/24/32/40/48/64/80. Dùng token theo vai trò khi có thể: gutter 16–32px, section 40–80px, grid gap 24px, padding card 16–24px.

Content tối đa 1200px **bao gồm gutter**; wide 1440px; form 520px; reading 65ch. Container là trần chiều rộng, không phải chiều rộng cố định. Tránh lồng Container trong `.container` nếu không muốn thêm gutter lần nữa.

## Cách căn chỉnh

```tsx
import { Container, Stack, Cluster, Typography, Button } from "@/components/ui";

<Container width="reading">
  <Stack gap={6}>
    <Typography as="h1" variant="h2">Thông tin đặt phòng</Typography>
    <Typography tone="muted">Nội dung mô tả dễ đọc.</Typography>
    <Cluster gap={3}>
      <Button>Xác nhận</Button>
      <Button variant="outline-primary">Quay lại</Button>
    </Cluster>
  </Stack>
</Container>
```

Typography hỗ trợ `align="start|center|end"`, `tone="default|muted|brand"`, `variant="h1|h2|h3|h4|lead|body|label|caption|eyebrow"`. Căn start cho nội dung dài; center cho giới thiệu ngắn; end cho giá/số liệu.

CSS: `className="ds-grid"` cho grid auto-fit; `ds-section` cho section spacing. Tailwind: `tw-gap-layout`, `tw-p-section`, `tw-px-gutter`, `tw-text-primary`, `tw-bg-brand/10`, `tw-max-w-content`.

## Thay đổi tổng thể và giới hạn

1. Sửa token theo vai trò trong `design-tokens.css`, không sửa trực tiếp file vendor.
2. Xem `/ui`, kiểm tra desktop/mobile, trạng thái lỗi và focus bàn phím.
3. Kiểm tra trang chủ, Check Availability và trang dùng component được thay đổi. Chạy typecheck, test và build trước khi bàn giao.

Đã tích hợp vào ClientTemplate/PageTemplate (width và heading), AuthTemplate, Button/Input/Select/Textarea/Card/Alert, các section thông thường và grid phòng ở trang chủ. Nút `.btn-orange` của website đọc cùng primary token. Dashboard giữ CSS/bố cục vendor riêng; component dùng chung trong dashboard vẫn nhận token qua marker `ds-*`. Các section/plugin legacy có layout đặc thù chưa bị ghi đè toàn bộ; chuyển dần sang semantic tokens khi chỉnh chúng. Các lớp số sẵn có của Bootstrap/Tailwind (ví dụ `p-4`, `tw-gap-4`) vẫn giữ giá trị gốc; dùng utility semantic hoặc Stack nếu muốn chúng thay đổi theo token.

Không tải thêm font hoặc thêm thư viện. Token không tự thay đổi màu chữ trên ảnh/banner; những vùng đó tiếp tục dùng tương phản riêng của Hotux.
