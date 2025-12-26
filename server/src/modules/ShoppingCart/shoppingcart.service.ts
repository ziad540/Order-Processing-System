import { DataStore } from "../../dataStore/index.js";
import { Router } from "express";

import { ShoppingCart } from "../../../../shared/types.js";
import { CartItem } from "../../../../shared/types.js";

import { Request , 
Response , NextFunction
} from "express";


export const  getCartItemByIsbnandCartId = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const { cartId, isbn } = req.body;
    try {
        const cartItem: CartItem | null = await db.getCartItemByCartIdAndIsbn(Number(cartId), isbn);
        if (!cartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }
        res.status(200).json(cartItem);
    } catch (error) {
        next(error);
    }   
};
export const createCartItem = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const { cartId, isbn, quantity } = req.body;
    try {

         const existingCartItem = await db.getCartItemByCartIdAndIsbn(Number(cartId), isbn);
         if (existingCartItem) {
             const awaitedQuantity = await db.getCartItemQuantity(Number(cartId), isbn);
             const newQuantity = awaitedQuantity! + quantity;
             await db.updateItemQuantity( Number(cartId), isbn, newQuantity);
             return res.status(400).json({ error: "Item already exists in cart, quantity updated" , newQuantity  });
         }
        const newCartItem = await db.createCartItem(Number(cartId), isbn, quantity);
        res.status(201).json(newCartItem);
    } catch (error) {
        next(error);
    }
};

export const getallitems = 
(db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;
    try {
        const cartItems: CartItem[] = await db.getallCartItems(Number(userId));
        res.status(200).json(cartItems);
    } catch (error) {
        next(error);
    }
};

export const removeCartItem = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const { userId, isbn } = req.body;
    try {
            const  result =  await db.getCartItemByUserIdAndIsbn( Number(userId), isbn);
            if(!result){
                return res.status(404).json({ error: "book not found in your cart" });
            } 


        
        await db.removeItemFromCart(Number(userId), isbn);
        res.status(200).json({ message: "Cart item removed successfully" });
    } catch (error) {
        next(error);
    }
};

export const addoneItemQuantity = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const { userId, isbn } = req.body;
    try {
        await db.plusoneItemQuantity(Number(userId), isbn);
        res.status(200).json({ message: "Increased item quantity by one" });
    } catch (error) {
        next(error);
    }
};

export const minusoneItemQuantity = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const { userId, isbn } = req.body;
    try {
        await db.minusoneItemQuantity(Number(userId), isbn);
        res.status(200).json({ message: "Decreased item quantity by one" });
    }
    catch (error) {
        next(error);
    }
};