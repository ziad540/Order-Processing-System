import express from "express";
import "dotenv/config";
import { db, initDb } from "./dataStore/index.js";
import { bookController } from "./modules/books/book.controller.js";
import { customerController } from "./modules/Customers/customer.controller.js";


(async () => {
  await initDb();
  const app = express(); // 3SHAN NPARSE EL JSON 
  app.use(express.json());
  console.log("Database initialized");

  app.use('/books', bookController(db));
  app.use('/customers', customerController(db));

  //  http://localhost:3000/books/create
  // error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

 


  app.listen(process.env.PORT|| 3000, () => console.log(`Server is running on port ${process.env.PORT || 3000}`));
})();
