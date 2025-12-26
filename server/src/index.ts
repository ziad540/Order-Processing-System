import express from "express";
import "dotenv/config";
import { db, initDb } from "./dataStore/index.js";
import { bookController } from "./modules/books/book.controller.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from 'cors';



(async () => {
  await initDb();
  const app = express();
  app.use(express.json());
  console.log("Database initialized");

  app.use(cors());
  app.use('/books', bookController(db));

  //  http://localhost:3000/books/create
  // error handling middleware
  app.use(errorHandler);

 


  app.listen(process.env.PORT|| 3000, () => console.log(`Server is running on port ${process.env.PORT || 3000}`));
})();
