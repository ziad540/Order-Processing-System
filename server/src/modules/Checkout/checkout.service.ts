import { DataStore } from '../../dataStore/index.js';
import { Request, Response, NextFunction } from 'express';

const isValidLuhn = (number: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i));
        if (shouldDouble) {
            if ((digit *= 2) > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
};

export const processPurchase = (db: DataStore) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user?.UserID;
            const { cardNumber } = req.body;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            if (!cardNumber) {
                return res.status(400).json({ error: 'Card number is required' });
            }

            // Remove any spaces just in case
            const cleanCardNumber = cardNumber.replace(/\s/g, '');

            if (!isValidLuhn(cleanCardNumber)) {
                return res.status(400).json({ error: 'Invalid credit card number' });
            }

            // 1. Get current cart items
            const cartItems = await db.getallCartItems(userId);
            if (cartItems.length === 0) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            // 2. Calculate Total (including tax if we want, following frontend 8%)
            const subtotal = cartItems.reduce((sum, item) => sum + (item.book.sellingPrice * item.quantity), 0);
            const total = subtotal * 1.08;

            // 3. Ensure credit card exists for foreign key constraint
            await db.ensureCreditCardExists(userId, cardNumber);

            // 4. Create Transaction
            const transactionId = await db.createSalesTransaction(userId, cardNumber, total);

            // 5. Create Transaction Items
            for (const item of cartItems) {
                await db.createTransactionItem(transactionId, item.book.ISBN, item.quantity, item.book.sellingPrice);
            }

            // Note: Deducting stock and clearing cart are handled by DB triggers:
            // - TR_OrderItems_DeductStock (AFTER INSERT ON TransactionItems)
            // - TR_Sales_ClearCart (AFTER INSERT ON SalesTransactions)

            res.status(200).json({
                success: true,
                message: 'Purchase completed successfully',
                transactionId
            });
        } catch (error) {
            console.error('[CheckoutService] Error processing purchase:', error);
            next(error);
        }
    };
};
