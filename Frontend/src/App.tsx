import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './Components/Login';
import Signup from './Components/Signup';
import CustomerHome from './Components/CustomerHome';
import BookDetails from './Components/BookDetails';
import ShoppingCart from './Components/ShoppingCart';
import Checkout from './Components/Checkout';
import OrderHistory from './Components/OrderHistory';
import CustomerProfile from './Components/CustomerProfile';
import AdminDashboard from './Components/AdminDashboard';
import ManageBooks from './Components/ManageBooks';
import PublisherOrders from './Components/PublisherOrders';
import Reports from './Components/Reports';
import * as authService from './services/authService';
import * as cartService from './services/cartService';

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
  // Initialize user from local storage via authService
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      // Map stored user to User interface if needed, relying on data consistency for now
      // Or re-mapping similar to Login.tsx if storage format differs
      const role = storedUser.role ? storedUser.role.toLowerCase() : 'customer';
      return {
        id: storedUser.UserID?.toString() || storedUser.id,
        username: storedUser.Username || storedUser.username,
        role: role as 'admin' | 'customer',
        firstName: storedUser.FirstName || storedUser.firstName,
        lastName: storedUser.LastName || storedUser.lastName,
        email: storedUser.email,
        phone: storedUser.phones?.[0] || storedUser.phone,
        address: storedUser.ShippingAddress || storedUser.address
      };
    }
    return null;
  });
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const profileData = await authService.getUserProfile();
          console.log('[App] Parsed profile data:', profileData);
          if (profileData) {
            // Adapt backend response to frontend User interface if necessary
            const role = (profileData.Role || profileData.role || 'customer').toLowerCase();
            const updatedUser: User = {
              id: profileData.UserID?.toString() || profileData.id,
              username: profileData.Username || profileData.username,
              role: role as 'admin' | 'customer',
              firstName: profileData.FirstName || profileData.firstName,
              lastName: profileData.LastName || profileData.lastName,
              email: profileData.email || profileData.Email,
              phone: profileData.phones?.[0] || profileData.phone,
              address: profileData.ShippingAddress || profileData.shippingAddress || profileData.address
            };
            setUser(updatedUser);
          }
        } catch (error) {
          console.error("Failed to load user profile", error);
        }
      }
    };

    fetchProfile();
  }, []);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      cartService.getCart()
        .then(data => setCart(data))
        .catch(err => console.error("Failed to load cart", err));
    } else {
      setCart([]); // Reset cart on logout/if no user (or keep local if we want persistence across reloads for guests, but simpler to reset)
    }
  }, [user]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCart([]);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prevUser => (prevUser ? { ...prevUser, ...updates } : prevUser));
  };

  const addToCart = async (book: Book, quantity: number = 1) => {
    if (user) {
      try {
        await cartService.addToCart(book.ISBN, quantity);
        const updatedCart = await cartService.getCart();
        setCart(updatedCart);
      } catch (error) {
        console.error("Failed to add to cart", error);
      }
    } else {
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
    }
  };

  const updateCartQuantity = async (isbn: string, quantity: number) => {
    if (user) {
      try {
        await cartService.updateQuantity(isbn, quantity);
        const updatedCart = await cartService.getCart();
        setCart(updatedCart);
      } catch (error) {
        console.error("Failed to update cart quantity", error);
      }
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.book.ISBN === isbn ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = async (isbn: string) => {
    if (user) {
      try {
        await cartService.removeFromCart(isbn);
        const updatedCart = await cartService.getCart();
        setCart(updatedCart);
      } catch (error) {
        console.error("Failed to remove from cart", error);
      }
    } else {
      setCart(prevCart => prevCart.filter(item => item.book.ISBN !== isbn));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartService.clearCart();
        setCart([]);
      } catch (e) {
        console.error("Failed to clear cart", e);
      }
    } else {
      setCart([]);
    }
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
          <Route
            path="/customer/profile"
            element={
              user?.role === 'customer' ? (
                <CustomerProfile user={user} onLogout={handleLogout} cart={cart} onUpdateUser={updateUser} />
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
