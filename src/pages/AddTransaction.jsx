import { useState } from 'react';
import './AddTransaction.css';
import { addTransaction } from '../services/transactions';
import { useLanguage } from '../i18n/LanguageContext';

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const emptyForm = { type: '', description: '', amount: '', date: todayISO(), category: '', notes: '' };

export default function AddTransaction() {
  const { t } = useLanguage();
  const a = t.addTransaction;

  const [form, setForm]     = useState(emptyForm);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError]   = useState('');
  const [result, setResult] = useState(null);

  const isLoading  = status === 'loading';
  const categories = form.type === 'income' ? a.incomeCategories : a.expenseCategories;

  function updateField(name, value) {
    if (name === 'type') {
      // Reset category when type changes so a stale selection isn't submitted
      setForm(prev => ({ ...prev, type: value, category: '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function validate() {
    if (!form.type)                   return a.errorNoType;
    if (!form.description.trim())     return a.errorNoDescription;
    if (form.amount === '')           return a.errorNoAmount;
    if (parseFloat(form.amount) <= 0) return a.errorInvalidAmount;
    if (!form.date)                   return a.errorNoDate;
    if (!form.category)               return a.errorNoCategory;
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setStatus('error'); setError(validationError); return; }

    setStatus('loading');
    setError('');
    setResult(null);

    try {
      const response = await addTransaction({
        type:        form.type,
        description: form.description.trim(),
        amount:      parseFloat(form.amount),
        date:        form.date,
        category:    form.category,
        notes:       form.notes.trim() || undefined,
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

      <form onSubmit={handleSubmit} className="form-card">

        <Field label={a.typeLabel}>
          <div className="type-toggle">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => updateField('type', 'income')}
              className={`type-btn type-btn--income${form.type === 'income' ? ' active' : ''}`}
            >
              ↑ {a.typeIncome}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => updateField('type', 'expense')}
              className={`type-btn type-btn--expense${form.type === 'expense' ? ' active' : ''}`}
            >
              ↓ {a.typeExpense}
            </button>
          </div>
        </Field>

        <Field label={a.descriptionLabel}>
          <input
            type="text"
            value={form.description}
            placeholder={a.descriptionPlaceholder}
            onChange={e => updateField('description', e.target.value)}
            disabled={isLoading}
            className="form-input"
          />
        </Field>

        <div className="form-row">
          <div className="form-row-col">
            <Field label={a.amountLabel}>
              <input
                type="number"
                value={form.amount}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                onChange={e => updateField('amount', e.target.value)}
                disabled={isLoading}
                className={`form-input${form.type ? ` form-input--${form.type}` : ''}`}
              />
            </Field>
          </div>
          <div className="form-row-col">
            <Field label={a.dateLabel}>
              <input
                type="date"
                value={form.date}
                onChange={e => updateField('date', e.target.value)}
                disabled={isLoading}
                className="form-input"
              />
            </Field>
          </div>
        </div>

        <Field label={a.categoryLabel}>
          <select
            value={form.category}
            onChange={e => updateField('category', e.target.value)}
            disabled={isLoading || !form.type}
            className={`form-input${!form.category ? ' form-input--unselected' : ''}`}
          >
            <option value="">{a.categoryPlaceholder}</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </Field>

        <Field label={a.notesLabel}>
          <textarea
            value={form.notes}
            placeholder={a.notesPlaceholder}
            rows={3}
            onChange={e => updateField('notes', e.target.value)}
            disabled={isLoading}
            className="form-textarea"
          />
        </Field>

        {status === 'error' && (
          <div className="feedback feedback--error">⚠️ {error}</div>
        )}
        {status === 'success' && result && (
          <div className="feedback feedback--success">
            ✅ {a.successMessage}
            <span className="feedback__detail">
              {result.type === 'income' ? '+' : '−'} {Number(result.amount).toFixed(2)} RON · {result.category} · {result.date}
            </span>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? <><span className="spinner" /> {a.loadingButton}</> : a.saveButton}
          </button>
          {status === 'success' && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              {a.addAnother}
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}
