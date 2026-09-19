export type ApiError = { message: string; status: number; errors?: Record<string, string> };
export type ApiEnvelope<T> = { statusCode: number; content: T; message?: string; dateTime?: string };
export type Page<T> = { data: T[]; totalRow: number; pageIndex: number; pageSize: number };
export type QueryParams = Record<string, string | number | boolean | undefined>;
export type RequestOptions = { signal?: AbortSignal; token?: string | null; params?: QueryParams };
export type PageQuery = { pageIndex?: number; pageSize?: number; keyword?: string };
