import express from "express";
import "dotenv/config";
import { db, initDb } from "./dataStore/index.js";
import { bookController } from "./modules/books/book.controller.js";
import { customerController } from "./modules/Customers/customer.controller.js";
import dotenv from "dotenv";
import { adminController } from "./modules/Admins/admin.controller.js";
import { shoppingCartController } from "./modules/ShoppingCart/shoppingcart.controller.js";
import { reportsController } from "./modules/reports/reports.controller.js";
import { checkoutController } from "./modules/Checkout/checkout.controller.js";
import { replenishmentController } from "./modules/Replenishment/replenishment.controller.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from 'cors';



(async () => {
  dotenv.config();

  await initDb();

  const app = express(); // 3SHAN NPARSE EL JSON 
  app.use(express.json());
  app.use('/uploads', express.static('uploads'));
  console.log("Database initialized");

  app.use(cors());
  app.use('/books', bookController(db));
  app.use('/customers', customerController(db));
  app.use('/admins', adminController(db));
  app.use('/cart', shoppingCartController(db));
  app.use('/reports', reportsController(db));
  app.use('/checkout', checkoutController(db));
  app.use('/replenishment', replenishmentController(db));

  //  http://localhost:3000/books/create
  // error handling middleware
  app.use(errorHandler);




  app.listen(process.env.PORT || 3000, () => console.log(`Server is running on port ${process.env.PORT || 3000}`));
})();
