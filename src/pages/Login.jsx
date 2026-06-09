import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './Login.css';
import { login } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { AUTH_ERRORS } from '../services/auth';
import Field from '../components/Field';

function mapError(err, a) {
  const code = err instanceof Error ? err.message : '';
  if (code === AUTH_ERRORS.INVALID_CREDENTIALS) return a.errorInvalidCredentials;
  return a.errorRequiredFields;
}

export default function Login() {
  const { t } = useLanguage();
  const a = t.auth;

  const { user, setUser } = useAuth();
  const navigate          = useNavigate();
  const location          = useLocation();

  const [form, setForm]     = useState({ email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError]   = useState('');

  const isLoading = status === 'loading';
  const from      = location.state?.from?.pathname || '/';

  if (user) return <Navigate to="/" replace />;

  function updateField(name, value) {
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setStatus('error');
      setError(a.errorRequiredFields);
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const authUser = await login({ email: form.email, password: form.password });
      setUser(authUser);
      navigate(from, { replace: true });
    } catch (err) {
      setStatus('error');
      setError(mapError(err, a));
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          <div className="auth-brand__icon">₿</div>
          <span className="auth-brand__name">MoneyManager</span>
          <span className="auth-brand__subtitle">{a.loginSubtitle}</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
              autoComplete="current-password"
              className="form-input"
            />
          </Field>

          {status === 'error' && (
            <div className="feedback feedback--error">⚠️ {error}</div>
          )}

          <button type="submit" disabled={isLoading} className="btn-primary btn-primary--full">
            {isLoading
              ? <><span className="spinner" /> {a.loginLoading}</>
              : a.loginButton
            }
          </button>
        </form>

        <p className="auth-demo-hint">{a.demoHint}</p>

        <p className="auth-footer">
          {a.noAccount}
          <Link to="/register" className="auth-footer__link">{a.registerLink}</Link>
        </p>

      </div>
    </div>
  );
}
