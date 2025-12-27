import { Router } from 'express';
import { DataStore } from '../../dataStore/index.js';
import { getDashboardStats, getSalesByDate, getOrderHistory, getReplenishmentCountByISBN } from './reports.service.js';

export const reportsController = (db: DataStore) => {
  const router = Router();

  router.get('/dashboard', getDashboardStats(db));
  router.get('/sales-by-date', getSalesByDate(db));
  router.get('/order-history/:userId', getOrderHistory(db));
  router.get('/replenishment-count/:isbn', getReplenishmentCountByISBN(db));

  return router;
};
