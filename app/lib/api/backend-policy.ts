// Only documented endpoints; no arbitrary URL relay.
const rules: [RegExp, readonly string[]][] = [
  [/^auth\/(signin|signup)$/, ["POST"]],
  [/^(phong-thue|vi-tri|dat-phong|binh-luan)$/, ["GET", "POST"]],
  [/^users$/, ["GET", "POST", "DELETE"]],
  [/^(phong-thue|vi-tri|dat-phong)\/\d+$/, ["GET", "PUT", "DELETE"]],
  [/^users\/\d+$/, ["GET", "PUT"]],
  [/^binh-luan\/\d+$/, ["PUT", "DELETE"]],
  [/^(phong-thue|vi-tri|users)\/phan-trang-tim-kiem$/, ["GET"]],
  [/^phong-thue\/lay-phong-theo-vi-tri$/, ["GET"]],
  [/^dat-phong\/lay-theo-nguoi-dung\/\d+$/, ["GET"]],
  [/^binh-luan\/lay-binh-luan-theo-phong\/\d+$/, ["GET"]],
  [/^users\/search\/[^/]+$/, ["GET"]],
  [/^(phong-thue\/upload-hinh-phong|vi-tri\/upload-hinh-vitri|users\/upload-avatar)$/, ["POST"]],
];
export function checkBackendPath(segments: string[], method: string): number {
  if (segments.some((s) => !s || s === "." || s === ".." || /[\\/%?#\u0000-\u001f]/.test(s))) return 400;
  const rule = rules.find(([pattern]) => pattern.test(segments.join("/")));
  return !rule ? 404 : rule[1].includes(method) ? 200 : 405;
}
