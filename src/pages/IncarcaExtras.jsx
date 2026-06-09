export default function IncarcaExtras() {
  return (
    <div className="page">
      <h1>Încarcă extras de cont</h1>
      <p className="subtitle">Importă automat tranzacțiile din fișierul exportat de bancă (PDF sau CSV).</p>

      <div style={{
        background: 'var(--surface)', border: '2px dashed var(--border)',
        borderRadius: 'var(--radius)', padding: '60px 32px',
        textAlign: 'center', boxShadow: 'var(--shadow)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📂</div>
        <p style={{ fontWeight: '600', marginBottom: '8px' }}>Trage fișierul aici sau apasă pentru a-l alege</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>Formate acceptate: PDF, CSV — max. 10 MB</p>
        <button style={{
          background: 'var(--accent)', color: 'white', border: 'none',
          borderRadius: '8px', padding: '10px 24px', fontSize: '0.9rem',
          fontWeight: '600', cursor: 'pointer'
        }}>
          Alege fișier
        </button>
      </div>

      <div className="placeholder-card" style={{ marginTop: '24px' }}>
        <span className="icon">ℹ️</span>
        <span>Logica de parsare a extraselor (BCR, BRD, ING etc.) va fi implementată ulterior.</span>
      </div>
    </div>
  );
}
