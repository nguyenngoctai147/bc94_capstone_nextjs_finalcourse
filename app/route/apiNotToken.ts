import { CORE_SIGNIN_ENDPOINT, CORE_SIGNUP_ENDPOINT } from "./core.api";

export const API_NOT_TOKEN = [CORE_SIGNIN_ENDPOINT, CORE_SIGNUP_ENDPOINT] as const;

export const isApiNotToken = (endpoint: string) => API_NOT_TOKEN.includes(endpoint as typeof API_NOT_TOKEN[number]);
