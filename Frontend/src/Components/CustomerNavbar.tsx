import { Link, useLocation } from 'react-router-dom';
import { BookOpen, ShoppingCart, Package, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../App';
import { CartItem } from '../App';
import ThemeToggle from './ThemeToggle';

interface CustomerNavbarProps {
  user: User;
  onLogout: () => void | Promise<void>;
  cart?: CartItem[];
}

export default function CustomerNavbar({ user, onLogout, cart = [] }: CustomerNavbarProps) {
  const location = useLocation();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background text-foreground border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/customer/home" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 dark:bg-primary rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-foreground">Bookstore</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            <Link
              to="/customer/home"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${isActive('/customer/home')
                  ? 'text-indigo-600 bg-indigo-50 dark:text-foreground dark:bg-muted'
                  : 'text-muted-foreground hover:text-indigo-600 hover:bg-muted dark:hover:text-primary'
                }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Browse Books</span>
            </Link>

            <Link
              to="/customer/cart"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors relative ${isActive('/customer/cart')
                  ? 'text-indigo-600 bg-indigo-50 dark:text-foreground dark:bg-muted'
                  : 'text-muted-foreground hover:text-indigo-600 hover:bg-muted dark:hover:text-primary'
                }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 dark:bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <Link
              to="/customer/orders"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${isActive('/customer/orders')
                  ? 'text-indigo-600 bg-indigo-50 dark:text-foreground dark:bg-muted'
                  : 'text-muted-foreground hover:text-indigo-600 hover:bg-muted dark:hover:text-primary'
                }`}
            >
              <Package className="w-5 h-5" />
              <span>My Orders</span>
            </Link>

            <Link
              to="/customer/profile"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${isActive('/customer/profile')
                  ? 'text-indigo-600 bg-indigo-50 dark:text-foreground dark:bg-muted'
                  : 'text-muted-foreground hover:text-indigo-600 hover:bg-muted dark:hover:text-primary'
                }`}
            >
              <UserIcon className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </div>

          {/* User Info & Theme & Logout */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex flex-col items-end leading-tight">
              <span className="text-sm font-semibold text-foreground">{user.firstName} {user.lastName}</span>
              <span className="text-xs font-medium text-muted-foreground">Customer</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 rounded-lg transition-colors"
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
