// Service layer for uploading bank statements.
//
// The backend is not available yet, so `uploadBankStatement` is a mock that
// resolves after a short delay. When the real API is ready, replace the mock
// block with the commented-out fetch call at the bottom — request/response
// types and call sites do not need to change.

/** Banks available for selection in the Upload Statement form. */
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

/** Payload sent to the API when importing a bank statement. */
export interface UploadBankStatementRequest {
  bank: Bank;
  /** ISO date (yyyy-mm-dd). When provided, only import transactions from this date onward. */
  startDate?: string;
  /** ISO date (yyyy-mm-dd). When provided, only import transactions up to this date. */
  endDate?: string;
  file: File;
}

/** Shape returned by the API after a successful import. */
export interface UploadBankStatementResponse {
  statementId: string;
  bank: Bank;
  importedCount: number;
}

const MOCK_DELAY_MS = 1200;

/**
 * Upload a bank statement file for parsing and import.
 *
 * Placeholder: simulates network latency and returns a fake response.
 * Replace the mock block with the real fetch call once the backend is ready.
 */
export async function uploadBankStatement(
  payload: UploadBankStatementRequest,
): Promise<UploadBankStatementResponse> {
  if (!payload.file) {
    throw new Error('A file is required to upload a statement.');
  }

  // --- MOCK ---------------------------------------------------------------
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  return {
    statementId: `mock-${payload.bank.toLowerCase()}-${payload.file.name}`,
    bank: payload.bank,
    importedCount: (payload.file.size % 50) + 1,
  };

  // --- REAL API (enable when the backend is ready) ------------------------
  // const body = new FormData();
  // body.append('bank', payload.bank);
  // if (payload.startDate) body.append('startDate', payload.startDate);
  // if (payload.endDate) body.append('endDate', payload.endDate);
  // body.append('file', payload.file);
  //
  // const res = await fetch('/api/statements/upload', { method: 'POST', body });
  // if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
  // return (await res.json()) as UploadBankStatementResponse;
}
