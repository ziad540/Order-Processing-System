export interface ReportsDao {
    getSalesLastMonth(): Promise<{ totalRevenue: number; totalTransactions: number; reportingMonth: string }>;
    getTop5Customers(): Promise<any[]>;
    getTop10Books(): Promise<any[]>;
    getSalesByDate(date: string): Promise<{ totalRevenue: number; totalTransactions: number }>;
    getOrderHistory(userId: number): Promise<any[]>;
}
