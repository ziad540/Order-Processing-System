import { DataStore } from "../../dataStore/index.js";
import { Router } from "express";

import { ShoppingCart } from "../../../../shared/types.js";
import { CartItem } from "../../../../shared/types.js";

import {
    Request,
    Response, NextFunction
} from "express";


export const getCartItemByIsbnandCartId = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const { isbn } = req.body;
    const userId = (req as any).user?.UserID;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        const cartItem: CartItem | null = await db.getCartItemByUserIdAndIsbn(Number(userId), isbn);
        if (!cartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }
        res.status(200).json(cartItem);
    } catch (error) {
        next(error);
    }
};
export const createCartItem = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const { isbn, quantity } = req.body;
    const userId = (req as any).user?.UserID;
    console.log(`[ShoppingCartService] createCartItem called. UserID: ${userId}, ISBN: ${isbn}, Quantity: ${quantity}`);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        let cartId = await db.getCartIdByUserId(Number(userId));
        console.log(`[ShoppingCartService] getCartIdByUserId result: ${cartId}`);
        if (!cartId) {
            console.log(`[ShoppingCartService] Creating new cart for user ${userId}`);
            const newCart = await db.createCartForUser(Number(userId));
            cartId = newCart.cartId;
            console.log(`[ShoppingCartService] New cart created. CartID: ${cartId}`);
        }

        const existingCartItem = await db.getCartItemByCartIdAndIsbn(cartId!, isbn);
        if (existingCartItem) {
            console.log(`[ShoppingCartService] Item exists. Updating quantity.`);
            const awaitedQuantity = await db.getCartItemQuantity(cartId!, isbn);
            const newQuantity = awaitedQuantity! + quantity;
            await db.updateItemQuantity(cartId!, isbn, newQuantity);
            return res.status(200).json({ message: "Item quantity updated", newQuantity });
        }
        console.log(`[ShoppingCartService] Creating new cart item.`);
        const newCartItem = await db.createCartItem(cartId!, isbn, quantity);
        res.status(201).json(newCartItem);
    } catch (error) {
        console.error(`[ShoppingCartService] Error in createCartItem:`, error);
        next(error);
    }
};

export const getallitems = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.UserID;
    console.log(`[ShoppingCartService] getallitems called. UserID: ${userId}`);
    try {
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const cartItems: CartItem[] = await db.getallCartItems(Number(userId));
        console.log(`[ShoppingCartService] Retrieved ${cartItems.length} items.`);
        res.status(200).json(cartItems);
    } catch (error) {
        console.error(`[ShoppingCartService] Error in getallitems:`, error);
        next(error);
    }
};

export const removeCartItem = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {

    const userId = (req as any).user.UserID;
    const { isbn } = req.body;
    try {

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const userr = await db.getById(Number(userId));
        if (!userr) {
            return res.status(404).json({ error: "User not found" });
        }
        const result = await db.getCartItemByUserIdAndIsbn(Number(userId), isbn);
        if (!result) {
            return res.status(404).json({ error: "book not found in your cart" });
        }



        await db.removeItemFromCart(Number(userId), isbn);
        res.status(200).json({ message: "Cart item removed successfully" });
    } catch (error) {
        next(error);
    }
};

export const addoneItemQuantity = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.UserID;
    try {

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const userr = await db.getById(Number(userId));
        if (!userr) {
            return res.status(404).json({ error: "User not found" });
        }

        const { isbn } = req.body;

        await db.plusoneItemQuantity(Number(userId), isbn);
        res.status(200).json({ message: "Increased item quantity by one" });
    } catch (error) {
        next(error);
    }
};

export const minusoneItemQuantity = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.UserID;

    const { isbn } = req.body;
    try {
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const userr = await db.getById(Number(userId));
        if (!userr) {
            return res.status(404).json({ error: "User not found" });
        }

        await db.minusoneItemQuantity(Number(userId), isbn);
        res.status(200).json({ message: "Decreased item quantity by one" });
    }
    catch (error) {
        next(error);
    }
};

export const updateItemQuantity = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const { isbn, quantity } = req.body;
    const userId = (req as any).user?.UserID;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        const cartId = await db.getCartIdByUserId(Number(userId));
        if (!cartId) return res.status(404).json({ error: "Cart not found" });

        await db.updateItemQuantity(cartId, isbn, quantity);
        res.status(200).json({ message: "Item quantity updated successfully" });
    } catch (error) {
        next(error);
    }
};

export const clearCart = (db: DataStore) => async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.UserID;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
        await db.clearCart(Number(userId));
        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        next(error);
    }
};