// Service layer for dashboard / home screen data.
//
// Replace getDashboardSummary with a real fetch call when the backend is ready.
// The shape of DashboardSummary and Transaction is the contract the API should honour.

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;     // ISO yyyy-mm-dd
  category: string;
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

export async function getDashboardSummary(): Promise<DashboardSummary> {
  // --- MOCK ---------------------------------------------------------------
  await new Promise((resolve) => setTimeout(resolve, 600));
  return MOCK_SUMMARY;

  // --- REAL API (enable when the backend is ready) ------------------------
  // const res = await fetch('/api/dashboard');
  // if (!res.ok) throw new Error(`Failed to load dashboard (${res.status})`);
  // return (await res.json()) as DashboardSummary;
}
