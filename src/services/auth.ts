// Auth service — login, register, logout.
//
// All functions are mock implementations. Replace the mock block in each with
// the commented-out apiClient call when the backend is ready.

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

// Error codes thrown by this service — map these to translation keys in the UI.
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_TAKEN:         'EMAIL_TAKEN',
} as const;

const MOCK_DELAY_MS = 800;

// Simulated account store — persists only for the lifetime of the browser tab.
const MOCK_ACCOUNTS: Array<{ name: string; email: string; password: string }> = [
  { name: 'Demo User', email: 'demo@moneymanager.ro', password: 'demo123' },
];

export async function login(payload: LoginRequest): Promise<AuthUser> {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));

  // --- MOCK ---------------------------------------------------------------
  const account = MOCK_ACCOUNTS.find(
    a => a.email === payload.email && a.password === payload.password,
  );
  if (!account) throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);

  return {
    id:    `user-${account.email}`,
    name:  account.name,
    email: account.email,
    token: `mock-token-${Date.now()}`,
  };

  // --- REAL API -----------------------------------------------------------
  // import { apiPostPublic } from './apiClient';   ← add to file imports
  // return apiPostPublic<AuthUser>('/auth/login', payload);
}

export async function register(payload: RegisterRequest): Promise<AuthUser> {
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));

  // --- MOCK ---------------------------------------------------------------
  if (MOCK_ACCOUNTS.some(a => a.email === payload.email)) {
    throw new Error(AUTH_ERRORS.EMAIL_TAKEN);
  }
  MOCK_ACCOUNTS.push({ name: payload.name, email: payload.email, password: payload.password });

  return {
    id:    `user-${payload.email}`,
    name:  payload.name,
    email: payload.email,
    token: `mock-token-${Date.now()}`,
  };

  // --- REAL API -----------------------------------------------------------
  // import { apiPostPublic } from './apiClient';   ← add to file imports
  // return apiPostPublic<AuthUser>('/auth/register', payload);
}

export async function logout(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));

  // --- REAL API -----------------------------------------------------------
  // import { apiPost } from './apiClient';   ← add to file imports
  // await apiPost('/auth/logout');
}
