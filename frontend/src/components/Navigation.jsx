import { NavLink } from "react-router";
import "./Navigation.css";

import HomeIcon from "../assets/HomeIcon.svg";
import ChartsIcon from "../assets/ChartsIcon.svg";
import ProfileIcon from "../assets/ProfileIcon.svg";
import LogoutIcon from "../assets/LogoutIcon.svg";
import LogoIcon from "../assets/LogoIcon.svg";
import VerifiedIcon from "../assets/VerifiedIcon.svg";
import ExpensesIcon from "../assets/ExpensesIcon.svg";

function Navigation() {
  const baseClass = "nav-link";
  const activeClass = "active";
  const inactiveClass = "inactive";

  return (
    <aside className="sidebar">
      {/* LOGO */}
      <div className="navigation-logo">
        <img src={LogoIcon} alt="logo" className="logo-icon" />
        <h1 className="logo-text">Čekiukai</h1>
      </div>

      {/* NAV */}
      <nav className="nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <img src={HomeIcon} alt="home" className="icon" />
          Pradžia
        </NavLink>

        <NavLink
          to="/analitika"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <img src={ChartsIcon} alt="charts" className="icon" />
          Analitika
        </NavLink>

        <NavLink
          to="/islaidos"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <img src={ExpensesIcon} alt="expenses" className="icon" />
          Išlaidų sąrašas
        </NavLink>

        <NavLink
          to="/garantijos"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <img src={VerifiedIcon} alt="warranties" className="icon" />
          Garantijos
        </NavLink>

        <NavLink
          to="/profilis"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <img src={ProfileIcon} alt="profile" className="icon" />
          Profilis
        </NavLink>

        <NavLink to="/atsijungti" className="nav-link inactive">
          <img src={LogoutIcon} alt="logout" className="navigation-icon" />
          Atsijungti
        </NavLink>
      </nav>

      {/* USER INFO */}
      <div className="user">
        <div className="avatar">
          <img src={ProfileIcon} alt="user" />
        </div>

        <div className="user-text">
          <span className="user-name">Jonas Petrauskas</span>
          <span className="user-email">jonas@example.com</span>
        </div>
      </div>
    </aside>
  );
}

export default Navigation;
