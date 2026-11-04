import assert from "node:assert/strict";
import test from "node:test";
import type { InternalAxiosRequestConfig } from "axios";
import api from "../app/services/api";
import { BackendApiConfigError } from "../app/services/api-utils";

const createResponse = (config: InternalAxiosRequestConfig) => ({
  data: new ArrayBuffer(0),
  status: 200,
  statusText: "OK",
  headers: {},
  config,
});

test("backend service configures Swagger environment and supports five HTTP methods", async () => {
  const original = {
    adapter: api.defaults.adapter,
    base: process.env.API_BASE_URL,
    token: process.env.CYBERSOFT_TOKEN,
    timeout: process.env.API_TIMEOUT_MS,
  };
  const calls: InternalAxiosRequestConfig[] = [];

  process.env.API_BASE_URL = "https://backend.example.test/api";
  process.env.CYBERSOFT_TOKEN = "server-token";
  process.env.API_TIMEOUT_MS = "7000";
  api.defaults.adapter = async (config) => {
    calls.push(config);
    return createResponse(config);
  };

  try {
    await api.get("rooms");
    await api.post("rooms", { name: "Create" });
    await api.put("rooms/1", { name: "Update" });
    await api.patch("rooms/1", { wifi: true });
    await api.delete("rooms/1");

    assert.deepEqual(
      calls.map(({ method }) => method),
      ["get", "post", "put", "patch", "delete"],
    );
    assert.equal(calls[0].baseURL, "https://backend.example.test/api/");
    assert.equal(calls[0].timeout, 7000);
    assert.equal(calls[0].headers.get("tokenCybersoft"), "server-token");

    delete process.env.CYBERSOFT_TOKEN;
    await assert.rejects(
      () => api.get("rooms"),
      (error) => error instanceof BackendApiConfigError,
    );

    process.env.CYBERSOFT_TOKEN = "server-token";
    process.env.API_BASE_URL = "invalid-url";
    await assert.rejects(
      () => api.get("rooms"),
      (error) => error instanceof BackendApiConfigError,
    );
  } finally {
    api.defaults.adapter = original.adapter;
    for (const [key, value] of Object.entries({
      API_BASE_URL: original.base,
      CYBERSOFT_TOKEN: original.token,
      API_TIMEOUT_MS: original.timeout,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
