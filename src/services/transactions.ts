import { apiPost } from './apiClient';

export type TransactionType = 'income' | 'expense';

export interface AddTransactionRequest {
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category: string;
  notes?: string;
}

export interface AddTransactionResponse {
  transactionId: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category: string;
  notes?: string;
}

export async function addTransaction(
  payload: AddTransactionRequest,
): Promise<AddTransactionResponse> {
  return apiPost<AddTransactionResponse>('/transactions', payload);
}
