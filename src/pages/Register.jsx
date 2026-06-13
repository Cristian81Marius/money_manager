import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import './Register.css';
import { sendVerification, verifyEmail, AUTH_ERRORS } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import Field from '../components/Field';

const CODE_LENGTH = 6;

function mapRegisterError(err, a) {
  const code = err instanceof Error ? err.message : '';
  if (code === AUTH_ERRORS.EMAIL_TAKEN) return a.errorEmailTaken;
  return a.errorRequiredFields;
}

function mapVerifyError(err, a) {
  const code = err instanceof Error ? err.message : '';
  if (code === AUTH_ERRORS.CODE_EXPIRED) return a.errorCodeExpired;
  return a.errorInvalidCode;
}

function validate(form, a) {
  if (!form.name.trim() || !form.email || !form.password || !form.confirmPassword) {
    return a.errorRequiredFields;
  }
  if (form.password.length < 6)              return a.errorPasswordTooShort;
  if (form.password !== form.confirmPassword) return a.errorPasswordMismatch;
  return '';
}

export default function Register() {
  const { t } = useLanguage();
  const a = t.auth;

  const { user, setUser } = useAuth();
  const navigate          = useNavigate();

  const [step, setStep]                     = useState('form');
  const [form, setForm]                     = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [verificationId, setVerificationId] = useState('');
  const [code, setCode]                     = useState(Array(CODE_LENGTH).fill(''));
  const [status, setStatus]                 = useState('idle');
  const [error, setError]                   = useState('');
  const [resendStatus, setResendStatus]     = useState('idle');

  const codeRefs   = useRef([]);
  const isLoading  = status === 'loading';

  if (user) return <Navigate to="/" replace />;

  function updateField(name, value) {
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate(form, a);
    if (validationError) { setStatus('error'); setError(validationError); return; }

    setStatus('loading');
    setError('');
    try {
      const { verificationId: vid } = await sendVerification({
        name:     form.name.trim(),
        email:    form.email,
        password: form.password,
      });
      setVerificationId(vid);
      setStep('verify');
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setError(mapRegisterError(err, a));
    }
  }

  function handleCodeChange(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next  = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < CODE_LENGTH - 1) {
      codeRefs.current[index + 1]?.focus();
    }
  }

  function handleCodeKeyDown(index, e) {
    if (e.key === 'Backspace') {
      if (code[index]) {
        const next  = [...code];
        next[index] = '';
        setCode(next);
      } else if (index > 0) {
        const next         = [...code];
        next[index - 1]    = '';
        setCode(next);
        codeRefs.current[index - 1]?.focus();
      }
    }
  }

  function handleCodePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = Array(CODE_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setCode(next);
    codeRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  }

  async function handleVerify(e) {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < CODE_LENGTH) {
      setStatus('error');
      setError(a.errorRequiredFields);
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const authUser = await verifyEmail({ verificationId, code: fullCode });
      setUser(authUser);
      navigate('/', { replace: true });
    } catch (err) {
      setStatus('error');
      setError(mapVerifyError(err, a));
    }
  }

  async function handleResend() {
    setResendStatus('loading');
    setError('');
    try {
      const { verificationId: vid } = await sendVerification({
        name:     form.name.trim(),
        email:    form.email,
        password: form.password,
      });
      setVerificationId(vid);
      setCode(Array(CODE_LENGTH).fill(''));
      codeRefs.current[0]?.focus();
      setResendStatus('sent');
      setTimeout(() => setResendStatus('idle'), 3000);
    } catch (err) {
      setResendStatus('idle');
      setError(mapRegisterError(err, a));
    }
  }

  if (step === 'verify') {
    return (
      <div className="auth-page">
        <div className="auth-card">

          <div className="auth-brand">
            <div className="auth-brand__icon">₿</div>
            <span className="auth-brand__name">MoneyManager</span>
            <span className="auth-brand__subtitle">{a.verifySubtitle}</span>
          </div>

          <p className="verify-hint">
            {a.verifyEmailSent} <strong>{form.email}</strong>
          </p>

          <form onSubmit={handleVerify} className="auth-form">
            <div className="verify-code-row">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { codeRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleCodeChange(i, e.target.value)}
                  onKeyDown={e => handleCodeKeyDown(i, e)}
                  onPaste={handleCodePaste}
                  disabled={isLoading}
                  className="verify-code-input"
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {status === 'error' && (
              <div className="feedback feedback--error">⚠️ {error}</div>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary btn-primary--full">
              {isLoading
                ? <><span className="spinner" /> {a.verifyLoading}</>
                : a.verifyButton
              }
            </button>
          </form>

          <p className="auth-footer">
            {a.resendCodeHint}{' '}
            {resendStatus === 'sent'
              ? <span className="verify-resend-success">{a.resendSuccess}</span>
              : (
                <button
                  type="button"
                  className="auth-footer__link verify-resend-btn"
                  onClick={handleResend}
                  disabled={resendStatus === 'loading'}
                >
                  {resendStatus === 'loading' ? a.resendLoading : a.resendCode}
                </button>
              )
            }
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-brand__icon">₿</div>
          <span className="auth-brand__name">MoneyManager</span>
          <span className="auth-brand__subtitle">{a.registerSubtitle}</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Field label={a.nameLabel}>
            <input
              type="text"
              value={form.name}
              placeholder={a.namePlaceholder}
              onChange={e => updateField('name', e.target.value)}
              disabled={isLoading}
              autoComplete="name"
              className="form-input"
            />
          </Field>

          <Field label={a.emailLabel}>
            <input
              type="email"
              value={form.email}
              placeholder={a.emailPlaceholder}
              onChange={e => updateField('email', e.target.value)}
              disabled={isLoading}
              autoComplete="email"
              className="form-input"
            />
          </Field>

          <Field label={a.passwordLabel}>
            <input
              type="password"
              value={form.password}
              placeholder={a.passwordPlaceholder}
              onChange={e => updateField('password', e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
              className="form-input"
            />
          </Field>

          <Field label={a.confirmPasswordLabel}>
            <input
              type="password"
              value={form.confirmPassword}
              placeholder={a.confirmPasswordPlaceholder}
              onChange={e => updateField('confirmPassword', e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
              className="form-input"
            />
          </Field>

          {status === 'error' && (
            <div className="feedback feedback--error">⚠️ {error}</div>
          )}

          <button type="submit" disabled={isLoading} className="btn-primary btn-primary--full">
            {isLoading
              ? <><span className="spinner" /> {a.registerLoading}</>
              : a.registerButton
            }
          </button>
        </form>

        <p className="auth-footer">
          {a.haveAccount}
          <Link to="/login" className="auth-footer__link">{a.loginLink}</Link>
        </p>

      </div>
    </div>
  );
}
