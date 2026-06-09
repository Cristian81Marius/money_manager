import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import './Register.css';
import { register } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { AUTH_ERRORS } from '../services/auth';
import Field from '../components/Field';

function mapError(err, a) {
  const code = err instanceof Error ? err.message : '';
  if (code === AUTH_ERRORS.EMAIL_TAKEN) return a.errorEmailTaken;
  return a.errorRequiredFields;
}

function validate(form, a) {
  if (!form.name.trim() || !form.email || !form.password || !form.confirmPassword) {
    return a.errorRequiredFields;
  }
  if (form.password.length < 6)             return a.errorPasswordTooShort;
  if (form.password !== form.confirmPassword) return a.errorPasswordMismatch;
  return '';
}

export default function Register() {
  const { t } = useLanguage();
  const a = t.auth;

  const { user, setUser } = useAuth();
  const navigate          = useNavigate();

  const [form, setForm]     = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError]   = useState('');

  const isLoading = status === 'loading';

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
      const authUser = await register({
        name:     form.name.trim(),
        email:    form.email,
        password: form.password,
      });
      setUser(authUser);
      navigate('/', { replace: true });
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
