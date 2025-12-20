import express from "express";
import "dotenv/config";
import { initDb } from "./dataStore/index.js";
// import { userRouter } from "./modules/users/user.routes.js";


(async () => {
  await initDb();
  const app = express();
  app.use(express.json());
  
  // Mount the user routes
  // app.use('/api/v1/users', userRouter);

  app.listen(process.env.PORT|| 3000, () => console.log(`Server is running on port ${process.env.PORT || 3000}`));
})();
