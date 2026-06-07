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

export async function getDocument(documentId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/documents/${documentId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Nepavyko gauti garantijos."
        );
    }

    return data;
}

export async function updateDocument(documentId, formData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/documents/${documentId}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail || "Nepavyko atnaujinti garantijos."
        );
    }

    return data;
}