import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SettingsProvider } from './lib/settings';
import { BottomNav } from './components/BottomNav';
import { Home } from './screens/Home';
import { Salat } from './screens/Salat';
import { Zakat } from './screens/Zakat';
import { Puasa } from './screens/Puasa';
import { Haji } from './screens/Haji';
import { Settings } from './screens/Settings';

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/salat" element={<Salat />} />
            <Route path="/zakat" element={<Zakat />} />
            <Route path="/puasa" element={<Puasa />} />
            <Route path="/haji" element={<Haji />} />
            <Route path="/pengaturan" element={<Settings />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </SettingsProvider>
  );
}
