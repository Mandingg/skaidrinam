import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../../services/userService";

import "./Register.css";

import cekioLogo from "../../assets/LogoIcon.svg";
import VisibilityOn from "../../assets/VisibilityOn.svg";
import VisibilityOff from "../../assets/VisibilityOff.svg";

function Register() {
  useEffect(() => {
    document.title = "Registracija";
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (formData.password !== formData.repeatPassword) {
      setMessage("Slaptažodžiai nesutampa");
      setIsError(true);
      return;
    }

    try {
      const data = await registerUser({
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
      });

      setMessage("Registracija sėkminga! Nukreipiama į prisijungimą...");
      setIsError(false);

      setFormData({
        name: "",
        surname: "",
        email: "",
        password: "",
        repeatPassword: "",
      });


      setTimeout(() => {
        navigate("/");
      }, 600);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  };

  return (
    <div className="register-page">
      <main className="register-card">

        {/* Header */}
        <div className="register-header">
          <div className="register-logo-title">
            <img
              src={cekioLogo}
              alt="Čekiukai logo"
              className="register-logo"
            />

            <h1 className="title">Čekiukai</h1>
          </div>
        </div>

        <h2 className="subtitle">Registruotis</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form">

          {/* Name */}
          <div className="field">
            <label>Vardas</label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Įveskite vardą"
              required
              type="text"
            />
          </div>

          {/* Surname */}
          <div className="field">
            <label>Pavardė</label>

            <input
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Įveskite pavardę"
              required
              type="text"
            />
          </div>

          {/* Email */}
          <div className="field">
            <label>El. paštas</label>

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Įveskite el. paštą"
              required
              type="email"
            />
          </div>

          {/* Password */}
          <div className="field">
            <label>Slaptažodis</label>

            <div className="password-wrapper">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Įveskite slaptažodį"
                required
                type={showPassword ? "text" : "password"}
              />

              <button
                type="button"
                className="toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? VisibilityOn : VisibilityOff}
                  alt="toggle password visibility"
                  className="icon"
                />
              </button>
            </div>
            <p className="additional-info">*Slaptazodis turi turėti vieną didžiąją raidę ir vieną spec.simbolį</p>
          </div>

          {/* Repeat Password */}
          <div className="field">
            <label>Pakartokite slaptažodį</label>

            <div className="password-wrapper">
              <input
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
                placeholder="Pakartokite slaptažodį"
                required
                type={
                  showRepeatPassword ? "text" : "password"
                }
              />

              <button
                type="button"
                className="toggle-btn"
                onClick={() =>
                  setShowRepeatPassword(
                    !showRepeatPassword
                  )
                }
              >
                <img
                  src={
                    showRepeatPassword
                      ? VisibilityOn
                      : VisibilityOff
                  }
                  alt="toggle password visibility"
                  className="icon"
                />
              </button>
            </div>
          </div>

          {/* Button */}
          <div className="actions">
            <button
              type="submit"
              className="register-btn"
            >
              Registruotis
            </button>
          </div>

        </form>

        {/* Message */}
        {message && (
          <p
            className={`message ${isError ? "error" : "success"
              }`}
          >
            {message}
          </p>
        )}

        {/* Footer */}
        <div className="footer">
          <p>
            Jau turite paskyrą?
            <Link to="/">
              Prisijunkite
            </Link>
          </p>
        </div>

      </main>
    </div>
  );
}

export default Register;