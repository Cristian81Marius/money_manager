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

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_TAKEN:         'EMAIL_TAKEN',
} as const;

export async function login(payload: LoginRequest): Promise<AuthUser> {
  return apiPostPublic<AuthUser>('/auth/login', payload);
}

export async function register(payload: RegisterRequest): Promise<AuthUser> {
  return apiPostPublic<AuthUser>('/auth/register', payload);
}

export async function logout(): Promise<void> {
  await apiPost('/auth/logout');
}
