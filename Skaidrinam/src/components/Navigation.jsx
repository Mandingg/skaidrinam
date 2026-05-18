import { NavLink } from "react-router";

import HomeIcon from "../assets/HomeIcon.svg";
import ChartsIcon from "../assets/ChartsIcon.svg";
import ProfileIcon from "../assets/ProfileIcon.svg";
import LogoutIcon from "../assets/LogoutIcon.svg";
import LogoIcon from "../assets/LogoIcon.svg";

function Navigation() {
  const baseClass =
    "flex items-center gap-3 px-[var(--space-3)] py-[var(--space-2)] rounded-[var(--radius-sm)] font-medium transition-colors";

  const activeClass =
    "bg-[var(--color-primary)] text-white";
  const inactiveClass =
    "text-[var(--color-neutral)] hover:bg-[var(--color-secondary)]";

  return (
    <aside
      className="
        w-[var(--sidebar-width)]
        bg-[var(--color-navigation)]
        border-r border-[var(--border-color)]
        flex flex-col fixed h-full
      "
    >
      {/* LOGO */}
      <div className="p-[var(--space-5)] flex items-center gap-3">
        <img src={LogoIcon} alt="logo" className="w-8 h-8" />
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">
          Čekiukai
        </h1>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-[var(--space-3)] space-y-[var(--space-2)] mt-[var(--space-3)]">
        <NavLink
          to="/pagrindinis"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <img src={HomeIcon} alt="home" className="w-5 h-5" />
          Pradžia
        </NavLink>

        <NavLink
          to="/analitika"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <img src={ChartsIcon} alt="charts" className="w-5 h-5" />
          Analitika
        </NavLink>

        <NavLink
          to="/garantijos"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <img src={ProfileIcon} alt="warranties" className="w-5 h-5" />
          Garantijos
        </NavLink>

        <NavLink
          to="/profilis"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <img src={ProfileIcon} alt="profile" className="w-5 h-5" />
          Profilis
        </NavLink>

        {/* Logout */}
          <NavLink
            to="/atsijungti"
            className={`${baseClass} text-[var(--color-neutral)] hover:bg-[var(--color-secondary)]`}
          >
            <img src={LogoutIcon} alt="logout" className="w-5 h-5" />
            Atsijungti
          </NavLink>
      </nav>

      {/* USER INFO */}
      <div className="p-[var(--space-3)] border-t border-[var(--border-color)] flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[var(--color-secondary)] flex items-center justify-center">
          <img src={ProfileIcon} alt="user" className="w-8 h-8" />
        </div>

        {/* User text */}
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-semibold text-[var(--color-neutral)] truncate">
            Jonas Petrauskas
          </span>
          <span className="text-xs text-gray-500 truncate">
            jonas@example.com
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Navigation;