import { Routes, Route } from "react-router";
import Register from "../pages/Register";
import ExpenseForm from "../pages/ExpenseForm";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/registracija" element={<Register />} />
            <Route path="/islaidos/nauja" element={<ExpenseForm />} />
        </Routes>
    );
}

export default AppRoutes;