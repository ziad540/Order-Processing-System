import { Router } from 'express';
import { DataStore } from '../../dataStore/index.js';
import { getAllOrders, updateOrderStatus } from './replenishment.service.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authorizationMiddleware } from '../../middleware/authorziation.middleware.js';

export const replenishmentController = (db: DataStore) => {
    const router = Router();

    // Use authMiddleware and authorizationMiddleware to restrict to Admins
    router.get('/orders', authMiddleware(db), authorizationMiddleware('Admin', db), getAllOrders(db));
    router.put('/orders/:id/status', authMiddleware(db), authorizationMiddleware('Admin', db), updateOrderStatus(db));

    return router;
};
