import { NavLink } from "react-router";
import { useState, useEffect } from "react";
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

  const [user, setUser] = useState({ name: "Kraunama...", surname: "", email: "" });

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return;

  fetch("http://127.0.0.1:8000/users/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (!data) return;

      setUser({
        name: data.name,
        surname: data.surname,
        email: data.email,
        subscription: data.subscription_type,
      });
    })
    .catch(() => {
      localStorage.removeItem("token");
      window.location.href = "/";
    });
}, []);

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
          to="/pagrindinis"
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
          Vartotojo profilis
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
          <span className="user-name">{user.name} {user.surname}</span>
          {/* <span className="user-email">{user.email}</span> */}
          
          {user.subscription?.trim().toUpperCase() === "PREMIUM" && (
            <span className="premium-badge">
              PREMIUM
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Navigation;
