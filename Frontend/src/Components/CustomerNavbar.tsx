import { Link, useLocation } from 'react-router-dom';
import { BookOpen, ShoppingCart, Package, LogOut } from 'lucide-react';
import { User } from '../App';
import { CartItem } from '../App';

interface CustomerNavbarProps {
  user: User;
  onLogout: () => void;
  cart?: CartItem[];
}

export default function CustomerNavbar({ user, onLogout, cart = [] }: CustomerNavbarProps) {
  const location = useLocation();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/customer/home" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-900">University Bookstore</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            <Link
              to="/customer/home"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/customer/home')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Browse Books</span>
            </Link>

            <Link
              to="/customer/cart"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors relative ${
                isActive('/customer/cart')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link
              to="/customer/orders"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/customer/orders')
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>My Orders</span>
            </Link>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-900">{user.firstName} {user.lastName}</p>
              <p className="text-gray-500">Customer</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
