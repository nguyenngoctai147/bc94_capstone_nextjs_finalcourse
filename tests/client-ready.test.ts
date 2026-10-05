import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { useClientReady } from "../app/hooks/useClientReady";

function Probe() {
  return createElement("span", null, useClientReady() ? "client" : "server");
}

test("browser-only UI keeps the server snapshot during SSR", () => {
  assert.equal(renderToString(createElement(Probe)), "<span>server</span>");
});
