export interface CheckoutDao {
    createSalesTransaction(userId: number, cardNum: string, totalAmount: number): Promise<number>;
    createTransactionItem(transactionId: number, isbn: string, quantity: number, pricePerUnit: number): Promise<void>;
    ensureCreditCardExists(userId: number, cardNum: string): Promise<void>;
}
