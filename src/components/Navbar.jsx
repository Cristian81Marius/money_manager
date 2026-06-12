import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { savePreferences } from '../services/preferences';

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const { user, logout }     = useAuth();
  const navigate             = useNavigate();

  const { theme, setTheme }         = useTheme();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem('mm_profile_pic'));
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function onOutsideClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, [menuOpen]);

  function handleLangChange(newLang) {
    setLang(newLang);
    if (user) savePreferences({ language: newLang }).catch(() => {});
  }

  function handleThemeChange(newTheme) {
    setTheme(newTheme);
    if (user) savePreferences({ theme: newTheme }).catch(() => {});
  }

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      localStorage.setItem('mm_profile_pic', dataUrl);
      setProfilePic(dataUrl);
      if (user) savePreferences({ profilePicture: dataUrl }).catch(() => {});
    };
    reader.readAsDataURL(file);
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <Link to="/" className="navbar-logo">
          <span className="logo-icon">₿</span>
          <span className="logo-text">MoneyManager</span>
        </Link>

        {user && (
          <ul className="navbar-links">
            <li><NavLink to="/" end>{t.nav.home}</NavLink></li>
            <li><NavLink to="/upload-statement">{t.nav.uploadStatement}</NavLink></li>
            <li><NavLink to="/add-transaction">{t.nav.addTransaction}</NavLink></li>
            <li><NavLink to="/statistics">{t.nav.statistics}</NavLink></li>
          </ul>
        )}

        {user && (
          <div className="profile-menu" ref={menuRef}>
            <button className="profile-btn" onClick={() => setMenuOpen(v => !v)}>
              {profilePic
                ? <img src={profilePic} className="profile-avatar" alt="" />
                : <span className="profile-avatar profile-avatar--initials">{user.name.charAt(0).toUpperCase()}</span>
              }
            </button>

            {menuOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <label className="avatar-upload-label">
                    {profilePic
                      ? <img src={profilePic} className="profile-avatar-lg" alt="" />
                      : <span className="profile-avatar-lg profile-avatar-lg--initials">{user.name.charAt(0).toUpperCase()}</span>
                    }
                    <span className="avatar-overlay">{t.profile.changePhoto}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="avatar-file-input"
                      onChange={handlePhotoChange}
                    />
                  </label>
                  <p className="profile-name">{user.name}</p>
                  <p className="profile-email">{user.email}</p>
                </div>

                <div className="profile-dropdown-section">
                  <div className="lang-toggle">
                    <button className={lang === 'en' ? 'active' : ''} onClick={() => handleLangChange('en')}>EN</button>
                    <button className={lang === 'ro' ? 'active' : ''} onClick={() => handleLangChange('ro')}>RO</button>
                  </div>
                </div>

                <div className="profile-dropdown-section">
                  <div className="lang-toggle">
                    <button className={theme === 'light' ? 'active' : ''} onClick={() => handleThemeChange('light')}>{t.profile.light}</button>
                    <button className={theme === 'dark'  ? 'active' : ''} onClick={() => handleThemeChange('dark')}>{t.profile.dark}</button>
                  </div>
                </div>

                <div className="profile-dropdown-footer">
                  <button className="btn-signout" onClick={handleLogout}>
                    {t.auth.logout}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </nav>
  );
}
