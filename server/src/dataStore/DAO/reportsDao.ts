export interface ReportsDao {
    getSalesLastMonth(): Promise<{ totalRevenue: number; totalTransactions: number; reportingMonth: string }>;
    getTop5Customers(): Promise<any[]>;
    getTop10Books(): Promise<any[]>;
    getSalesByDate(date: string): Promise<number>;
    getOrderHistory(userId: number): Promise<any[]>;
}
