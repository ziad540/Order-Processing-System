import { NextFunction, Request, Response } from "express";
import{ CartItem } from "../../../../shared/types.js";
import { ShoppingCart } from "../../../../shared/types.js";
import { DataStore } from "../../dataStore/index.js";

import { getCartItemByIsbnandCartId } from "./shoppingcart.service.js";
import { createCartItem } from "./shoppingcart.service.js";
import { getallitems } from "./shoppingcart.service.js";
import { removeCartItem ,addoneItemQuantity,minusoneItemQuantity} from "./shoppingcart.service.js";

import{ Router } from "express";
import { authMiddleware} from "../../middleware/auth.middleware.js";
import{authorizationMiddleware} from "../../middleware/authorziation.middleware.js";

export const  shoppingCartController = (db: DataStore)=>{
    const router = Router();

    router.post("/getCartItemByIsbnandCartId", authMiddleware, authorizationMiddleware("Customer",db),getCartItemByIsbnandCartId (db) );
    router.post("/createCartItem",authMiddleware,  authorizationMiddleware("Customer",db),createCartItem (db) );
    router.post("/getallitems", authMiddleware, authorizationMiddleware("Customer",db),getallitems (db) );
    router.post("/removeCartItem", authMiddleware,authorizationMiddleware("Customer",db), removeCartItem (db) );
    router.post("/addoneitem",  authMiddleware,authorizationMiddleware("Customer",db),addoneItemQuantity (db) );
    router.post("/minusoneitem",authMiddleware, authorizationMiddleware("Customer",db), minusoneItemQuantity (db) );

    return router;

}




