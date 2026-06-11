const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
import {getCurrentUserId} from './userService';

export async function getExpense(id) {
  const response = await fetch(`${API_URL}/expenses/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Serverio klaida");
  return data;
}

export async function getStoreForExpense(id) {
  const response = await fetch(`${API_URL}/expenses/${id}/store`);
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

export async function getUserStores(){
  const userId = await getCurrentUserId();
  try{
  const response = await fetch(`${API_URL}/receipts/stores?user_id=${userId}`);
  if (!response.ok) {
      throw new Error('Serveris grąžino klaidą');
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.warn('API nepasiekiamas:', error.message);
    return []}
}