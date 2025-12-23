import { ShoppingCart } from "../../../../shared/types.js";

export interface ShoppingCartDao {
  getCartByUserId(userId: number): Promise<ShoppingCart | null>;
  createCartForUser(userId: number): Promise<ShoppingCart>;
  addItemToCart(userId: number, isbn: string, quantity: number): Promise<void>;
  removeItemFromCart(userId: number, isbn: string): Promise<void>;
  updateItemQuantity(userId: number, isbn: string, quantity: number): Promise<void>;
  clearCart(userId: number): Promise<void>;
}