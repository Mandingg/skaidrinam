import "./DocumentCard.css";

function DocumentCard({ document, onDelete }) {

    const expired =
        document.valid_until &&
        new Date(document.valid_until) < new Date();

    return (
        <article className="documents-card">
            <div className="documents-card-main">

                <div className="documents-file-preview">
                    {document.file_type?.toUpperCase() || "DOC"}
                </div>

                <div className="documents-card-info">

                    <h3>{document.title}</h3>

                    <div>
                        <span>Failo tipas</span>

                        <p>
                            {document.file_type?.toUpperCase()}
                        </p>
                    </div>

                    <div>
                        <span>Garantija iki</span>

                        <p className={expired ? "expired-date" : "active-date"}>
                            {document.valid_until || "Nenurodyta"}
                        </p>
                    </div>

                </div>
            </div>

            <div
                className={
                    expired
                        ? "documents-status expired"
                        : "documents-status active"
                }
            >
                {expired ? "ⓘ Pasibaigusi" : "✓ Galioja"}
            </div>
            <div className="documents-card-header">
    <button
        type="button"
        className="documents-delete-button"
        onClick={() => onDelete(document.id)}
        title="Ištrinti"
    >
        🗑
    </button>
</div>

        </article>
    );
}

export default DocumentCard;