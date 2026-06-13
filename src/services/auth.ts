import { apiPost, apiPostPublic } from './apiClient';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  verificationId: string;
  code: string;
}

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_TAKEN:         'EMAIL_TAKEN',
  INVALID_CODE:        'INVALID_CODE',
  CODE_EXPIRED:        'CODE_EXPIRED',
} as const;

export async function login(payload: LoginRequest): Promise<AuthUser> {
  return apiPostPublic<AuthUser>('/auth/login', payload);
}

export async function register(payload: RegisterRequest): Promise<AuthUser> {
  return apiPostPublic<AuthUser>('/auth/register', payload);
}

export async function sendVerification(payload: RegisterRequest): Promise<{ verificationId: string }> {
  return apiPostPublic<{ verificationId: string }>('/auth/send-verification', payload);
  // mock: const code = String(Math.floor(100000 + Math.random() * 900000));
  // mock: const verificationId = crypto.randomUUID();
  // mock: console.log(`[DEV] code for ${payload.email}: ${code}`);
  // mock: return new Promise(r => setTimeout(() => r({ verificationId }), 800));
}

export async function verifyEmail(req: VerifyEmailRequest): Promise<AuthUser> {
  return apiPostPublic<AuthUser>('/auth/verify-email', req);
  // mock: return new Promise((res, rej) => setTimeout(() => rej(new Error(AUTH_ERRORS.INVALID_CODE)), 600));
}

export async function logout(): Promise<void> {
  await apiPost('/auth/logout');
}
