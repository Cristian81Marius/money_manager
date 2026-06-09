export default function Home() {
  return (
    <div className="page">
      <h1>Bun venit!</h1>
      <p className="subtitle">Gestionează-ți finanțele personale într-un singur loc.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Sold total', value: '—', icon: '💰' },
          { label: 'Venituri luna aceasta', value: '—', icon: '📈' },
          { label: 'Cheltuieli luna aceasta', value: '—', icon: '📉' },
          { label: 'Tranzacții', value: '—', icon: '🔄' },
        ].map(card => (
          <div key={card.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '20px', boxShadow: 'var(--shadow)'
          }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{card.icon}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>{card.label}</div>
            <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="placeholder-card">
        <span className="icon">📋</span>
        <span>Activitate recentă va apărea aici după ce adaugi tranzacții.</span>
      </div>
    </div>
  );
}
