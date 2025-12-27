import { ShoppingCart } from "../../../../shared/types.js";
import { CartItem } from "../../../../shared/types.js";

export interface ShoppingCartDao {
  getCartByUserId(userId: number): Promise<ShoppingCart | null>;
  createCartForUser(userId: number): Promise<ShoppingCart>;
  //addItemToCart(userId: number, isbn: string, quantity: number): Promise<void>;
  removeItemFromCart(userId: number, isbn: string): Promise<void>;
  updateItemQuantity(cartId: number, isbn: string, quantity: number): Promise<void>;
  clearCart(userId: number): Promise<void>;
  plusoneItemQuantity(userId: number, isbn: string): Promise<void>;
  minusoneItemQuantity(userId: number, isbn: string): Promise<void>;

  getCartIdByUserId(userId: number): Promise<number | null>;
  getallCartItems(userId: number): Promise<CartItem[]>;
}