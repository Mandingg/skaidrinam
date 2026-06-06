import { Routes, Route } from "react-router";

import MainPage from "../pages/MainPage";
import Analytics from "../pages/Analytics";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ExpensesList from "../pages/ExpensesList";
import ProfileEdit from "../pages/ProfileEdit/ProfileEdit";
import ExpenseForm from "../pages/ExpenseForm";
import EditExpensePage from "../pages/EditExpensePage";
import Documents from "../pages/Documents/Documents";
import DocumentForm from "../pages/Documents/DocumentForm";

function AppRoutes() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/" element={<Login />} />
      <Route path="/registracija" element={<Register />} />

      {/* MAIN APP */}
      <Route path="/pagrindinis" element={<MainPage />} />
      <Route path="/analitika" element={<Analytics />} />
      <Route path="/garantijos" element={<Documents />} />
      <Route path="/profilis" element={<ProfileEdit />} />
      <Route path='/islaidos' element={<ExpensesList />} />
      <Route path="/islaidos/nauja" element={<ExpenseForm />} />
      <Route path="/islaidos/redaguoti/:id" element={<EditExpensePage />} />
      <Route path="/garantijos/nauja" element={<DocumentForm />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
