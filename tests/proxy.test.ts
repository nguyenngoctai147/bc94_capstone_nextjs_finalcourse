import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import test from "node:test";
import { checkBackendPath } from "../app/lib/api/backend-policy";
import { proxyBackend } from "../app/lib/api/backend-proxy";
test("proxy rejects unknown routes, traversal and undocumented methods", () => {
  assert.equal(checkBackendPath(["phong-thue", "1"], "GET"), 200);
  assert.equal(checkBackendPath(["users"], "DELETE"), 200);
  assert.equal(checkBackendPath(["users", "1"], "DELETE"), 405);
  assert.equal(checkBackendPath(["phong-thue", "1"], "PATCH"), 405);
  assert.equal(checkBackendPath(["..", "secret"], "GET"), 400);
  assert.equal(checkBackendPath(["users", "search", "%2fsecret"], "GET"), 400);
  assert.equal(checkBackendPath(["unknown"], "GET"), 404);
});
test("proxy keeps secret server-side and forwards query, JSON, upload and 204", async () => {
  const original = { base: process.env.API_BASE_URL, token: process.env.CYBERSOFT_TOKEN, timeout: process.env.API_TIMEOUT_MS };
  const received: { url?: string; token?: string; cyber?: string; type?: string; body: string; method?: string }[] = [];
  const server = createServer(async (request, response) => {
    const chunks = []; for await (const chunk of request) chunks.push(chunk);
    received.push({ url: request.url, token: request.headers.token as string, cyber: request.headers.tokencybersoft as string, type: request.headers["content-type"], body: Buffer.concat(chunks).toString(), method: request.method });
    if (request.method === "DELETE") { response.writeHead(204); response.end(); return; }
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ statusCode: 200, content: [] }));
  });
  server.listen(0, "127.0.0.1"); await once(server, "listening");
  const address = server.address(); assert.ok(address && typeof address !== "string");
  process.env.API_BASE_URL = `http://127.0.0.1:${address.port}/api`;
  process.env.CYBERSOFT_TOKEN = "test-server-secret"; process.env.API_TIMEOUT_MS = "5000";
  try {
    const list = await proxyBackend(new Request("http://localhost/api/backend/phong-thue?pageIndex=2", { headers: { token: "test-user-token" } }), ["phong-thue"]);
    assert.equal(list.status, 200); assert.ok(!(await list.text()).includes("test-server-secret"));
    assert.equal(received[0].url, "/api/phong-thue?pageIndex=2");
    assert.equal(received[0].cyber, "test-server-secret"); assert.equal(received[0].token, "test-user-token");
    for (const method of ["POST", "PUT"]) {
      const parts = method === "POST" ? ["phong-thue"] : ["phong-thue", "1"];
      const result = await proxyBackend(new Request(`http://localhost/api/backend/${parts.join("/")}`, { method, headers: { "Content-Type": "application/json", origin: "http://localhost" }, body: JSON.stringify({ tenPhong: "Test" }) }), parts);
      assert.equal(result.status, 200);
      assert.deepEqual(JSON.parse(received.at(-1)!.body), { tenPhong: "Test" });
    }
    const data = new FormData(); data.append("formFile", new File(["fixture"], "room.png"));
    const upload = await proxyBackend(new Request("http://localhost/api/backend/phong-thue/upload-hinh-phong?maPhong=1", { method: "POST", body: data }), ["phong-thue", "upload-hinh-phong"]);
    assert.equal(upload.status, 200); assert.match(received.at(-1)!.type!, /multipart\/form-data; boundary=/);
    assert.match(received.at(-1)!.body, /name="formFile"/);
    const deleted = await proxyBackend(new Request("http://localhost/api/backend/users?id=12", { method: "DELETE" }), ["users"]);
    assert.equal(deleted.status, 204); assert.equal(await deleted.text(), "");
    assert.equal(received.at(-1)!.url, "/api/users?id=12");
    const forbidden = await proxyBackend(new Request("http://localhost/api/backend/users", { method: "POST", headers: { origin: "https://foreign.example" } }), ["users"]);
    assert.equal(forbidden.status, 403);
    delete process.env.CYBERSOFT_TOKEN;
    const missing = await proxyBackend(new Request("http://localhost/api/backend/phong-thue"), ["phong-thue"]);
    assert.equal(missing.status, 503);
  } finally {
    for (const [key, value] of Object.entries({ API_BASE_URL: original.base, CYBERSOFT_TOKEN: original.token, API_TIMEOUT_MS: original.timeout })) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

