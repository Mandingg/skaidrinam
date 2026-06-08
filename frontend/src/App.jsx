import './App.css';
import { useLocation } from "react-router";
import Navigation from "./components/Navigation";
import AppRoutes from './routes/AppRoutes';

function App() {
  const location = useLocation();

  const pathsWithNavigation = [
    "/pagrindinis",
    "/analitika",
    "/garantijos",
    "/profilis",
    "/islaidos",
    "/profilis/redaguoti"
  ];

  const showNavigation = pathsWithNavigation.some(path => 
    location.pathname.startsWith(path)
  );
  return (
    <>
      {showNavigation && <Navigation />}

      <AppRoutes />
    </>
  );
}

export default App;
