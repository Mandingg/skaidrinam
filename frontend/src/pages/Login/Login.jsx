import { useState, useEffect } from "react";
import "./Login.css";
import LogoIcon from "../../assets/LogoIcon.svg?url";
import VisibilityOn from "../../assets/VisibilityOn.svg";
import VisibilityOff from "../../assets/VisibilityOff.svg";

import { Link, useNavigate } from "react-router"; 

function Login() {
  const navigate = useNavigate(); 

  useEffect(() => {
    document.title = "Prisijungimas";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email); // Vartotojo username yra jo el.paštas
      formData.append("password", password);

      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await res.json();

      if (!res.ok) {

        setError(data.detail || "Prisijungimo klaida");
        return;
      }

      console.log("LOGIN SUCCESS:", data);

      localStorage.setItem("access_token", data.access_token);
      navigate("/pagrindinis"); 

    } catch (err) {
      console.error("Prisijungimo klaida:", err);
      setError("Serverio klaida");
    }
  };

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
        <form className="form" onSubmit={handleLogin}>

          {/* Email */}
          <div className="field">
            <label htmlFor="email">El. paštas</label>
            <input
              id="email"
              type="email"
              placeholder="Įveskite el. paštą"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          
          {error && <p style={{ color: "red", fontSize: "14px", margin: "8px 0" }}>{error}</p>}

          <div className="actions">
            <button type="submit" className="login-btn">
              Prisijungti
            </button>
          </div>

        </form>

        {/* Footer */}
        <div className="footer">
          <p>
            Dar neturite paskyros?{" "}
            <Link to="/registracija">Registruokitės</Link>
          </p>
        </div>

      </main>
    </div>
  );
}

export default Login;