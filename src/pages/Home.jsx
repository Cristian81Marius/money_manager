import { useEffect, useState } from 'react';
import './Home.css';
import { getDashboardSummary } from '../services/dashboard';
import { useLanguage } from '../i18n/LanguageContext';

function formatRON(amount, lang) {
  return (
    new Intl.NumberFormat(lang === 'ro' ? 'ro-RO' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ' RON'
  );
}

function formatDate(iso, lang) {
  return new Intl.DateTimeFormat(lang === 'ro' ? 'ro-RO' : 'en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso));
}

export default function Home() {
  const { t, lang } = useLanguage();
  const h = t.home;

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch(() => setError(h.errorLoading))
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = [
    { key: 'balance',  label: h.totalBalance,      icon: '💰', variant: 'income'  },
    { key: 'income',   label: h.incomeThisMonth,   icon: '📈', variant: 'income'  },
    { key: 'expenses', label: h.expensesThisMonth, icon: '📉', variant: 'expense' },
    { key: 'count',    label: h.transactions,      icon: '🔄', variant: 'income'  },
  ];

  function kpiValue(key) {
    if (!summary) return null;
    if (key === 'balance')  return formatRON(summary.totalBalance, lang);
    if (key === 'income')   return formatRON(summary.incomeThisMonth, lang);
    if (key === 'expenses') return formatRON(summary.expensesThisMonth, lang);
    if (key === 'count')    return String(summary.transactionCount);
    return null;
  }

  return (
    <div className="page">
      <h1>{h.title}</h1>
      <p className="subtitle">{h.subtitle}</p>

      <div className="kpi-grid">
        {kpiCards.map(card => (
          <div key={card.key} className="kpi-card">
            <div className="kpi-card__icon">{card.icon}</div>
            <div className="kpi-card__label">{card.label}</div>
            {loading
              ? <div className="skeleton" />
              : <div className={`kpi-card__value${card.variant === 'expense' ? ' kpi-card__value--expense' : ''}`}>
                  {kpiValue(card.key) ?? '—'}
                </div>
            }
          </div>
        ))}
      </div>

      <div className="tx-card">
        <div className="tx-card__title">{h.recentTransactions}</div>

        {loading && <p className="tx-card__loading">{h.loading}</p>}
        {error   && <p className="tx-card__error">⚠️ {error}</p>}

        {!loading && !error && summary?.recentTransactions.map(tx => (
          <div key={tx.id} className="tx-item">
            <div className={`tx-icon tx-icon--${tx.type}`}>
              {tx.type === 'income' ? '↑' : '↓'}
            </div>

            <div className="tx-info">
              <div className="tx-description">{tx.description}</div>
              <div className="tx-meta">
                <span className="tx-date">{formatDate(tx.date, lang)}</span>
                <span className="tx-badge">{tx.category}</span>
              </div>
            </div>

            <div className={`tx-amount tx-amount--${tx.type}`}>
              {tx.type === 'income' ? '+' : '−'} {formatRON(tx.amount, lang)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
