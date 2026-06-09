import { useState } from 'react';
import { addTransaction } from '../services/transactions';
import { useLanguage } from '../i18n/LanguageContext';

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const emptyForm = {
  type: '',         // 'income' | 'expense'
  description: '',
  amount: '',
  date: todayISO(),
  category: '',
  notes: '',
};

export default function AddTransaction() {
  const { t } = useLanguage();
  const a = t.addTransaction;

  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const isLoading = status === 'loading';
  const categories = form.type === 'income' ? a.incomeCategories : a.expenseCategories;

  function updateField(name, value) {
    // Reset category when switching type so a stale income category isn't
    // submitted on an expense form (and vice-versa).
    if (name === 'type') {
      setForm((prev) => ({ ...prev, type: value, category: '' }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function validate() {
    if (!form.type)                          return a.errorNoType;
    if (!form.description.trim())            return a.errorNoDescription;
    if (form.amount === '')                  return a.errorNoAmount;
    if (parseFloat(form.amount) <= 0)        return a.errorInvalidAmount;
    if (!form.date)                          return a.errorNoDate;
    if (!form.category)                      return a.errorNoCategory;
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
      const response = await addTransaction({
        type: form.type,
        description: form.description.trim(),
        amount: parseFloat(form.amount),
        date: form.date,
        category: form.category,
        notes: form.notes.trim() || undefined,
      });
      setResult(response);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
      setStatus('error');
    }
  }

  function resetForm() {
    setForm({ ...emptyForm, date: todayISO() });
    setStatus('idle');
    setError('');
    setResult(null);
  }

  return (
    <div className="page">
      <h1>{a.title}</h1>
      <p className="subtitle">{a.subtitle}</p>

      <form onSubmit={handleSubmit} style={cardStyle}>

        {/* Type toggle */}
        <Field label={a.typeLabel}>
          <div style={typeToggleWrap}>
            <TypeButton
              active={form.type === 'income'}
              variant="income"
              disabled={isLoading}
              onClick={() => updateField('type', 'income')}
            >
              ↑ {a.typeIncome}
            </TypeButton>
            <TypeButton
              active={form.type === 'expense'}
              variant="expense"
              disabled={isLoading}
              onClick={() => updateField('type', 'expense')}
            >
              ↓ {a.typeExpense}
            </TypeButton>
          </div>
        </Field>

        {/* Description */}
        <Field label={a.descriptionLabel}>
          <input
            type="text"
            value={form.description}
            placeholder={a.descriptionPlaceholder}
            onChange={(e) => updateField('description', e.target.value)}
            disabled={isLoading}
            style={inputStyle}
          />
        </Field>

        {/* Amount + Date */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 160px' }}>
            <Field label={a.amountLabel}>
              <input
                type="number"
                value={form.amount}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                onChange={(e) => updateField('amount', e.target.value)}
                disabled={isLoading}
                style={{ ...inputStyle, color: amountColor(form.type) }}
              />
            </Field>
          </div>
          <div style={{ flex: '1 1 160px' }}>
            <Field label={a.dateLabel}>
              <input
                type="date"
                value={form.date}
                onChange={(e) => updateField('date', e.target.value)}
                disabled={isLoading}
                style={inputStyle}
              />
            </Field>
          </div>
        </div>

        {/* Category */}
        <Field label={a.categoryLabel}>
          <select
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
            disabled={isLoading || !form.type}
            style={{ ...inputStyle, color: form.category ? 'var(--text-primary)' : 'var(--text-secondary)' }}
          >
            <option value="">{a.categoryPlaceholder}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </Field>

        {/* Notes — optional */}
        <Field label={a.notesLabel}>
          <textarea
            value={form.notes}
            placeholder={a.notesPlaceholder}
            rows={3}
            onChange={(e) => updateField('notes', e.target.value)}
            disabled={isLoading}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
          />
        </Field>

        {/* Feedback */}
        {status === 'error' && error && (
          <div style={{ ...feedbackStyle, background: '#FEF2F2', color: 'var(--danger)' }}>
            ⚠️ {error}
          </div>
        )}
        {status === 'success' && result && (
          <div style={{ ...feedbackStyle, background: 'var(--accent-light)', color: 'var(--accent)' }}>
            ✅ {a.successMessage}
            <span style={{ display: 'block', fontSize: '0.8rem', marginTop: '4px', opacity: 0.8 }}>
              {result.type === 'income' ? '+' : '−'} {Number(result.amount).toFixed(2)} RON · {result.category} · {result.date}
            </span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
          <button type="submit" disabled={isLoading} style={primaryButtonStyle(isLoading)}>
            {isLoading
              ? <><span className="spinner" /> {a.loadingButton}</>
              : a.saveButton
            }
          </button>
          {status === 'success' && (
            <button type="button" onClick={resetForm} style={secondaryButtonStyle}>
              {a.addAnother}
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

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

function TypeButton({ active, variant, disabled, onClick, children }) {
  const bg = active
    ? variant === 'income' ? 'var(--accent)' : '#DC2626'
    : 'var(--surface)';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1, padding: '13px 16px', border: 'none',
        background: bg, color: active ? 'white' : 'var(--text-secondary)',
        fontSize: '0.95rem', fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-body)', transition: 'background 0.15s, color 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
      }}
    >
      {children}
    </button>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function amountColor(type) {
  if (type === 'income')  return 'var(--accent)';
  if (type === 'expense') return '#DC2626';
  return 'var(--text-primary)';
}

// ── Styles ────────────────────────────────────────────────────────────────────

const cardStyle = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', padding: '32px', boxShadow: 'var(--shadow)',
  display: 'flex', flexDirection: 'column', gap: '20px',
};

const typeToggleWrap = {
  display: 'flex', borderRadius: '10px', overflow: 'hidden',
  border: '1px solid var(--border)',
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
