import { useEffect, useRef, useState } from 'react';
import './UploadStatement.css';
import { getBanks, uploadBankStatement } from '../services/bankStatement';
import { useLanguage } from '../i18n/LanguageContext';
import Field from '../components/Field';

const emptyForm = { bank: '', startDate: '', endDate: '', file: null };

export default function UploadStatement() {
  const { t } = useLanguage();
  const s = t.uploadStatement;

  const [form, setForm]       = useState(emptyForm);
  const [status, setStatus]   = useState('idle');
  const [error, setError]     = useState('');
  const [result, setResult]   = useState(null);
  const [banks, setBanks]     = useState([]);
  const [banksError, setBanksError] = useState('');
  const fileInputRef           = useRef(null);

  const isLoading = status === 'loading';

  useEffect(() => {
    getBanks()
      .then(setBanks)
      .catch(() => setBanksError(s.errorLoadingBanks));
  }, []);

  function updateField(name, value) {
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!form.bank)  return s.errorNoBank;
    if (!form.file)  return s.errorNoFile;
    if (form.startDate && form.endDate && form.startDate > form.endDate) return s.errorDateRange;
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
      const response = await uploadBankStatement({
        bankId:    form.bank,
        startDate: form.startDate || undefined,
        endDate:   form.endDate   || undefined,
        file:      form.file,
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

      <form onSubmit={handleSubmit} className="form-card">

        <Field label={s.bankLabel}>
          {banksError
            ? <p className="feedback feedback--error">{banksError}</p>
            : (
              <select
                value={form.bank}
                onChange={e => updateField('bank', e.target.value)}
                disabled={isLoading || banks.length === 0}
                required
                className={`form-input${!form.bank ? ' form-input--unselected' : ''}`}
              >
                <option value="">{s.bankPlaceholder}</option>
                {banks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            )
          }
        </Field>

        <div className="form-row">
          <div className="form-row-col">
            <Field label={s.startDateLabel}>
              <input
                type="date"
                value={form.startDate}
                max={form.endDate || undefined}
                onChange={e => updateField('startDate', e.target.value)}
                disabled={isLoading}
                className="form-input"
              />
            </Field>
          </div>
          <div className="form-row-col">
            <Field label={s.endDateLabel}>
              <input
                type="date"
                value={form.endDate}
                min={form.startDate || undefined}
                onChange={e => updateField('endDate', e.target.value)}
                disabled={isLoading}
                className="form-input"
              />
            </Field>
          </div>
        </div>

        <Field label={s.fileLabel}>
          <div
            className={`drop-zone${isLoading ? ' drop-zone--disabled' : ''}`}
            onClick={() => !isLoading && fileInputRef.current?.click()}
          >
            <div className="drop-zone__icon">📂</div>
            {form.file
              ? <p className="drop-zone__filename">{form.file.name}</p>
              : <>
                  <p className="drop-zone__text">{s.fileDragText}</p>
                  <p className="drop-zone__hint">{s.fileFormats}</p>
                </>
            }
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.csv"
              onChange={e => updateField('file', e.target.files?.[0] ?? null)}
              disabled={isLoading}
              className="file-input-hidden"
            />
          </div>
        </Field>

        {status === 'error'   && <div className="feedback feedback--error">⚠️ {error}</div>}
        {status === 'success' && result && (
          <div className="feedback feedback--success">
            ✅ {s.successMessage} ({result.importedCount} {s.transactionsFound})
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? <><span className="spinner" /> {s.loadingButton}</> : s.submitButton}
          </button>
          {status === 'success' && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              {s.uploadAnother}
            </button>
          )}
        </div>

      </form>
    </div>
  );
}
