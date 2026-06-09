import { useLanguage } from '../i18n/LanguageContext';

// Fixed placeholder bar heights (percent) — one per month
const BAR_HEIGHTS = [35, 55, 42, 68, 30, 50];

export default function Statistics() {
  const { t } = useLanguage();
  const s = t.statistics;

  return (
    <div className="page">
      <h1>{s.title}</h1>
      <p className="subtitle">{s.subtitle}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {[s.expensesByCategory, s.monthlyEvolution].map(title => (
          <div key={title} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '24px', boxShadow: 'var(--shadow)',
            minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{title}</div>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--border)', fontSize: '0.8rem', letterSpacing: '0.05em',
            }}>
              {s.chartPlaceholder}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '24px', boxShadow: 'var(--shadow)',
      }}>
        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          {s.monthlySummary}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
          {s.months.map((month, index) => (
            <div key={month} style={{ textAlign: 'center' }}>
              <div style={{
                height: '80px', background: 'var(--accent-light)', borderRadius: '6px',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                paddingBottom: '8px', marginBottom: '6px',
              }}>
                <div style={{
                  width: '60%', background: 'var(--accent)', borderRadius: '4px',
                  height: `${BAR_HEIGHTS[index]}%`, opacity: 0.4,
                }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="placeholder-card" style={{ marginTop: '24px' }}>
        <span className="icon">📊</span>
        <span>{s.placeholder}</span>
      </div>
    </div>
  );
}
