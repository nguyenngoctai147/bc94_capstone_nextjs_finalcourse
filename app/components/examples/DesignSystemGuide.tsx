import type { CSSProperties } from "react";
import { Cluster, Stack, Typography } from "@/components/ui";
import styles from "./DesignSystemGuide.module.css";

const colors = [
  ["brand", "Nhận diện", "Màu cam Hotux, điểm nhấn trang trí"],
  ["primary", "Thao tác chính", "Nút và liên kết; tương phản với chữ trắng"],
  ["ink", "Tiêu đề", "Thông tin quan trọng"],
  ["text", "Nội dung", "Văn bản dài và mô tả"],
  ["muted", "Nội dung phụ", "Chú thích, không dùng cho chữ disabled"],
  ["border", "Đường viền", "Phân chia các khối nội dung"],
  ["surface", "Bề mặt", "Card, form, hộp nội dung"],
  ["canvas", "Nền trang", "Phân biệt nền với card"],
  ["success", "Thành công", "Hoàn tất thao tác"],
  ["warning", "Cảnh báo", "Cần kiểm tra thông tin"],
  ["danger", "Lỗi", "Lỗi nhập liệu hoặc thao tác"],
  ["info", "Thông tin", "Hướng dẫn trung tính"],
] as const;
const typeSamples = [
  ["h1", "H1 · Tiêu đề trang", "32–48px · 1.3", "Kỳ nghỉ theo cách của bạn"],
  ["h2", "H2 · Tiêu đề section", "24–36px · 1.3", "Khám phá chỗ nghỉ lý tưởng"],
  ["h3", "H3 · Tiêu đề nhóm", "20–26px · 1.3", "Không gian dành cho gia đình"],
  ["h4", "H4 · Tiêu đề card", "20px · 1.3", "Phòng hướng biển"],
  ["lead", "Lead · Mở đầu", "18–20px · 1.65", "Một hành trình thư giãn bắt đầu từ những lựa chọn phù hợp."],
  ["body", "Body · Nội dung", "16px · 1.65", "Nội dung có nhịp đọc rõ ràng, hỗ trợ tiếng Việt và xuống dòng tự nhiên trên mọi màn hình."],
  ["label", "Label · Nhãn", "14px · 1.65", "Ngày nhận phòng"],
  ["caption", "Caption · Chú thích", "12px · 1.65", "Giá đã bao gồm thuế và phí dịch vụ."],
] as const;
const spaces = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20] as const;
const sections = [["typography", "Typography"], ["colors", "Màu sắc"], ["spacing", "Spacing"], ["layout", "Chiều rộng"], ["components", "Components"]] as const;

export function DesignSystemGuide() {
  return <div className={`ds-foundation ${styles.guide}`}>
    <header className={styles.intro}>
      <Stack gap={4}>
        <Typography variant="eyebrow">Hotux · Design foundations / v1.0</Typography>
        <Typography as="h1" variant="h1">Một hệ thống.<br />Nhiều màn hình nhất quán.</Typography>
        <Typography variant="lead" tone="muted" className={styles.reading}>Typography, màu sắc và nhịp khoảng cách dùng chung — được thiết lập từ một nguồn, giữ nguyên cấu trúc Hotux hiện có.</Typography>
        <Cluster gap={2}><span className={styles.badge}>Thang spacing 4px</span><span className={styles.badge}>Responsive typography</span><span className={styles.badge}>Bootstrap + tw-</span></Cluster>
      </Stack>
      <div className={styles.identity} aria-hidden="true"><span>H</span><small>Clarity. Rhythm. Consistency.</small></div>
    </header>
    <nav aria-label="Các phần của hệ thống thiết kế" className={styles.nav}>
      {sections.map(([id, label], index) => <a key={id} href={`#${id}`}><span>0{index + 1}</span> {label}</a>)}
    </nav>

    <section id="typography" className={styles.section}>
      <SectionHeading number="01" title="Typography" description="Poppins cho tiêu đề, Lato cho nội dung. Phân cấp thị giác độc lập với thẻ HTML, căn trái là mặc định." />
      <div className={styles.panel}>
        {typeSamples.map(([variant, label, size, sample]) => <div key={variant} className={styles.typeRow}>
          <div><Typography variant="label">{label}</Typography><Typography variant="caption" tone="muted">{size} · --ds-text-{variant}</Typography></div>
          <Typography variant={variant}>{sample}</Typography>
        </div>)}
      </div>
      <div className={`ds-grid ${styles.alignments}`}>{(["start", "center", "end"] as const).map(align => <div key={align} className={styles.panel}>
        <Typography variant="label" align={align}>{({ start: "Căn trái", center: "Căn giữa", end: "Căn phải" })[align]}</Typography>
        <Typography tone="muted" align={align}>Một nhịp đọc, một cách căn chỉnh rõ ràng.</Typography>
      </div>)}</div>
    </section>

    <section id="colors" className={styles.section}>
      <SectionHeading number="02" title="Màu sắc chủ đạo" description="Cam sáng dùng cho nhận diện; cam đậm dành cho thao tác và chữ nhỏ. Không chỉ dùng màu để diễn đạt trạng thái." />
      <div className={styles.colors}>{colors.map(([token, name, description]) => <div key={token} className={styles.swatch}>
        <div className={styles.colorSample} style={{ backgroundColor: `var(--ds-${token})` }} aria-hidden="true" />
        <Stack gap={1}><Typography variant="label">{name}</Typography><code>--ds-{token}</code><Typography variant="caption" tone="muted">{description}</Typography></Stack>
      </div>)}</div>
    </section>

    <section id="spacing" className={styles.section}>
      <SectionHeading number="03" title="Spacing & bề mặt" description="Thang 4px giữ nhịp nhất quán. Khoảng cách trong card nhỏ hơn khoảng cách giữa các nhóm; section giãn theo màn hình." />
      <div className={styles.spacingLayout}>
        <div className={styles.panel}>{spaces.map(space => <div key={space} className={styles.spaceRow}>
          <code>space-{space}</code><span className={styles.spaceBar} style={{ width: `var(--ds-space-${space})` }} /><span>{space * 4}px</span>
        </div>)}</div>
        <Stack gap={6}>
          <div className={styles.panel}><Typography as="h3" variant="h4">Nhịp layout</Typography><dl className={styles.rules}>
            <dt>Gutter trang</dt><dd>16–32px · page-gutter</dd><dt>Grid gap</dt><dd>24px · grid-gap</dd><dt>Padding card</dt><dd>16–24px · card-padding</dd><dt>Section</dt><dd>40–80px · section-space</dd>
          </dl></div>
          <div className={styles.radii}>{(["sm", "md", "lg"] as const).map(radius => <div key={radius} style={{ borderRadius: `var(--ds-radius-${radius})` }}><Typography variant="label">{radius}</Typography><code>radius-{radius}</code></div>)}</div>
          <Typography variant="caption" tone="muted">Card dùng radius-md và shadow-card. Focus ring rõ ràng cho thao tác bằng bàn phím.</Typography>
        </Stack>
      </div>
    </section>

    <section id="layout" className={styles.section}>
      <SectionHeading number="04" title="Chiều rộng & căn chỉnh" description="Nội dung căn giữa với gutter hai bên. Văn bản dài giới hạn theo ký tự, không kéo dài theo toàn bộ màn hình." />
      <div className={`${styles.panel} ${styles.widthCanvas}`}>
        {[["wide", "Wide · 1440px", "100%"], ["content", "Content · 1200px", "84%"], ["reading", "Reading · 65ch", "60%"], ["form", "Form · 520px", "40%"]].map(([token, label, width]) => <div key={token} className={styles.widthBar} style={{ "--preview-width": width } as CSSProperties}>
          <Typography variant="label">{label}</Typography><code>--ds-{token === "content" ? "content" : token === "reading" ? "reading" : token === "form" ? "form" : "wide"}-width</code>
        </div>)}
        <Typography variant="caption" tone="muted">Sơ đồ tỷ lệ minh họa. Các giới hạn thực tế co lại theo viewport, không cố định chiều rộng trên mobile.</Typography>
      </div>
      <div className={styles.note}><Typography variant="label">Điều chỉnh tại một nơi</Typography><Typography tone="muted">Sửa app/styles/design-tokens.css để đổi màu, font, width và spacing. Component dùng Typography / Container / Stack / Cluster; Tailwind dùng các lớp tw-text-primary, tw-gap-layout, tw-max-w-content.</Typography></div>
    </section>
  </div>;
}

function SectionHeading({ number, title, description }: { number: string; title: string; description: string }) {
  return <Stack gap={2} className={styles.heading}><Typography variant="eyebrow">Foundation / {number}</Typography><Typography as="h2" variant="h2">{title}</Typography><Typography tone="muted" className={styles.reading}>{description}</Typography></Stack>;
}
