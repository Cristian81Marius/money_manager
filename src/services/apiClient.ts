// Central HTTP client for all backend communication.
//
// Every request automatically attaches the JWT Bearer token stored in
// localStorage (written there by AuthContext after login/register).
// Non-2xx responses are normalised into thrown Error objects whose message is
// the machine-readable `error` code from the backend JSON body — the same
// codes the service files and UI already use (AUTH_ERRORS, etc.).
//
// Base URL resolution order:
//   1. VITE_API_BASE_URL environment variable (set in .env.local or CI)
//   2. '/api/v1'  →  forwarded to http://localhost:8080 by the Vite dev proxy
//      (see vite.config.js)

const STORAGE_KEY = 'mm_user';

// TODO: create .env.local and add  VITE_API_BASE_URL=http://localhost:8080/api/v1
export const BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

// All error codes the backend can return in the `error` field of an error body.
export const API_ERRORS = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_TAKEN:         'EMAIL_TAKEN',
  UNAUTHORIZED:        'UNAUTHORIZED',
  NOT_FOUND:           'NOT_FOUND',
  VALIDATION_ERROR:    'VALIDATION_ERROR',
  FILE_TOO_LARGE:      'FILE_TOO_LARGE',
  UNSUPPORTED_FORMAT:  'UNSUPPORTED_FORMAT',
  SERVER_ERROR:        'SERVER_ERROR',
} as const;

export type ApiErrorCode = (typeof API_ERRORS)[keyof typeof API_ERRORS];

interface ApiErrorBody {
  error: ApiErrorCode;
  message?: string;
  details?: Record<string, string>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return (JSON.parse(raw) as { token: string }).token ?? null;
  } catch {
    return null;
  }
}

function bearerHeaders(isJson: boolean): Record<string, string> {
  const headers: Record<string, string> = {};
  if (isJson) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  // 204 No Content — treat as a successful void response
  if (res.status === 204) return undefined as unknown as T;

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const err = body as ApiErrorBody | null;
    throw new Error(err?.error ?? API_ERRORS.SERVER_ERROR);
  }

  return body as T;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Authenticated GET request.
 * Pass `params` to append query string entries; undefined values are skipped.
 */
export async function apiGet<T>(
  path: string,
  params?: Record<string, string | undefined>,
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, v);
    });
  }
  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: bearerHeaders(false),
  });
  return handleResponse<T>(res);
}

/**
 * Authenticated POST request with a JSON body.
 */
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: bearerHeaders(true),
    body:    body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(res);
}

/**
 * Unauthenticated POST request with a JSON body.
 * Used for login and register — no token is available yet.
 */
export async function apiPostPublic<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    body !== undefined ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(res);
}

/**
 * Authenticated POST request with a multipart/form-data body.
 * Do NOT set Content-Type manually — the browser adds it with the correct
 * multipart boundary when the body is a FormData instance.
 */
export async function apiPostForm<T>(path: string, formData: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });
  return handleResponse<T>(res);
}
