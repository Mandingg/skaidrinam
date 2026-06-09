import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getDocument, updateDocument } from "../../services/documentService";

import "./DocumentForm.css";

import cekioLogo from "../../assets/LogoIcon.svg";

function EditDocument() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        store_name: "",
        purchase_date: "",
        valid_until: "",
    });

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Redaguoti garantiją";
        loadDocument();
    }, []);

    async function loadDocument() {
        try {
            const data = await getDocument(id);

            console.log("Gauta garantija:", data);

            setFormData({
                title: data.title,
                store_name: data.store_name,
                purchase_date: data.purchase_date,
                valid_until: data.valid_until,
            });
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        }
    }

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setMessage("");
        setIsError(false);
        setLoading(true);

        try {
            const data = await updateDocument(id, {
                title: formData.title,
                store_name: formData.store_name,
                purchase_date: formData.purchase_date,
                valid_until: formData.valid_until || null,
            });

            setMessage(data.message || "Garantija sėkmingai atnaujinta.");
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
    }

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

                <h2 className="subtitle">Redaguoti garantiją</h2>

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
                            *Pakeiskite garantijos galiojimo datą, jei ji pasikeitė.
                        </p>
                    </div>

                    <div className="actions">
                        <button
                            type="submit"
                            className="register-btn"
                            disabled={loading}
                        >
                            {loading ? "Saugoma..." : "Išsaugoti pakeitimus"}
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

export default EditDocument;