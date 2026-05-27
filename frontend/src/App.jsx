import './App.css'
import { Routes, Route, useLocation } from "react-router";
import Navigation from './components/Navigation';
import MainPage from './pages/MainPage';
import Analytics from './pages/Analytics';
import Warranties from './pages/Warranties';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Login from './pages/Login/Login';
import Register from './pages/Register';

function App() {
  const location = useLocation();

  const hideNavigation =
    location.pathname === "/" ||
    location.pathname === "/registracija";

  return (
    <>
      {!hideNavigation && <Navigation />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registracija" element={<Register />} />

        <Route path="/pagrindinis" element={<MainPage />} />
        <Route path="/analitika" element={<Analytics />} />
        <Route path="/garantijos" element={<Warranties />} />
        <Route path="/profilis" element={<Profile />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App
