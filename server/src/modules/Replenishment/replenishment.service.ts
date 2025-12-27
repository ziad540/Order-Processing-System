import { Request, Response, NextFunction } from 'express';
import { DataStore } from '../../dataStore/index.js';

export const getAllOrders = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await db.getAllReplenishmentOrders();
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = Number(req.params.id);
        const { status } = req.body;
        const adminId = (req as any).user?.UserID;

        if (!orderId || !status) {
            return res.status(400).json({ error: 'Order ID and status are required' });
        }
        await db.updateReplenishmentOrderStatus(orderId, status, adminId);
        res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        next(error);
    }
};
