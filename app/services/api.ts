import axios from "axios";
import { getBackendConfig } from "@/services/api-utils";

const api = axios.create({
  responseType: "arraybuffer",
  maxRedirects: 0,
  maxBodyLength: 10 * 1024 * 1024,
  maxContentLength: 20 * 1024 * 1024,
  validateStatus: () => true,
});

api.interceptors.request.use((config) => {
  const { baseURL, tokenCybersoft, timeout } = getBackendConfig();
  config.baseURL = baseURL;
  config.timeout = timeout;
  config.headers.set("tokenCybersoft", tokenCybersoft);
  return config;
});

export default api;
