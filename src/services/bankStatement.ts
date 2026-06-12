import { apiGet, apiPostForm } from './apiClient';

export interface BankOption {
  id: string;
  name: string;
}

export interface UploadBankStatementRequest {
  bankId: string;
  startDate?: string;
  endDate?: string;
  file: File;
}

export interface UploadBankStatementResponse {
  statementId: string;
  bankId: string;
  importedCount: number;
}

export async function getBanks(): Promise<BankOption[]> {
  return apiGet<BankOption[]>('/banks');
}

export async function uploadBankStatement(
  payload: UploadBankStatementRequest,
): Promise<UploadBankStatementResponse> {
  const form = new FormData();
  form.append('bank', payload.bankId);
  if (payload.startDate) form.append('startDate', payload.startDate);
  if (payload.endDate)   form.append('endDate',   payload.endDate);
  form.append('file', payload.file);
  return apiPostForm<UploadBankStatementResponse>('/statements/upload', form);
}
