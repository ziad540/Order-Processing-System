import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './Components/Login';
import Signup from './Components/Signup';
import CustomerHome from './Components/CustomerHome';
import BookDetails from './Components/BookDetails';
import ShoppingCart from './Components/ShoppingCart';
import Checkout from './Components/Checkout';
import OrderHistory from './Components/OrderHistory';
import AdminDashboard from './Components/AdminDashboard';
import ManageBooks from './Components/ManageBooks';
import PublisherOrders from './Components/PublisherOrders';
import Reports from './Components/Reports';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'customer';
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Re-export Book from shared types
import { Book } from '../../shared/types';
export type { Book };


export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  orderNumber: string;
  orderDate: string;
  items: { isbn: string; title: string; quantity: number; price: number }[];
  totalPrice: number;
  status: 'Completed' | 'Processing' | 'Cancelled';
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (book: Book, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.book.ISBN === book.ISBN);
      if (existingItem) {
        return prevCart.map(item =>
          item.book.ISBN === book.ISBN
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { book, quantity }];
    });
  };

  const updateCartQuantity = (isbn: string, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.book.ISBN === isbn ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (isbn: string) => {
    setCart(prevCart => prevCart.filter(item => item.book.ISBN !== isbn));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />

          {/* Customer Routes */}
          <Route
            path="/customer/home"
            element={
              user?.role === 'customer' ? (
                <CustomerHome user={user} onLogout={handleLogout} addToCart={addToCart} cart={cart} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/customer/book/:isbn"
            element={
              user?.role === 'customer' ? (
                <BookDetails user={user} onLogout={handleLogout} addToCart={addToCart} cart={cart} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/customer/cart"
            element={
              user?.role === 'customer' ? (
                <ShoppingCart
                  user={user}
                  onLogout={handleLogout}
                  cart={cart}
                  updateQuantity={updateCartQuantity}
                  removeItem={removeFromCart}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/customer/checkout"
            element={
              user?.role === 'customer' ? (
                <Checkout user={user} onLogout={handleLogout} cart={cart} clearCart={clearCart} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/customer/orders"
            element={
              user?.role === 'customer' ? (
                <OrderHistory user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              user?.role === 'admin' ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin/books"
            element={
              user?.role === 'admin' ? (
                <ManageBooks user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin/publisher-orders"
            element={
              user?.role === 'admin' ? (
                <PublisherOrders user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin/reports"
            element={
              user?.role === 'admin' ? (
                <Reports user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
