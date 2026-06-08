const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function createIncome(incomeData) {
  const response = await fetch(`${API_URL}/incomes/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(incomeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Serverio klaida");
  }

  return data;
}

export async function getIncome(id) {
  const response = await fetch(`${API_URL}/incomes/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Serverio klaida");
  }

  return data;
}

export async function updateIncome(id, incomeData) {
  const response = await fetch(`${API_URL}/incomes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(incomeData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Serverio klaida");
  }

  return data;
}