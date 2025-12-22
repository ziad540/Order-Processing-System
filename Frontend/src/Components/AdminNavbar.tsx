import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Package, FileText, BarChart3, LogOut } from 'lucide-react';
import { User } from '../App';

interface AdminNavbarProps {
  user: User;
  onLogout: () => void;
}

export default function AdminNavbar({ user, onLogout }: AdminNavbarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg">
              <BookOpen className="w-6 h-6 text-indigo-900" />
            </div>
            <div>
              <div className="text-white">University Bookstore</div>
              <div className="text-indigo-300">Admin Portal</div>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Link
              to="/admin/dashboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/dashboard')
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/books"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/books')
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Manage Books</span>
            </Link>

            <Link
              to="/admin/publisher-orders"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/publisher-orders')
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Publisher Orders</span>
            </Link>

            <Link
              to="/admin/reports"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin/reports')
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>Reports</span>
            </Link>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white">{user.username}</p>
              <p className="text-indigo-300">Administrator</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-indigo-200 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
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
