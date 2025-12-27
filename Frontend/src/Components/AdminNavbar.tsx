import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Package, FileText, BarChart3, LogOut } from 'lucide-react';
import { User } from '../App';
import ThemeToggle from './ThemeToggle';

interface AdminNavbarProps {
  user: User;
  onLogout: () => void;
}

export default function AdminNavbar({ user, onLogout }: AdminNavbarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-indigo-900 text-white shadow-lg dark:bg-background dark:text-foreground dark:border-b dark:border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-card rounded-lg dark:border dark:border-border">
              <BookOpen className="w-6 h-6 text-indigo-900 dark:text-foreground" />
            </div>
            <div>
              <div className="text-white dark:text-foreground">University Bookstore</div>
              <div className="text-indigo-300 dark:text-muted-foreground">Admin Portal</div>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Link
              to="/admin/dashboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/dashboard')
                  ? 'bg-indigo-800 text-white dark:bg-muted dark:text-foreground'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/books"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/books')
                  ? 'bg-indigo-800 text-white dark:bg-muted dark:text-foreground'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Manage Books</span>
            </Link>

            <Link
              to="/admin/publisher-orders"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/publisher-orders')
                  ? 'bg-indigo-800 text-white dark:bg-muted dark:text-foreground'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Publisher Orders</span>
            </Link>

            <Link
              to="/admin/reports"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/reports')
                  ? 'bg-indigo-800 text-white dark:bg-muted dark:text-foreground'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Reports</span>
            </Link>
          </div>

          {/* User Info & Theme & Logout */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex flex-col items-end leading-tight">
              <span className="text-white dark:text-foreground">{user.username}</span>
              <span className="text-indigo-300 dark:text-muted-foreground">Administrator</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-indigo-200 hover:text-white hover:bg-red-600 dark:text-muted-foreground dark:hover:bg-destructive/20 dark:hover:text-foreground rounded-lg transition-colors"
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
