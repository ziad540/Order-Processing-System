import { CartItem } from '../App';
import { getToken } from './authService';

const API_URL = 'http://localhost:3000';

const getHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getCart = async (): Promise<CartItem[]> => {
    const response = await fetch(`${API_URL}/cart/getallitems`, {
        method: 'POST', // Backend uses POST for getting all items... somewhat unconventional but following existing controller
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    return await response.json();
};

export const addToCart = async (isbn: string, quantity: number = 1) => {
    const response = await fetch(`${API_URL}/cart/createCartItem`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ isbn, quantity })
    });
    if (!response.ok) throw new Error('Failed to add to cart');
    return await response.json();
};

export const removeFromCart = async (isbn: string) => {
    const response = await fetch(`${API_URL}/cart/removeCartItem`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ isbn })
    });
    if (!response.ok) throw new Error('Failed to remove from cart');
    return await response.json();
};

export const updateQuantity = async (isbn: string, quantity: number) => {
    const response = await fetch(`${API_URL}/cart/updateItemQuantity`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ isbn, quantity })
    });
    if (!response.ok) throw new Error('Failed to update quantity');
    return await response.json();
};

export const increaseQuantity = async (isbn: string) => {
    const response = await fetch(`${API_URL}/cart/addoneitem`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ isbn })
    });
    if (!response.ok) throw new Error('Failed to increase quantity');
    return await response.json();
};

export const decreaseQuantity = async (isbn: string) => {
    const response = await fetch(`${API_URL}/cart/minusoneitem`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ isbn })
    });
    if (!response.ok) throw new Error('Failed to decrease quantity');
    return await response.json();
};

export const clearCart = async () => {
    const response = await fetch(`${API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to clear cart');
    return await response.json();
};
