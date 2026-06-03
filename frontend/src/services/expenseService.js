import {getCurrentUserId} from './userService';

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'MAISTAS' },
  { id: 2, name: 'BUITIS' },
  { id: 3, name: 'KURAS' },
  { id: 4, name: 'SVEIKATA' }
];

export const getUserCategories = async () => {
  const userId = getCurrentUserId();
  try {
    const response = await fetch(`http://127.0.0.1:8000/expenses/categories?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error('Serveris grąžino klaidą');
    }
    
    const data = await response.json();
    if (data.length === 0) {
      console.warn('Nerasta kategorijų, naudojamos numatytosios kategorijos');
      return FALLBACK_CATEGORIES;
    }
    return data;
    
  } catch (error) {
    console.warn('API nepasiekiamas, naudojamos numatytosios kategorijos:', error.message);
    return FALLBACK_CATEGORIES;
  }
};

export const getUserExpenses = async() => {
    const userId = getCurrentUserId();
    try {
        const response = await fetch(`http://127.0.0.1:8000/expenses/list?user_id=${userId}`);
    if (!response.ok) {
      throw new Error('Serveris grąžino klaidą');
    }
    
    const data = await response.json();
    return data; 
    }
    catch (error) {
    console.warn('API nepasiekiamas:', error.message);
    return []
}}

export const deleteExpense = async(expenseId) => {
  try{
    const response = await fetch(`http://localhost:8000/expenses/delete/${expenseId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Serveris grąžino klaidą trinant išlaidą');
    }
    const result = await response.json();
    return result.success;
  }
  catch (error) {
    console.warn('API klaida trinant išlaidą:', error.message);
    return false;
}}

export const exportExpensesCSV = async() => {
  const userID = getCurrentUserId();
  try{
    const response = await fetch(`http://127.0.0.1:8000/expenses/export?user_id=${userID}`);
    if (!response.ok) {
      throw new Error(`Serverio klaida: ${response.status}: ${response.statusText}`);
    }
    const data = await response.blob();
    const url = window.URL.createObjectURL(data);
    const documentLink = document.createElement('a');
    documentLink.href = url;
    documentLink.setAttribute('download', 'expenses.csv');
    document.body.appendChild(documentLink);
    documentLink.click();
    document.body.removeChild(documentLink);
    window.URL.revokeObjectURL(url);
    }
  catch(error){
    console.warn(`Klaida eksportuojant CSV: ${error.message}`);
  }
}