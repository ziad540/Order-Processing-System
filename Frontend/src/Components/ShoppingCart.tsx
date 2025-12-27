import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import CustomerNavbar from './CustomerNavbar';
import { User, CartItem } from '../App';

interface ShoppingCartProps {
  user: User;
  onLogout: () => void | Promise<void>;
  cart: CartItem[];
  updateQuantity: (isbn: string, quantity: number) => void;
  removeItem: (isbn: string) => void;
}

export default function ShoppingCart({ user, onLogout, cart, updateQuantity, removeItem }: ShoppingCartProps) {
  const navigate = useNavigate();

  const totalPrice = cart.reduce((sum, item) => sum + (Number(item.book.sellingPrice || 0) * item.quantity), 0);

  const handleCheckout = () => {
    navigate('/customer/checkout');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CustomerNavbar user={user} onLogout={onLogout} cart={cart} />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cart.length === 0 ? 'Your cart is empty' : `${cart.length} ${cart.length === 1 ? 'item' : 'items'} in your cart`}
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some books to get started</p>
            <button
              onClick={() => navigate('/customer/home')}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 transition-colors"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.book.ISBN} className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
                  <div className="flex gap-6">
                    {/* Book Cover */}
                    <div className="w-24 h-32 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.book.coverImage?.startsWith('http') ? item.book.coverImage : `http://localhost:3000/${item.book.coverImage}`}
                        alt={item.book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop';
                        }}
                      />
                    </div>

                    {/* Book Info */}
                    <div className="flex-1">
                      <h3 className="text-foreground mb-2">{item.book.title}</h3>
                      <p className="text-muted-foreground mb-1">{item.book.authors?.join(', ')}</p>
                      <p className="text-muted-foreground mb-3">ISBN: {item.book.ISBN}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <label htmlFor={`qty-${item.book.ISBN}`} className="text-muted-foreground">
                            Quantity:
                          </label>
                          <input
                            id={`qty-${item.book.ISBN}`}
                            type="number"
                            min="1"
                            max={item.book.stockLevel}
                            value={item.quantity}
                            onChange={(e) => {
                              let val = parseInt(e.target.value);
                              if (isNaN(val)) val = 1;
                              // Clamp value between 1 and stockLevel
                              val = Math.max(1, Math.min(val, item.book.stockLevel));
                              updateQuantity(item.book.ISBN, val);
                            }}
                            className="w-20 px-3 py-1.5 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>

                        <div className="text-right">
                          <p className="text-muted-foreground mb-1">${Number(item.book.sellingPrice || 0).toFixed(2)} each</p>
                          <p className="text-foreground">${(Number(item.book.sellingPrice || 0) * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.book.ISBN)}
                      className="flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Remove from cart"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 sticky top-6">
                <h2 className="text-foreground mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping:</span>
                    <span>FREE</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-foreground">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 transition-colors mb-3"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate('/customer/home')}
                  className="w-full bg-background text-indigo-600 border border-indigo-600 py-3 rounded-lg hover:bg-indigo-50 dark:text-primary dark:border-primary dark:hover:bg-muted transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
