import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-logo">
          <span className="logo-icon">₿</span>
          <span className="logo-text">MoneyManager</span>
        </span>
        <ul className="navbar-links">
          <li><NavLink to="/" end>Acasă</NavLink></li>
          <li><NavLink to="/incarca-extras">Încarcă extras</NavLink></li>
          <li><NavLink to="/introdu-manual">Introdu manual</NavLink></li>
          <li><NavLink to="/statistici">Statistici</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}
