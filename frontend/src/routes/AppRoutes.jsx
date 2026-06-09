import { Routes, Route } from "react-router";

import MainPage from "../pages/MainPage/MainPage";
import Analytics from "../pages/Analytics";
import Warranties from "../pages/Warranties";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Logout from "../pages/Logout/Logout";
import ExpensesList from "../pages/ExpensesList";
import ProfileEdit from "../pages/ProfileEdit/ProfileEdit";
import ExpenseForm from "../pages/ExpenseForm";
import ProtectedRoute from "../components/ProtectedRoute";
import EditExpensePage from "../pages/EditExpensePage";

function AppRoutes() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/" element={<Login />} />
      <Route path="/registracija" element={<Register />} />

      {/* MAIN APP */}
      <Route element={<ProtectedRoute />}>
        <Route path="/pagrindinis" element={<MainPage />} />
        <Route path="/analitika" element={<Analytics />} />
        <Route path="/garantijos" element={<Warranties />} />
        <Route path="/profilis" element={<ProfileEdit />} />
        <Route path="/islaidos" element={<ExpensesList />} />
        <Route path="/pagrindinis/naujas" element={<ExpenseForm />} />
        <Route path="/islaidos/redaguoti/:id" element={<EditExpensePage />} />
        <Route path="/atsijungti" element={<Logout />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
