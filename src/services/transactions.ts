// Service layer for manually added transactions.
//
// `addTransaction` is a mock that resolves after a short delay.
// To connect to a real API, replace the mock block with the commented-out
// fetch call at the bottom — types and call sites stay the same.

/** Whether money entered or left the account. */
export type TransactionType = 'income' | 'expense';

/**
 * Payload sent to the API when saving a manual transaction.
 * `amount` is always a positive number; `type` determines the direction.
 */
export interface AddTransactionRequest {
  type: TransactionType;
  description: string;
  amount: number;
  date: string;     // ISO yyyy-mm-dd
  category: string;
  notes?: string;
}

/** Shape returned by the API after a successful save. */
export interface AddTransactionResponse {
  transactionId: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category: string;
  notes?: string;
}

const MOCK_DELAY_MS = 1000;

/**
 * Save a manually entered transaction.
 *
 * Placeholder: simulates network latency and returns a fake response.
 * Replace the mock block with the real fetch call once the backend is ready.
 */
export async function addTransaction(
  payload: AddTransactionRequest,
): Promise<AddTransactionResponse> {
  if (!payload.description || payload.amount <= 0 || !payload.date || !payload.category) {
    throw new Error('Invalid transaction payload.');
  }

  // --- MOCK ---------------------------------------------------------------
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  return {
    transactionId: `mock-${payload.type}-${payload.date}-${payload.amount}`,
    ...payload,
  };

  // --- REAL API (enable when the backend is ready) ------------------------
  // const res = await fetch('/api/transactions', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error(`Save failed with status ${res.status}`);
  // return (await res.json()) as AddTransactionResponse;
}
