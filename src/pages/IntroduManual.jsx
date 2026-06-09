export default function IntroduManual() {
  return (
    <div className="page">
      <h1>Introdu manual</h1>
      <p className="subtitle">Adaugă o tranzacție manual dacă nu ai un extras de cont disponibil.</p>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '32px', boxShadow: 'var(--shadow)',
        display: 'flex', flexDirection: 'column', gap: '20px'
      }}>
        {[
          { label: 'Descriere', type: 'text', placeholder: 'ex: Cumpărături Lidl' },
          { label: 'Sumă (RON)', type: 'number', placeholder: '0.00' },
          { label: 'Data', type: 'date', placeholder: '' },
          { label: 'Categorie', type: 'select' },
        ].map(field => (
          <div key={field.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select disabled style={inputStyle}>
                <option>— selectează —</option>
                <option>Mâncare</option>
                <option>Transport</option>
                <option>Utilități</option>
                <option>Divertisment</option>
                <option>Altele</option>
              </select>
            ) : (
              <input type={field.type} placeholder={field.placeholder} disabled style={inputStyle} />
            )}
          </div>
        ))}

        <button disabled style={{
          background: 'var(--accent)', color: 'white', border: 'none',
          borderRadius: '8px', padding: '12px', fontSize: '0.9rem',
          fontWeight: '600', cursor: 'not-allowed', opacity: 0.6, marginTop: '8px'
        }}>
          Salvează tranzacția
        </button>
      </div>

      <div className="placeholder-card" style={{ marginTop: '24px' }}>
        <span className="icon">ℹ️</span>
        <span>Formularul va fi activat după implementarea logicii de stocare.</span>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '10px 14px', border: '1px solid var(--border)',
  borderRadius: '8px', fontSize: '0.9rem', background: '#FAFAFA',
  fontFamily: 'var(--font-body)', color: 'var(--text-primary)'
};
