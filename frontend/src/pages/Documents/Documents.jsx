import { useEffect, useState } from "react";
import { useNavigate } from "react-router"
import DocumentCard from "../../components/DocumentCard";
import { getDocuments, deleteDocument } from "../../services/documentService";
import "./Documents.css";
import Warning from "../../assets/Warning.svg";

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [message, setMessage] = useState("");
    const [documentToDelete, setDocumentToDelete] = useState(null);


    useEffect(() => {
        document.title = "Garantijos";
        fetchDocuments();
    }, []);

    const navigate = useNavigate();

    async function fetchDocuments() {
        try {
            const data = await getDocuments();
            setDocuments(data);
        } catch (error) {
            setMessage(error.message);
        }
    }

    async function confirmDelete() {
        try {
            await deleteDocument(documentToDelete.id);
            setDocumentToDelete(null);
            await fetchDocuments();
        } catch (error) {
            setMessage(error.message);
        }
    }

    return (
        <main className="documents-page">
            <div className="documents-content">
                <header className="documents-topbar">
                    <h1>Garantijos</h1>

                    <button className="documents-date-button" type="button">
                        2024 m. gegužė ▾
                    </button>
                </header>

                <section className="documents-toolbar">
                    <div className="documents-tabs">
                        <button className="active" type="button">Visos</button>
                        <button type="button">Galiojančios</button>
                        <button type="button">Pasibaigusios</button>
                    </div>

                    <button className="documents-add-button" type="button" onClick={() => navigate("/garantijos/nauja")}>
                        + Pridėti garantiją
                    </button>
                </section>

                <section className="documents-search">
                    <input
                        type="text"
                        placeholder="Ieškoti pagal pavadinimą, parduotuvę..."
                    />
                </section>

                {message && <p className="documents-message">{message}</p>}

                <section className="documents-grid">
                    {documents.length === 0 ? (
                        <p className="documents-empty">Garantijų nėra.</p>
                    ) : (
                        documents.map((document) => (
                            <DocumentCard
                                key={document.id}
                                document={document}
                                onDeleteClick={setDocumentToDelete}
                            />
                        ))
                    )}
                </section>

                {documentToDelete && (
                    <div className="modal-overlay">
                        <div className="modal">

                            <img
                                src={Warning}
                                alt="PERSPĖJIMAS"
                                className="warning-logo"
                            />

                            <h3>Ar tikrai norite ištrinti garantiją?</h3>

                            <p>
                                Garantija <strong>{documentToDelete.title}</strong> bus
                                visam laikui pašalinta.
                                Šio veiksmo atšaukti negalima.
                            </p>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setDocumentToDelete(null)}
                                >
                                    Atšaukti
                                </button>

                                <button
                                    type="button"
                                    className="confirm-delete-btn"
                                    onClick={confirmDelete}
                                >
                                    Ištrinti
                                </button>

                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}

export default Documents;