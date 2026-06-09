import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const { user, logout }     = useAuth();
  const navigate             = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-logo">
          <span className="logo-icon">₿</span>
          <span className="logo-text">MoneyManager</span>
        </span>

        <div className="navbar-right">
          {user && (
            <ul className="navbar-links">
              <li><NavLink to="/" end>{t.nav.home}</NavLink></li>
              <li><NavLink to="/upload-statement">{t.nav.uploadStatement}</NavLink></li>
              <li><NavLink to="/add-transaction">{t.nav.addTransaction}</NavLink></li>
              <li><NavLink to="/statistics">{t.nav.statistics}</NavLink></li>
            </ul>
          )}

          <div className="lang-toggle">
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
            <button className={lang === 'ro' ? 'active' : ''} onClick={() => setLang('ro')}>RO</button>
          </div>

          {user && (
            <>
              <div className="navbar-separator" />
              <div className="navbar-user">
                <div className="navbar-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <span className="navbar-username">{user.name}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                {t.auth.logout}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
