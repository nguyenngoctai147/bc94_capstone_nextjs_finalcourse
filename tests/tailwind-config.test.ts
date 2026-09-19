import assert from "node:assert/strict";
import test from "node:test";
import postcss from "postcss";
import tailwindcss from "tailwindcss";
import config from "../tailwind.config.js";

test("Tailwind utilities use the tw- prefix without emitting Preflight", async () => {
  const css = (await postcss([
    tailwindcss({
      ...config,
      content: [{ raw: '<div class="tw-flex tw-flex-col tw-justify-center"></div>' }],
    }),
  ]).process("@tailwind utilities;", { from: undefined })).css;

  assert.match(css, /\.tw-flex\s*\{\s*display: flex/);
  assert.match(css, /\.tw-flex-col\s*\{\s*flex-direction: column/);
  assert.match(css, /\.tw-justify-center\s*\{\s*justify-content: center/);
  assert.doesNotMatch(css, /(^|\n)html\s*\{/);
  assert.doesNotMatch(css, /(^|\n)\*[,\s]/);
});
