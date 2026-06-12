import { apiGet } from './apiClient';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category: string;
}

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

export async function getDashboardSummary(query?: DashboardQuery): Promise<DashboardSummary> {
  return apiGet<DashboardSummary>('/dashboard', { month: query?.month });
}
