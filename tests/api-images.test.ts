import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ApiImage } from "../app/components/ui/ApiImage";
import { resolveApiImageSrc } from "../app/lib/api/images";

test("API image sources only use paths supported by next/image", () => {
  const backendImage = "https://airbnbnew.cybersoft.edu.vn/images/vt1.jpg";
  const uploadedImage = "https://airbnbnew.cybersoft.edu.vn/avatar/room.jpg";
  const externalImage = "https://acihome.vn/uploads/15/room.JPG";
  const googleImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:abc";

  assert.equal(resolveApiImageSrc(backendImage), backendImage);
  assert.equal(resolveApiImageSrc(uploadedImage), uploadedImage);
  assert.equal(resolveApiImageSrc(externalImage), externalImage);
  assert.equal(resolveApiImageSrc(googleImage), googleImage);
  assert.equal(resolveApiImageSrc("/images/vt1.jpg"), backendImage);
  assert.equal(resolveApiImageSrc("/assets/images/room1.jpg"), "/assets/images/room1.jpg");
});

test("missing and malformed API images use the fallback instead of crashing", () => {
  for (const source of [undefined, null, "", "  ", "room.jpg", "images/room.jpg",
    "https://example.com/image.jpg", "javascript:alert(1)", "//example.com/image.jpg",
    "/assets/images/../secret.jpg", "https://airbnbnew.cybersoft.edu.vn/other/room.jpg",
  ]) {
    assert.equal(resolveApiImageSrc(source), null, String(source));
  }
});

test("a room with room.jpg renders its fallback without invoking next/image", () => {
  const markup = renderToStaticMarkup(createElement(ApiImage, {
    src: "room.jpg", alt: "Phòng thử nghiệm", width: 500, height: 350,
    fallback: "Chưa có ảnh phòng",
  }));
  assert.equal(markup, "Chưa có ảnh phòng");
});
