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

// mock-only store: verificationId → { code, payload, expiresAt }
const _pending = new Map<string, { code: string; payload: RegisterRequest; expiresAt: number }>();

export async function login(payload: LoginRequest): Promise<AuthUser> {
  return apiPostPublic<AuthUser>('/auth/login', payload);
}

export async function register(payload: RegisterRequest): Promise<AuthUser> {
  return apiPostPublic<AuthUser>('/auth/register', payload);
}

export async function sendVerification(payload: RegisterRequest): Promise<{ verificationId: string }> {
  // real: return apiPostPublic('/auth/send-verification', payload);
  return new Promise(resolve => {
    setTimeout(() => {
      const code           = String(Math.floor(100000 + Math.random() * 900000));
      const verificationId = crypto.randomUUID();
      _pending.set(verificationId, { code, payload, expiresAt: Date.now() + 10 * 60 * 1000 });
      console.log(`[DEV] Verification code for ${payload.email}: ${code}`);
      resolve({ verificationId });
    }, 800);
  });
}

export async function verifyEmail(req: VerifyEmailRequest): Promise<AuthUser> {
  // real: return apiPostPublic('/auth/verify-email', req);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const pending = _pending.get(req.verificationId);
      if (!pending || Date.now() > pending.expiresAt) {
        _pending.delete(req.verificationId);
        reject(new Error(AUTH_ERRORS.CODE_EXPIRED));
        return;
      }
      if (req.code !== pending.code) {
        reject(new Error(AUTH_ERRORS.INVALID_CODE));
        return;
      }
      _pending.delete(req.verificationId);
      resolve({
        id:    crypto.randomUUID(),
        name:  pending.payload.name,
        email: pending.payload.email,
        token: `mock-token-${Date.now()}`,
      });
    }, 600);
  });
}

export async function logout(): Promise<void> {
  await apiPost('/auth/logout');
}
