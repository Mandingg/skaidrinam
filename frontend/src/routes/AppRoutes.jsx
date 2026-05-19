import { Routes, Route } from "react-router";
import Register from "../pages/Register";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/registracija" element={<Register />} />
            
        </Routes>
    );
}

export default AppRoutes;