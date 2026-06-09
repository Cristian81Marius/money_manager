export default function Statistici() {
  const luni = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun'];

  return (
    <div className="page">
      <h1>Statistici</h1>
      <p className="subtitle">Vizualizează evoluția cheltuielilor și veniturilor tale.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {['Cheltuieli pe categorie', 'Evoluție lunară'].map(title => (
          <div key={title} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '24px', boxShadow: 'var(--shadow)',
            minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{title}</div>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--border)', fontSize: '0.8rem', letterSpacing: '0.05em'
            }}>
              [ grafic placeholder ]
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '24px', boxShadow: 'var(--shadow)'
      }}>
        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Sumar lunar
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
          {luni.map(luna => (
            <div key={luna} style={{ textAlign: 'center' }}>
              <div style={{
                height: '80px', background: 'var(--accent-light)', borderRadius: '6px',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                paddingBottom: '8px', marginBottom: '6px'
              }}>
                <div style={{
                  width: '60%', background: 'var(--accent)', borderRadius: '4px',
                  height: `${20 + Math.random() * 50}%`, opacity: 0.4
                }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{luna}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="placeholder-card" style={{ marginTop: '24px' }}>
        <span className="icon">📊</span>
        <span>Graficele reale vor fi generate cu Recharts sau Chart.js după importul tranzacțiilor.</span>
      </div>
    </div>
  );
}
