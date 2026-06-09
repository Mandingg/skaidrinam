import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createDocument } from "../../services/documentService";
import "./DocumentForm.css";
import cekioLogo from "../../assets/LogoIcon.svg";


function DocumentForm() {
    useEffect(() => {
        document.title = "Pridėti garantiją";
    }, []);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        store_name: "",
        purchase_date: "",
        valid_until: "",
        file: null,
    });

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        if (e.target.name === "file") {
            setFormData({
                ...formData,
                file: e.target.files[0],
            });
            return;
        }

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setIsError(false);

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Norėdami pridėti garantiją, turite prisijungti.");
            setIsError(true);
            return;
        }

        if (!formData.file) {
            setMessage("Pasirinkite dokumento failą.");
            setIsError(true);
            return;
        }

        const dataToSend = new FormData();
        dataToSend.append("title", formData.title);
        dataToSend.append("store_name", formData.store_name);
        dataToSend.append("purchase_date", formData.purchase_date);
        dataToSend.append("valid_until", formData.valid_until);
        dataToSend.append("file", formData.file);

        try {
            setLoading(true);

            const data = await createDocument(dataToSend);

            setMessage(data.message || "Garantija sėkmingai pridėta.");
            setIsError(false);

            setTimeout(() => {
                navigate("/garantijos");
            }, 1500);

        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <main className="register-card">

                <div className="register-header">
                    <div className="register-logo-title">
                        <img
                            src={cekioLogo}
                            alt="Čekiukai logo"
                            className="register-logo"
                        />
                    </div>
                </div>

                <h2 className="subtitle">Pridėti naują garantiją</h2>

                <form onSubmit={handleSubmit} className="form">

                    <div className="field">
                        <label>Garantijos pavadinimas</label>

                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Pvz. Telefono garantija"
                            type="text"
                            required
                        />
                    </div>

                    <div className="field">
                        <label>Parduotuvė</label>

                        <input
                            name="store_name"
                            value={formData.store_name}
                            onChange={handleChange}
                            placeholder="Pvz. Senukai"
                            type="text"
                        />
                    </div>

                    <div className="field">
                        <label>Pirkimo data</label>

                        <input
                            name="purchase_date"
                            value={formData.purchase_date}
                            onChange={handleChange}
                            type="date"
                        />
                    </div>

                    <div className="field">
                        <label>Garantijos pabaiga</label>

                        <input
                            name="valid_until"
                            value={formData.valid_until}
                            onChange={handleChange}
                            type="date"
                        />

                        <p className="additional-info">
                            *Paprastai garantija galioja 24 mėnesius nuo pirkimo datos.
                        </p>
                    </div>

                    <div className="field">
                        <label>Dokumento failas</label>

                        <input
                            name="file"
                            onChange={handleChange}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                        />

                        <p className="additional-info">
                            *Leidžiami formatai: PDF, JPG, PNG.
                        </p>
                    </div>

                    <div className="actions">
                        <button
                            type="submit"
                            className="register-btn"
                            disabled={loading}
                        >
                            {loading ? "Saugoma..." : "Išsaugoti"}
                        </button>
                    </div>

                    <div className="delete-account">
                        <button
                            type="button"
                            className="delete-account-btn"
                            onClick={() => navigate("/garantijos")}
                        >
                            Atšaukti
                        </button>
                    </div>
                </form>

                {message && (
                    <p className={`message ${isError ? "error" : "success"}`}>
                        {message}
                    </p>
                )}

            </main>
        </div>
    );
}

export default DocumentForm;