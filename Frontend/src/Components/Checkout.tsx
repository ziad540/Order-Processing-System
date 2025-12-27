import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import CustomerNavbar from './CustomerNavbar';
import { User, CartItem } from '../App';
import * as checkoutService from '../services/checkoutService';

interface CheckoutProps {
  user: User;
  onLogout: () => void | Promise<void>;
  cart: CartItem[];
  clearCart: () => void;
}

export default function Checkout({ user, onLogout, cart, clearCart }: CheckoutProps) {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || ''
  });

  const totalPrice = cart.reduce((sum, item) => sum + (item.book.sellingPrice * item.quantity), 0);

  const validateLuhn = (number: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i));
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
  };

  const handleCardNumberChange = (value: string) => {
    // Remove non-digits and limit to 16 digits
    const digits = value.replace(/\D/g, '').substring(0, 16);
    // Add spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCardNumber = cardNumber.replace(/\s/g, '');

    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 16) {
      setError('Please enter a 13-16 digit credit card number');
      return;
    }

    if (!validateLuhn(cleanCardNumber)) {
      setError('The card number you entered is invalid. Please check for typos and try again.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      await checkoutService.processPurchase(cleanCardNumber);
      setOrderPlaced(true);
      setTimeout(() => {
        clearCart();
        navigate('/customer/orders');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !orderPlaced) {
    navigate('/customer/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <CustomerNavbar user={user} onLogout={onLogout} cart={[]} />
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-muted rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-foreground" />
            </div>
            <h1 className="text-foreground mb-4">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your purchase. You will be redirected to your orders page.
            </p>
            <div className="animate-pulse text-indigo-600 dark:text-primary">Redirecting...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CustomerNavbar user={user} onLogout={onLogout} cart={cart} />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 mb-6">
              <h2 className="text-foreground mb-6">Shipping Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-muted-foreground mb-2">First Name</label>
                    <input
                      type="text"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground mb-2">Last Name</label>
                    <input
                      type="text"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-muted-foreground mb-2">Email</label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-2">Phone</label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-2">Shipping Address</label>
                  <textarea
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Enter your shipping address"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-foreground mb-6">Payment Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-muted-foreground mb-2">
                    Credit Card Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="cardNumber"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => handleCardNumberChange(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${error && (error.includes('card') || error.includes('digit'))
                          ? 'border-destructive ring-1 ring-destructive'
                          : 'border-border'
                        }`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-muted-foreground mb-2">
                      Expiry Date *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        id="expiryDate"
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full pl-10 pr-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-muted-foreground mb-2">
                      CVV *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <input
                        id="cvv"
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full pl-10 pr-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center space-x-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex-shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {isProcessing ? 'Processing...' : 'Confirm Purchase'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 sticky top-6">
              <h2 className="text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.book.ISBN} className="flex justify-between text-muted-foreground">
                    <div className="flex-1 pr-2">
                      <p className="line-clamp-2">{item.book.title}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-foreground">
                      ${(item.book.sellingPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping:</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax:</span>
                  <span>${(totalPrice * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-foreground">
                  <span>Total:</span>
                  <span>${(totalPrice * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
