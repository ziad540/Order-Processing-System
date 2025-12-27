import { CartItem } from "../../../../shared/types.js";

export interface CartItemDao {
    getCartItemByCartIdAndIsbn(cartId: number, isbn: string): Promise<CartItem | null>;
    getCartItemByUserIdAndIsbn(userId: number, isbn: string): Promise<CartItem | null>;
    createCartItem(cartId: number, isbn: string, quantity: number): Promise<{
        cartId: number;
        isbn: string;
        quantity: number;
    }>;
    getCartItemQuantity(cartId: number, isbn: string): Promise<number | null>;

}