import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import './Statistics.css';
import { getStatistics } from '../services/statistics';
import { useLanguage } from '../i18n/LanguageContext';
import { INCOME_COLOR, EXPENSE_COLOR, CATEGORY_COLORS } from '../styles/colors';

// Recharts requires style configuration as plain JS objects — these cannot be
// expressed as CSS classes since they are passed as library API props, not as
// HTML element style attributes.
const TOOLTIP_STYLE = { borderRadius: 8, border: '1px solid #E2E6EC', fontSize: 13 };
const TOOLTIP_CURSOR = { fill: '#F7F8FA' };
const LEGEND_STYLE = { fontSize: 13 };
const PIE_LEGEND_STYLE = { fontSize: 12, paddingTop: 8 };
const AXIS_TICK = { fontSize: 12, fill: '#6B7280' };

function formatRON(amount, lang) {
  return (
    new Intl.NumberFormat(lang === 'ro' ? 'ro-RO' : 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' RON'
  );
}

function formatRONFull(amount, lang) {
  return (
    new Intl.NumberFormat(lang === 'ro' ? 'ro-RO' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ' RON'
  );
}

export default function Statistics() {
  const { t, lang } = useLanguage();
  const s = t.statistics;

  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getStatistics()
      .then(setStats)
      .catch(() => setError(s.errorLoading))
      .finally(() => setLoading(false));
  }, []);

  const chartData = stats
    ? stats.monthlyTrend.map(point => ({
        month:    s.months[point.monthIndex],
        income:   point.income,
        expenses: point.expenses,
      }))
    : [];

  return (
    <div className="page">
      <h1>{s.title}</h1>
      <p className="subtitle">{s.subtitle}</p>

      {loading && <p className="stats-loading">{s.loading}</p>}
      {error   && <p className="stats-error">⚠️ {error}</p>}

      {!loading && !error && stats && (
        <>
          <ChartCard title={s.monthlyOverview} className="chart-card--mb">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E6EC" vertical={false} />
                <XAxis dataKey="month" tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k`} tick={AXIS_TICK} axisLine={false} tickLine={false} />
                <Tooltip formatter={v => formatRON(v, lang)} contentStyle={TOOLTIP_STYLE} cursor={TOOLTIP_CURSOR} />
                <Legend wrapperStyle={LEGEND_STYLE} />
                <Bar dataKey="income"   name={s.income}   fill={INCOME_COLOR}  radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name={s.expenses} fill={EXPENSE_COLOR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="stats-bottom-grid">
            <ChartCard title={s.expensesByCategory}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={stats.expensesByCategory}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%" cy="45%"
                    innerRadius={60} outerRadius={100}
                    paddingAngle={2}
                  >
                    {stats.expensesByCategory.map((_, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={v => formatRON(v, lang)} contentStyle={TOOLTIP_STYLE} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={PIE_LEGEND_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title={s.sixMonthSummary}>
              <div className="kpi-summary">
                <KpiRow label={s.totalIncome}   value={formatRONFull(stats.totalIncome, lang)}   variant="income"  pct={100} />
                <KpiRow label={s.totalExpenses} value={formatRONFull(stats.totalExpenses, lang)} variant="expense" pct={Math.round((stats.totalExpenses / stats.totalIncome) * 100)} />
                <KpiRow label={s.netSavings}    value={formatRONFull(stats.netSavings, lang)}    variant="income"  pct={stats.savingsRate} />
                <div className="savings-divider">
                  <p className="savings-label">{s.savingsRate}</p>
                  <p className="savings-rate">{stats.savingsRate}%</p>
                </div>
              </div>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

function ChartCard({ title, children, className = '' }) {
  return (
    <div className={`chart-card${className ? ` ${className}` : ''}`}>
      <div className="chart-card__title">{title}</div>
      {children}
    </div>
  );
}

function KpiRow({ label, value, variant, pct }) {
  return (
    <div>
      <div className="kpi-row__header">
        <span className="kpi-row__label">{label}</span>
        <span className={`kpi-row__value kpi-row__value--${variant}`}>{value}</span>
      </div>
      <div className="kpi-row__track">
        <div
          className={`kpi-row__bar kpi-row__bar--${variant}`}
          style={{ '--bar-pct': `${pct}%` }}
        />
      </div>
    </div>
  );
}
