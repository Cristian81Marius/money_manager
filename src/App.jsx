import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
