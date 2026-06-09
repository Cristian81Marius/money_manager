import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import UploadStatement from './pages/UploadStatement';
import AddTransaction from './pages/AddTransaction';
import Statistics from './pages/Statistics';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload-statement" element={<UploadStatement />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
