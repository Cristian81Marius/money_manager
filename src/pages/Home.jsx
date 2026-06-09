import { useLanguage } from '../i18n/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const { home: h } = t;

  const summaryCards = [
    { label: h.totalBalance,       icon: '💰' },
    { label: h.incomeThisMonth,    icon: '📈' },
    { label: h.expensesThisMonth,  icon: '📉' },
    { label: h.transactions,       icon: '🔄' },
  ];

  return (
    <div className="page">
      <h1>{h.title}</h1>
      <p className="subtitle">{h.subtitle}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {summaryCards.map(card => (
          <div key={card.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '20px', boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{card.icon}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{card.label}</div>
            <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>—</div>
          </div>
        ))}
      </div>

      <div className="placeholder-card">
        <span className="icon">📋</span>
        <span>{h.recentActivity}</span>
      </div>
    </div>
  );
}
