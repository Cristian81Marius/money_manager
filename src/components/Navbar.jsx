import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { useLanguage } from '../i18n/LanguageContext';

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-logo">
          <span className="logo-icon">₿</span>
          <span className="logo-text">MoneyManager</span>
        </span>

        <div className="navbar-right">
          <ul className="navbar-links">
            <li><NavLink to="/" end>{t.nav.home}</NavLink></li>
            <li><NavLink to="/upload-statement">{t.nav.uploadStatement}</NavLink></li>
            <li><NavLink to="/add-transaction">{t.nav.addTransaction}</NavLink></li>
            <li><NavLink to="/statistics">{t.nav.statistics}</NavLink></li>
          </ul>

          <div className="lang-toggle">
            <button
              className={lang === 'en' ? 'active' : ''}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              className={lang === 'ro' ? 'active' : ''}
              onClick={() => setLang('ro')}
            >
              RO
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
