import { Routes, Route } from "react-router";
import Register from "../pages/Register";
import ExpensesList from "../pages/ExpensesList";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/registracija" element={<Register />} />
            <Route path='/islaidos' element={<ExpensesList />} />
            
        </Routes>
    );
}

export default AppRoutes;