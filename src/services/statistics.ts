import { apiGet } from './apiClient';

export interface MonthlyPoint {
  /** 0-based offset from the fromMonth — 0 = oldest, last = most recent. */
  monthIndex: number;
  income: number;
  expenses: number;
}

export interface CategoryAmount {
  category: string;
  amount: number;
}

export interface StatisticsQuery {
  /** YYYY-MM — start of the period (inclusive). Defaults to 6 months before toMonth. */
  fromMonth?: string;
  /** YYYY-MM — end of the period (inclusive). Defaults to the current month. */
  toMonth?: string;
}

export interface StatisticsData {
  monthlyTrend: MonthlyPoint[];
  expensesByCategory: CategoryAmount[];
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
}

export async function getStatistics(query?: StatisticsQuery): Promise<StatisticsData> {
  return apiGet<StatisticsData>('/statistics', {
    fromMonth: query?.fromMonth,
    toMonth:   query?.toMonth,
  });
}
