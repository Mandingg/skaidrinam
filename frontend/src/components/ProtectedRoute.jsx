import { Navigate, Outlet } from "react-router";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}