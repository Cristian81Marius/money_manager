// Service layer for the Statistics page.
//
// Replace getStatistics with a real fetch call when the backend is ready.
// monthIndex is 0-based (0 = Jan … 5 = Jun) so the UI can map it to a
// locale-appropriate month label without storing strings in the API response.

export interface MonthlyPoint {
  monthIndex: number;  // 0 = Jan, 1 = Feb … 5 = Jun
  income: number;
  expenses: number;
}

export interface CategoryAmount {
  category: string;
  amount: number;
}

export interface StatisticsData {
  monthlyTrend: MonthlyPoint[];
  expensesByCategory: CategoryAmount[];
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;  // 0–100 percentage
}

const MOCK_MONTHLY_TREND: MonthlyPoint[] = [
  { monthIndex: 0, income: 4_500, expenses: 2_847 },
  { monthIndex: 1, income: 4_500, expenses: 3_156 },
  { monthIndex: 2, income: 5_700, expenses: 2_634 },
  { monthIndex: 3, income: 4_500, expenses: 3_842 },
  { monthIndex: 4, income: 5_700, expenses: 2_956 },
  { monthIndex: 5, income: 4_500, expenses: 1_769 },
];

const MOCK_EXPENSES_BY_CATEGORY: CategoryAmount[] = [
  { category: 'Housing',       amount: 7_200 },
  { category: 'Food & Drink',  amount: 4_380 },
  { category: 'Transport',     amount: 1_620 },
  { category: 'Utilities',     amount: 1_140 },
  { category: 'Shopping',      amount: 1_080 },
  { category: 'Entertainment', amount:   630 },
  { category: 'Health',        amount:   564 },
  { category: 'Education',     amount:   390 },
];

const totalIncome   = MOCK_MONTHLY_TREND.reduce((s, m) => s + m.income,   0); // 29 400
const totalExpenses = MOCK_MONTHLY_TREND.reduce((s, m) => s + m.expenses, 0); // 17 204
const netSavings    = totalIncome - totalExpenses;
const savingsRate   = Math.round((netSavings / totalIncome) * 100);

export async function getStatistics(): Promise<StatisticsData> {
  // --- MOCK ---------------------------------------------------------------
  await new Promise((resolve) => setTimeout(resolve, 700));
  return {
    monthlyTrend:         MOCK_MONTHLY_TREND,
    expensesByCategory:   MOCK_EXPENSES_BY_CATEGORY,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
  };

  // --- REAL API (enable when the backend is ready) ------------------------
  // const res = await fetch('/api/statistics');
  // if (!res.ok) throw new Error(`Failed to load statistics (${res.status})`);
  // return (await res.json()) as StatisticsData;
}
