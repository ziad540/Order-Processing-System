import { NextFunction, Request, Response } from "express";
import { CartItem } from "../../../../shared/types.js";
import { ShoppingCart } from "../../../../shared/types.js";
import { DataStore } from "../../dataStore/index.js";

import { getCartItemByIsbnandCartId } from "./shoppingcart.service.js";
import { createCartItem } from "./shoppingcart.service.js";
import { getallitems } from "./shoppingcart.service.js";
import { removeCartItem, addoneItemQuantity, minusoneItemQuantity, updateItemQuantity, clearCart } from "./shoppingcart.service.js";
import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorizationMiddleware } from "../../middleware/authorziation.middleware.js";


export const shoppingCartController = (db: DataStore) => {
    const router = Router();

    router.post("/getCartItemByIsbnandCartId", authMiddleware(db), authorizationMiddleware("Customer", db), getCartItemByIsbnandCartId(db));
    router.post("/createCartItem", authMiddleware(db), authorizationMiddleware("Customer", db), createCartItem(db));
    router.post("/getallitems", authMiddleware(db), authorizationMiddleware("Customer", db), getallitems(db));
    router.post("/removeCartItem", authMiddleware(db), authorizationMiddleware("Customer", db), removeCartItem(db));
    router.post("/addoneitem", authMiddleware(db), authorizationMiddleware("Customer", db), addoneItemQuantity(db));
    router.post("/minusoneitem", authMiddleware(db), authorizationMiddleware("Customer", db), minusoneItemQuantity(db));
    router.post("/updateItemQuantity", authMiddleware(db), authorizationMiddleware("Customer", db), updateItemQuantity(db));
    router.delete("/clear", authMiddleware(db), authorizationMiddleware("Customer", db), clearCart(db));

    return router;

}



