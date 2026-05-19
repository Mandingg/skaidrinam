const API_URL = "http://127.0.0.1:8000";

export async function registerUser(formData) {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Įvyko klaida registruojant vartotoją");
  }

  return data;
}