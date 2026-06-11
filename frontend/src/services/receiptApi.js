const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

export async function analyzeReceiptImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/receipts/analyze-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Nepavyko nuskaityti kvito");
  }
  
  return data;
}

export async function saveAiReceipt(savePreview) {
  const response = await fetch(`${API_URL}/receipts/save-ai-result`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(savePreview),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Nepavyko išsaugoti kvito");
  }

  return data;
}
