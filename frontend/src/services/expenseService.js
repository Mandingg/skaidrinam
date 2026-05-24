const FALLBACK_CATEGORIES = [
  { id: 1, name: 'MAISTAS' },
  { id: 2, name: 'NAMAI' },
  { id: 3, name: 'TRANSPORTAS' },
  { id: 4, name: 'SVEIKATA' }
];

export const getUserCategories = async (userId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/expenses/categories?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error('Serveris grąžino klaidą');
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.warn('API nepasiekiamas, naudojamos numatytosios kategorijos:', error.message);
    return FALLBACK_CATEGORIES;
  }
};