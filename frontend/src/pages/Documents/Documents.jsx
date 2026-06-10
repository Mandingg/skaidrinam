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
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;


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

    function isExpired(validUntil) {
        if (!validUntil) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const warrantyDate = new Date(validUntil);
        warrantyDate.setHours(0, 0, 0, 0);

        return warrantyDate < today;
    }

    const totalCount = documents.length;
    const activeCount = documents.filter((doc) => !isExpired(doc.valid_until)).length;
    const expiredCount = totalCount - activeCount;


    const filteredDocuments = documents.filter((document) => {
        if (activeFilter === "active") {
            return document.valid_until && !isExpired(document.valid_until);
        }

        if (activeFilter === "expired") {
            return document.valid_until && isExpired(document.valid_until);
        }

        return true;
    });

    function handleEdit(documentId) {
        navigate(`/garantijos/redaguoti/${documentId}`);
    }

    const searchResults = filteredDocuments.filter((document) => {
        return document.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(searchResults.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedDocuments = searchResults.slice(startIndex, endIndex);

    return (
        <main className="documents-page documents-main">
            <div className="documents-content">
                <header className="documents-topbar">
                    <h1>Garantijos</h1>

                    {/* <button className="documents-date-button" type="button">
                        2024 m. gegužė ▾
                    </button> */}
                </header>

                <section className="documents-toolbar">
                    <div className="documents-tabs">
                        <button
                            className={activeFilter === "all" ? "active" : ""}
                            type="button"
                            onClick={() => setActiveFilter("all")}
                        >
                            Visos ({totalCount})
                        </button>
                        <button
                            className={activeFilter === "active" ? "active" : ""}
                            type="button"
                            onClick={() => setActiveFilter("active")}
                        >
                            Galiojančios ({activeCount})
                        </button>
                        <button
                            className={activeFilter === "expired" ? "active" : ""}
                            type="button"
                            onClick={() => setActiveFilter("expired")}
                        >
                            Pasibaigusios ({expiredCount})
                        </button>
                    </div>

                    <button className="documents-add-button" type="button" onClick={() => navigate("/garantijos/nauja")}>
                        + Pridėti garantiją
                    </button>
                </section>

                <section className="documents-search">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Ieškoti pagal pavadinimą, parduotuvę..."
                    />
                </section>

                {message && <p className="documents-message">{message}</p>}
                <section className="documents-grid">
                    {paginatedDocuments.length === 0 ? (
                        <p className="documents-empty">Garantijų nerasta.</p>
                    ) : (
                        paginatedDocuments.map((document) => (
                            <DocumentCard
                                key={document.id}
                                document={document}
                                onEdit={handleEdit}
                                onDeleteClick={setDocumentToDelete}
                            />
                        ))
                    )}
                </section>

                {totalPages > 1 && (
                    <div className="documents-pagination">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            ‹
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                type="button"
                                className={currentPage === index + 1 ? "active" : ""}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            type="button"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            ›
                        </button>
                    </div>
                )}



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