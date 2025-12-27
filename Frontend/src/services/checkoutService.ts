import { getToken } from './authService';

const API_URL = 'http://localhost:3000';

const getHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const processPurchase = async (cardNumber: string) => {
    const response = await fetch(`${API_URL}/checkout/purchase`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ cardNumber })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process purchase');
    }

    return await response.json();
};
