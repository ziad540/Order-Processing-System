import { Router } from "express";
import { DataStore } from "../../dataStore/index.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorizationMiddleware } from "../../middleware/authorziation.middleware.js";
import { processPurchase } from "./checkout.service.js";

export const checkoutController = (db: DataStore) => {
    const router = Router();

    router.post("/purchase", authMiddleware(db), authorizationMiddleware("Customer", db), processPurchase(db));

    return router;
}
