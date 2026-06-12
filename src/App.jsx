import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './i18n/LanguageContext';
import { getPreferences } from './services/preferences';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import UploadStatement from './pages/UploadStatement';
import AddTransaction from './pages/AddTransaction';
import Statistics from './pages/Statistics';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }) {
  const { user }   = useAuth();
  const location   = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function AppRoutes() {
  const { user }    = useAuth();
  const { setLang } = useLanguage();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (!user) return;
    getPreferences()
      .then(prefs => {
        if (prefs.language) setLang(prefs.language);
        if (prefs.theme)    setTheme(prefs.theme);
        if (prefs.profilePicture) localStorage.setItem('mm_profile_pic', prefs.profilePicture);
      })
      .catch(() => {});
  }, [user?.id]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        } />
        <Route path="/upload-statement" element={
          <ProtectedRoute><UploadStatement /></ProtectedRoute>
        } />
        <Route path="/add-transaction" element={
          <ProtectedRoute><AddTransaction /></ProtectedRoute>
        } />
        <Route path="/statistics" element={
          <ProtectedRoute><Statistics /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
