const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getDocuments() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/documents/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Nepavyko gauti garantijų."
        );
    }

    return data;
}

export async function createDocument(formData) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/documents/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Nepavyko išsaugoti garantijos."
        );
    }

    return data;
}

export async function deleteDocument(documentId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/documents/${documentId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Nepavyko ištrinti garantijos."
        );
    }

    return data;
}