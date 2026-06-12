import { apiPostForm } from './apiClient';

export const BANKS = [
  'BCR',
  'BRD',
  'ING',
  'Raiffeisen',
  'BT',
  'UniCredit',
  'CEC',
  'Other',
] as const;

export type Bank = (typeof BANKS)[number];

export interface UploadBankStatementRequest {
  bank: Bank;
  startDate?: string;
  endDate?: string;
  file: File;
}

export interface UploadBankStatementResponse {
  statementId: string;
  bank: Bank;
  importedCount: number;
}

export async function uploadBankStatement(
  payload: UploadBankStatementRequest,
): Promise<UploadBankStatementResponse> {
  const form = new FormData();
  form.append('bank', payload.bank);
  if (payload.startDate) form.append('startDate', payload.startDate);
  if (payload.endDate)   form.append('endDate',   payload.endDate);
  form.append('file', payload.file);
  return apiPostForm<UploadBankStatementResponse>('/statements/upload', form);
}
