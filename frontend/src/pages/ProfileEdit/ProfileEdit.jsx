import { useEffect, useState } from "react";
import { updateUser, deleteUser, getUser } from "../../services/userService";
import { useNavigate } from "react-router"

import "./ProfileEdit.css";

import cekioLogo from "../../assets/LogoIcon.svg";
import VisibilityOn from "../../assets/VisibilityOn.svg";
import VisibilityOff from "../../assets/VisibilityOff.svg";
import Warning from "../../assets/Warning.svg";

function ProfileEdit() {
    useEffect(() => {
        document.title = "Profilio redagavimas";
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        async function loadUser() {
            try {
                const data = await getUser(userId);

                setFormData((previous) => ({
                    ...previous,
                    name: data.name,
                    surname: data.surname,
                    email: data.email
                }));
            }
            catch (error) {
                setMessage(error.message);
                setIsError(true)
            }
        }
        loadUser();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setIsError(false);

        if (formData.password && formData.password !== formData.repeatPassword) {
            setMessage("Slaptažodžiai nesutampa");
            setIsError(true);
            return;
        }

        try {
            const data = await updateUser(userId, {
                name: formData.name || null,
                surname: formData.surname || null,
                email: formData.email || null,
                password: formData.password || null,
            });

            setMessage(data.message);
            setIsError(false);

            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        }
    };

    const handleDeleteAccount = async () => {
        setMessage("");
        setIsError(false);

        try {
            const data = await deleteUser();

            localStorage.removeItem("userId");

            setMessage("Paskyra sėkmingai ištrinta.");
            setIsError(false);
            setDeleteSuccess(true);

            setTimeout(() => {
                navigate("/registracija");
            }, 2500);
        }

        catch (error) {

            setMessage(error.message);
            setIsError(true);
            setShowDeleteModal(false);
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

                        {/* <h1 className="title">Čekiukai</h1> */}
                    </div>
                </div>

                <h2 className="subtitle">Asmeninio profilio redagavimas</h2>

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
                            Redaguoti
                        </button>
                    </div>

                    {/* Delete account button*/}

                    <div className="delete-account">
                        <button
                            type="button"
                            className="delete-account-btn"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Ištrinti paskyrą
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

                {showDeleteModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            {deleteSuccess ? (
                                <>
                                    <h3>Paskyra sėkmingai ištrinta</h3>

                                    <p>
                                        Nukreipiama į registracijos puslapį...
                                    </p>
                                </>
                            ) : (
                                <>
                                    <img
                                        src={Warning}
                                        alt="PERSPĖJIMAS"
                                        className="warning-logo"
                                    />

                                    <h3>Ar tikrai norite ištrinti paskyrą?</h3>

                                    <p>
                                        Ištrynę paskyrą, visi jūsų duomenys,
                                        čekiukai ir garantijos bus visam laikui pašalinti.
                                        Šio veiksmo atšaukti negalima!
                                    </p>

                                    <div className="modal-actions">
                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={() => setShowDeleteModal(false)}
                                        >
                                            Atšaukti
                                        </button>

                                        <button
                                            type="button"
                                            className="confirm-delete-btn"
                                            onClick={handleDeleteAccount}
                                        >
                                            Ištrinti paskyrą
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </main >
        </div >
    );
}

export default ProfileEdit;