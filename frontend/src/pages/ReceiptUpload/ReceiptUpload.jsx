import { useState } from "react";
import { useNavigate } from "react-router";
import { analyzeReceiptImage, saveAiReceipt } from "../../services/receiptApi";

import "./ReceiptUpload.css";

import cekioLogo from "../../assets/LogoIcon.svg";

function ReceiptUpload() {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [editableExpenses, setEditableExpenses] = useState([]);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);


    const navigate = useNavigate();


    function handleFileChange(e) {
        setFile(e.target.files[0]);
        setAnalysis(null);
        setEditableExpenses([]);
        setMessage("");
        setIsError(false);
    }

    async function handleAnalyze() {
        if (!file) {
            setMessage("Pasirinkite kvito nuotrauką");
            setIsError(true);
            return;
        }

        setLoading(true);
        setMessage("");
        setIsError(false);

        try {
            const data = await analyzeReceiptImage(file);
            setAnalysis(data);
            setEditableExpenses(data.save_preview.expenses);
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    }

    function handleExpenseChange(index, field, value) {
        setEditableExpenses((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    }

    async function handleSave() {
        if (!analysis?.save_preview) return;

        setSaving(true);
        setMessage("");
        setIsError(false);

        try {
            const payload = {
                ...analysis.save_preview,
                expenses: editableExpenses.map((item) => ({
                    ...item,
                    amount: Number(item.amount),
                })),
            };

            const data = await saveAiReceipt(payload);

            setMessage(
                `${data.message}. Sukurta įrašų: ${data.created_expenses}. Peradresuojama...`
            );
            setIsError(false);

            setTimeout(() => {
                navigate("/islaidos");
            }, 3000);
        } catch (error) {
            setMessage(error.message);
            setIsError(true);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="receipt-upload-page">
            <main className="receipt-upload-card">
                <div className="receipt-upload-header">
                    <div className="receipt-upload-logo-title">
                        <img
                            src={cekioLogo}
                            alt="Čekiukai logo"
                            className="receipt-upload-logo"
                        />
                    </div>
                </div>
                <h1 className="receipt-upload-title">Kvito nuskaitymas</h1>

                <div className="receipt-upload-form">
                    <label className="receipt-file-label">
                        Pasirinkite kvito nuotrauką
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="receipt-file-input-hidden"
                        />
                    </label>

                    {file && (
                        <p className="receipt-selected-file">
                            Pasirinktas failas: {file.name}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="receipt-primary-button"
                    >
                        {loading ? "Analizuojama..." : "Nuskaityti kvitą"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/pagrindinis")}
                        className="receipt-secondary-button"
                    >
                        Atšaukti
                    </button>
                </div>

                {analysis && (
                    <div className="receipt-result">
                        <h2 className="receipt-section-title">Rasta informacija</h2>

                        <div className="receipt-info">
                            <p><strong>Parduotuvė:</strong> {analysis.store_name}</p>
                            <p><strong>Data:</strong> {analysis.receipt_date}</p>
                            <p><strong>Suma:</strong> {analysis.total_amount} €</p>
                            <p><strong>Bendra kategorija:</strong> {analysis.category}</p>
                            <p><strong>Atpažinimo tikslumas:</strong>{" "} {Math.round((analysis.confidence || 0) * 100)}%</p>
                        </div>

                        <h3 className="receipt-preview-title">Galite pataisyti prieš išsaugant:</h3>

                        <div className="receipt-expense-list">
                            {editableExpenses.map((item, index) => (
                                <div key={index} className="receipt-expense-edit-row">
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) =>
                                            handleExpenseChange(index, "description", e.target.value)
                                        }
                                        className="receipt-edit-input"
                                    />

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={item.amount}
                                        onChange={(e) =>
                                            handleExpenseChange(index, "amount", e.target.value)
                                        }
                                        className="receipt-edit-amount"
                                    />

                                    <input
                                        type="text"
                                        value={item.category_name}
                                        onChange={(e) =>
                                            handleExpenseChange(index, "category_name", e.target.value)
                                        }
                                        className="receipt-edit-category"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="receipt-primary-button receipt-save-button"
                        >
                            {saving ? "Saugoma..." : "Išsaugoti į išlaidas"}
                        </button>
                    </div>
                )}

                {message && (
                    <p className={`receipt-message ${isError ? "error" : "success"}`}>
                        {message}
                    </p>
                )}
            </main>
        </div>
    );
}

export default ReceiptUpload;