import { useState } from "react";
import { useEffect } from "react";
import "./Login.css";
import LogoIcon from "../../assets/LogoIcon.svg?url";
import VisibilityOn from "../../assets/VisibilityOn.svg";
import VisibilityOff from "../../assets/VisibilityOff.svg";

import { Link } from "react-router";

function Login() {
    useEffect(() => {
    document.title = "Prisijungimas";
  }, []);
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="login-page">
      <main className="login-card">

        {/* Header */}
        <div className="login-header">

          <div className="login-logo-title">
            <img src={LogoIcon} alt="Čekiukai logo" className="login-logo" />
            <h1 className="title">Čekiukai</h1>
          </div>

        </div>

        <h2 className="subtitle">Prisijungti</h2>

        {/* Form */}
        <form className="form">

          {/* Email */}
          <div className="field">
            <label htmlFor="email">El. paštas</label>
            <input
              id="email"
              type="email"
              placeholder="Įveskite el. paštą"
              required
            />
          </div>

          {/* Password */}
          <div className="field">
            <label htmlFor="password">Slaptažodis</label>

            <div className="password-wrapper">
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Įveskite slaptažodį"
                required
              />

              <button
                type="button"
                className="toggle-btn"
                onClick={() => setPasswordVisible((v) => !v)}
              >
                <img
                  src={passwordVisible ? VisibilityOn : VisibilityOff}
                  alt="toggle password visibility"
                  className="icon"
                />
              </button>
            </div>
          </div>

          {/* Button */}
          <div className="actions">
            <button type="submit" className="login-btn">
              Prisijungti
            </button>
          </div>

        </form>

        {/* Footer */}
        <div className="footer">
          <p>
            Dar neturite paskyros?
            <Link to="/registracija">Registruokitės</Link>
          </p>
        </div>

      </main>
    </div>
  );
}

export default Login;