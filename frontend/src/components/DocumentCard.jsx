import "./DocumentCard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function DocumentCard({ document, onDeleteClick, onEdit }) {

    const hasValidUntil = Boolean(document.valid_until);

    const expired =
        hasValidUntil &&
        new Date(document.valid_until) < new Date();

    const normalizedFilePath = document.file_path?.replace("\\", "/");
    const imageUrl = `${API_URL}/${normalizedFilePath}`;

    const isImage =
        document.file_type === "jpg" ||
        document.file_type === "jpeg" ||
        document.file_type === "png";

    return (
        <article className="documents-card">
            <div className="documents-card-main">

                <div className="documents-file-preview">
                    {isImage ? (
                        <img
                            src={imageUrl}
                            alt={document.title}
                            className="documents-preview-image"
                        />
                    ) : (
                        <span>{document.file_type?.toUpperCase() || "DOC"}</span>
                    )}
                </div>

                <div className="documents-card-info">

                    <h3>{document.title}</h3>

                    <div>
                        <span>Parduotuvė</span>

                        <p>
                            {document.store_name || "Nenurodyta"}
                        </p>
                    </div>

                    <div>
                        <span>Pirkimo data</span>

                        <p>
                            {document.purchase_date || "Nenurodyta"}
                        </p>
                    </div>

                    <div>
                        <span>Garantija iki</span>

                        <p
                            className={
                                !hasValidUntil
                                    ? "unknown-date"
                                    : expired
                                        ? "expired-date"
                                        : "active-date"
                            }
                        >
                            {document.valid_until || "Garantija nenurodyta"}
                        </p>
                    </div>

                </div>
            </div>

            {!hasValidUntil ? (
                <div className="documents-status unknown">
                    ⓘ Garantija nenurodyta
                </div>
            ) : (
                <div className={expired ? "documents-status expired" : "documents-status active"}>
                    {expired ? "ⓘ Pasibaigusi" : "✓ Galioja"}
                </div>
            )}
            <div className="documents-card-actions">
                <button
                    type="button"
                    className="documents-edit-button"
                    onClick={() => onEdit(document.id)}
                    title="Redaguoti"
                >
                    🖉
                </button>

                <button
                    type="button"
                    className="documents-delete-button"
                    onClick={() => onDeleteClick(document)}
                    title="Ištrinti"
                >
                    🗑
                </button>
            </div>

        </article>
    );
}

export default DocumentCard;