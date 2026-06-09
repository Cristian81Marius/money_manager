// Service layer for dashboard / home screen data.
//
// Replace the mock block in getDashboardSummary with the commented-out
// apiClient call when the backend is ready.
// The shape of DashboardSummary and Transaction is the contract the API must honour.

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;     // ISO yyyy-mm-dd
  category: string;
}

/** Optional query parameters for the dashboard endpoint. */
export interface DashboardQuery {
  /** YYYY-MM — which month to use for income/expenses KPIs. Defaults to current month on the server. */
  month?: string;
}

export interface DashboardSummary {
  totalBalance: number;
  incomeThisMonth: number;
  expensesThisMonth: number;
  transactionCount: number;
  recentTransactions: Transaction[];
}

const MOCK_RECENT_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'expense', description: 'Lidl',              amount: 156.40,  date: '2025-06-08', category: 'Food & Drink'   },
  { id: 't2', type: 'expense', description: 'OMV Fuel',          amount: 280.00,  date: '2025-06-07', category: 'Transport'       },
  { id: 't3', type: 'expense', description: 'Telekom bill',      amount: 89.99,   date: '2025-06-05', category: 'Utilities'       },
  { id: 't4', type: 'expense', description: 'Netflix',           amount: 42.99,   date: '2025-06-04', category: 'Entertainment'   },
  { id: 't5', type: 'income',  description: 'Salary — June',     amount: 4500.00, date: '2025-06-01', category: 'Salary'          },
  { id: 't6', type: 'expense', description: 'Rent — June',       amount: 1200.00, date: '2025-06-01', category: 'Housing'         },
  { id: 't7', type: 'income',  description: 'Freelance project', amount: 1200.00, date: '2025-05-28', category: 'Freelance'       },
  { id: 't8', type: 'expense', description: 'Farmacia Catena',   amount: 87.50,   date: '2025-05-25', category: 'Health'          },
];

const MOCK_SUMMARY: DashboardSummary = {
  totalBalance:        12_432.50,
  incomeThisMonth:      4_500.00,
  expensesThisMonth:    1_769.38,
  transactionCount:        47,
  recentTransactions:  MOCK_RECENT_TRANSACTIONS,
};

export async function getDashboardSummary(query?: DashboardQuery): Promise<DashboardSummary> {
  // --- MOCK ---------------------------------------------------------------
  await new Promise((resolve) => setTimeout(resolve, 600));
  return MOCK_SUMMARY;

  // --- REAL API (enable when the backend is ready) ------------------------
  // import { apiGet } from './apiClient';   ← add to file imports
  // return apiGet<DashboardSummary>('/dashboard', { month: query?.month });
}
