import { CORE_LOGIN_ENDPOINT, CORE_SIGNUP_ENDPOINT } from "./core.api";

/** Backend endpoints that do not require the logged-in user's token header. */
export const API_NOT_TOKEN = [CORE_LOGIN_ENDPOINT, CORE_SIGNUP_ENDPOINT] as const;

export const isApiNotToken = (endpoint: string) => API_NOT_TOKEN.includes(endpoint as typeof API_NOT_TOKEN[number]);
