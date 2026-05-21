import { Routes, Route } from "react-router";
import Register from "../pages/Register";
import ProfileEdit from "../pages/ProfileEdit"

function AppRoutes() {
    return (
        <Routes>
            <Route path="/registracija" element={<Register />} />
            <Route path="/profilis/redaguoti" element={<ProfileEdit />} />
            
        </Routes>
    );
}

export default AppRoutes;