import { useRef, useState } from 'react';
import { BANKS, uploadBankStatement } from '../services/bankStatement';
import { useLanguage } from '../i18n/LanguageContext';

const emptyForm = { bank: '', startDate: '', endDate: '', file: null };

export default function UploadStatement() {
  const { t } = useLanguage();
  const s = t.uploadStatement;

  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const isLoading = status === 'loading';

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!form.bank) return s.errorNoBank;
    if (!form.file) return s.errorNoFile;
    if (form.startDate && form.endDate && form.startDate > form.endDate) return s.errorDateRange;
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setStatus('error');
      setError(validationError);
      return;
    }

    setStatus('loading');
    setError('');
    setResult(null);

    try {
      const response = await uploadBankStatement({
        bank: form.bank,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        file: form.file,
      });
      setResult(response);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
      setStatus('error');
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setStatus('idle');
    setError('');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="page">
      <h1>{s.title}</h1>
      <p className="subtitle">{s.subtitle}</p>

      <form onSubmit={handleSubmit} style={cardStyle}>
        {/* Bank — required */}
        <Field label={s.bankLabel}>
          <select
            value={form.bank}
            onChange={(e) => updateField('bank', e.target.value)}
            disabled={isLoading}
            required
            style={inputStyle}
          >
            <option value="">{s.bankPlaceholder}</option>
            {BANKS.map((bank) => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </Field>

        {/* Optional date range */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 180px' }}>
            <Field label={s.startDateLabel}>
              <input
                type="date"
                value={form.startDate}
                max={form.endDate || undefined}
                onChange={(e) => updateField('startDate', e.target.value)}
                disabled={isLoading}
                style={inputStyle}
              />
            </Field>
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <Field label={s.endDateLabel}>
              <input
                type="date"
                value={form.endDate}
                min={form.startDate || undefined}
                onChange={(e) => updateField('endDate', e.target.value)}
                disabled={isLoading}
                style={inputStyle}
              />
            </Field>
          </div>
        </div>

        {/* File upload */}
        <Field label={s.fileLabel}>
          <div
            onClick={() => !isLoading && fileInputRef.current?.click()}
            style={{
              background: 'var(--surface)', border: '2px dashed var(--border)',
              borderRadius: 'var(--radius)', padding: '40px 32px',
              textAlign: 'center', cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📂</div>
            {form.file ? (
              <p style={{ fontWeight: '600' }}>{form.file.name}</p>
            ) : (
              <>
                <p style={{ fontWeight: '600', marginBottom: '8px' }}>{s.fileDragText}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.fileFormats}</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.csv"
              onChange={(e) => updateField('file', e.target.files?.[0] ?? null)}
              disabled={isLoading}
              style={{ display: 'none' }}
            />
          </div>
        </Field>

        {/* Feedback */}
        {status === 'error' && error && (
          <div style={{ ...feedbackStyle, background: '#FEF2F2', color: 'var(--danger)' }}>
            ⚠️ {error}
          </div>
        )}
        {status === 'success' && result && (
          <div style={{ ...feedbackStyle, background: 'var(--accent-light)', color: 'var(--accent)' }}>
            ✅ {s.successMessage} ({result.importedCount} {s.transactionsFound})
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <button type="submit" disabled={isLoading} style={primaryButtonStyle(isLoading)}>
            {isLoading ? (
              <><span className="spinner" /> {s.loadingButton}</>
            ) : (
              s.submitButton
            )}
          </button>
          {status === 'success' && (
            <button type="button" onClick={resetForm} style={secondaryButtonStyle}>
              {s.uploadAnother}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const cardStyle = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', padding: '32px', boxShadow: 'var(--shadow)',
  display: 'flex', flexDirection: 'column', gap: '20px',
};

const inputStyle = {
  width: '100%', padding: '10px 14px', border: '1px solid var(--border)',
  borderRadius: '8px', fontSize: '0.9rem', background: '#FAFAFA',
  fontFamily: 'var(--font-body)', color: 'var(--text-primary)',
};

const feedbackStyle = {
  padding: '12px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500',
};

function primaryButtonStyle(loading) {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    background: 'var(--accent)', color: 'white', border: 'none',
    borderRadius: '8px', padding: '12px 24px', fontSize: '0.9rem',
    fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1, minWidth: '160px',
  };
}

const secondaryButtonStyle = {
  background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)',
  borderRadius: '8px', padding: '12px 24px', fontSize: '0.9rem',
  fontWeight: '600', cursor: 'pointer',
};
