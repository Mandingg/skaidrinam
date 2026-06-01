import { getCurrentUserId } from "./userService";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getExpense(id) {
  const response = await fetch(`${API_URL}/expenses/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Serverio klaida");
  return data;
}

export async function updateExpense(id, expenseData) {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expenseData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Serverio klaida");
  return data;
}

export async function createExpense(expenseData) {
  expenseData.user_id = getCurrentUserId(); // Pridėkite user_id prie expenseData
  const response = await fetch(`${API_URL}/expenses/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expenseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Serverio klaida");
  }

  return data;
}
