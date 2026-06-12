import { apiGet } from './apiClient';

export interface Categories {
  income: string[];
  expense: string[];
}

export async function getCategories(): Promise<Categories> {
  return apiGet<Categories>('/categories');
}
