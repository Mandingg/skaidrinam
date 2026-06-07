import './App.css';
import { useLocation } from "react-router";
import Navigation from "./components/Navigation";
import AppRoutes from './routes/AppRoutes';

function App() {
  const location = useLocation();

  const hideNavigation =
    location.pathname === "/prisijungimas" ||
    location.pathname === "/registracija" ||
    location.pathname === "/atsijungti";

  return (
    <>
      {!hideNavigation && <Navigation />}

      <AppRoutes />
    </>
  );
}

export default App;
