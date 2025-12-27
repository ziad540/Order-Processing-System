import { Request, Response, NextFunction } from 'express';
import { DataStore } from '../../dataStore/index.js';

export const getDashboardStats = (db: DataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const salesLastMonth = await db.getSalesLastMonth();
      const topCustomers = await db.getTop5Customers();
      const topBooks = await db.getTop10Books();
      const replenishmentOrderCount = await db.getReplenishmentOrderCount();

      res.status(200).json({
        salesLastMonth,
        topCustomers,
        topBooks,
        replenishmentOrderCount
      });
    } catch (error) {
      next(error);
    }
  };
};

export const getSalesByDate = (db: DataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ error: 'Date is required' });
      }
      const result = await db.getSalesByDate(date as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
};

export const getOrderHistory = (db: DataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      const history = await db.getOrderHistory(userId);

      // Group by TransactionID to match frontend structure
      const ordersMap = new Map();

      history.forEach((row: any) => {
        if (!ordersMap.has(row.TransactionID)) {
          ordersMap.set(row.TransactionID, {
            orderNumber: row.TransactionID,
            orderDate: row.TransactionDate,
            totalPrice: Number(row.OrderTotal),
            status: 'Completed',
            items: []
          });
        }
        ordersMap.get(row.TransactionID).items.push({
          isbn: row.ISBN,
          title: row.BookTitle,
          quantity: row.Quantity,
          price: Number(row.PricePerUnit)
        });
      });
      res.status(200).json(Array.from(ordersMap.values()));
    } catch (error) {
      next(error);
    }
  };
};

export const getReplenishmentCountByISBN = (db: DataStore) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isbn } = req.params;
      if (!isbn) {
        return res.status(400).json({ error: 'ISBN is required' });
      }
      const count = await db.getReplenishmentOrderCountByISBN(isbn);
      res.status(200).json({ count });
    } catch (error) {
      next(error);
    }
  };
};
