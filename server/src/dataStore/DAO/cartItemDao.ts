import { CartItem } from "../../../../shared/types.js";

export interface CartItemDao {
    getCartItemByCartIdAndIsbn(cartId: number, isbn: string): Promise<CartItem | null>;
    createCartItem(cartId: number, isbn: string, quantity: number): Promise<CartItem>;
    updateCartItemQuantity(cartId: number, isbn: string, quantity: number): Promise<void>;
    deleteCartItem(cartId: number, isbn: string): Promise<void>;
}