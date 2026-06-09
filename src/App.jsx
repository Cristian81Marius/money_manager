import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import IncarcaExtras from './pages/IncarcaExtras';
import IntroduManual from './pages/IntroduManual';
import Statistici from './pages/Statistici';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/incarca-extras" element={<IncarcaExtras />} />
        <Route path="/introdu-manual" element={<IntroduManual />} />
        <Route path="/statistici" element={<Statistici />} />
      </Routes>
    </BrowserRouter>
  );
}
