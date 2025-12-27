import axios from 'axios';
import { getAuthHeaders } from './authService';
import { ReplenishmentOrder } from '../../../shared/types';

const API_URL = 'http://localhost:3000/replenishment';

export const publisherOrderService = {
    getAllOrders: async (): Promise<ReplenishmentOrder[]> => {
        const headers = getAuthHeaders();
        const response = await axios.get(`${API_URL}/orders`, { headers });
        return response.data;
    },

    updateOrderStatus: async (orderId: number, status: string): Promise<void> => {
        const headers = getAuthHeaders();
        await axios.put(`${API_URL}/orders/${orderId}/status`, { status }, { headers });
    }
};
