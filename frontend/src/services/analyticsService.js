import {getCurrentUserId} from './userService';

export const getUserTransactions = async() =>{
    const userID = getCurrentUserId();
    try{
        const response = await fetch(`http://://127.0.0.1:8000/transactions?user_id=${userID}`)
        if (!response.ok){
            throw new Error('Serveris grąžino klaidą');
        }
        const data = await response.json();
        return data;
    }
    catch (error){
        console.warn('API nepasiekiamas:', error.message);
        return [];
    }
}