import axios from 'axios';

const API_URL = 'http://localhost:3000/reports';

export interface DashboardStats {
  salesLastMonth: {
    totalRevenue: number;
    totalTransactions: number;
    reportingMonth: string;
  };
  topCustomers: {
    UserID: number;
    FirstName: string;
    LastName: string;
    OrdersPlaced: number;
    TotalSpent: number;
  }[];
  topBooks: {
    ISBN: string;
    Title: string;
    TotalCopiesSold: number;
    CurrentStock: number;
  }[];
}

export const reportsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data;
  },

  getSalesByDate: async (date: string): Promise<{ totalRevenue: number; totalTransactions: number }> => {
    const response = await axios.get(`${API_URL}/sales-by-date`, { params: { date } });
    return response.data;
  },

  getOrderHistory: async (userId: number): Promise<any[]> => {
    const response = await axios.get(`${API_URL}/order-history/${userId}`);
    return response.data;
  }
};
