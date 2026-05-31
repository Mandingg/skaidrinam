import { Routes, Route } from "react-router";

import MainPage from "../pages/MainPage";
import Analytics from "../pages/Analytics";
import Warranties from "../pages/Warranties";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

function AppRoutes() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/" element={<Login />} />
      <Route path="/registracija" element={<Register />} />

      {/* MAIN APP */}
      <Route path="/pagrindinis" element={<MainPage />} />
      <Route path="/analitika" element={<Analytics />} />
      <Route path="/garantijos" element={<Warranties />} />
      <Route path="/profilis" element={<Profile />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;