import './App.css'
import { Routes, Route, useLocation } from "react-router";
import Navigation from './components/Navigation'
import MainPage from './components/MainPage'
import Analytics from './components/Analytics'
import Warranties from './components/Warranties'
import Profile from './components/Profile'
import NotFound from './components/NotFound'
import Login from './components/LogIn';
import Register from './components/Register';

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
