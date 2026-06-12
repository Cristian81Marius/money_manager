import { apiGet, apiPatch } from './apiClient';

export interface UserPreferences {
  language: 'en' | 'ro';
  theme: 'light' | 'dark';
  profilePicture?: string;
}

export async function getPreferences(): Promise<UserPreferences> {
  return apiGet<UserPreferences>('/users/preferences');
}

export async function savePreferences(prefs: Partial<UserPreferences>): Promise<void> {
  await apiPatch('/users/preferences', prefs);
}
