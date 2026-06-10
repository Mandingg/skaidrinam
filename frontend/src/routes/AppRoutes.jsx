import { Routes, Route } from "react-router";

import MainPage from "../pages/MainPage/MainPage";
import Analytics from "../pages/Analytics/Analytics";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ExpensesList from "../pages/ExpensesList";
import ProfileEdit from "../pages/ProfileEdit/ProfileEdit";
import ExpenseForm from "../pages/ExpenseForm";
import ProtectedRoute from "../components/ProtectedRoute";
import EditExpensePage from "../pages/EditExpensePage";
import Documents from "../pages/Documents/Documents";
import DocumentForm from "../pages/Documents/DocumentForm";
import EditDocument from "../pages/Documents/EditDocument";

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
        <Route path="/garantijos" element={<Documents />} />
        <Route path="/garantijos/nauja" element={<DocumentForm />} />
        <Route path="/garantijos/redaguoti/:id" element={<EditDocument />} />
        <Route path="/profilis" element={<ProfileEdit />} />
        <Route path="/islaidos" element={<ExpensesList />} />
        <Route path="/pagrindinis/naujas" element={<ExpenseForm />} />
        <Route path="/islaidos/redaguoti/:id" element={<EditExpensePage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
