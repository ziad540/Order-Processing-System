import { BookOpen, Package, TrendingUp, AlertCircle } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import { User } from '../App';
import { mockBooks } from '../data/mockData';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const totalBooks = mockBooks.length;
  const totalInventory = mockBooks.reduce((sum, book) => sum + book.quantity, 0);
  const lowStockBooks = mockBooks.filter(book => book.quantity <= book.threshold).length;
  const totalValue = mockBooks.reduce((sum, book) => sum + (book.price * book.quantity), 0);

  const recentActivity = [
    { action: 'New book added', details: 'Introduction to Algorithms', time: '2 hours ago' },
    { action: 'Stock updated', details: 'Database System Concepts - 30 units added', time: '5 hours ago' },
    { action: 'Publisher order confirmed', details: 'Order #PO-003 from Addison-Wesley', time: '1 day ago' },
    { action: 'Low stock alert', details: 'The Art of Computer Programming below threshold', time: '2 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your bookstore operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-gray-500 mb-1">Total Books</h3>
            <p className="text-gray-900">{totalBooks}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-gray-500 mb-1">Total Inventory</h3>
            <p className="text-gray-900">{totalInventory} units</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <h3 className="text-gray-500 mb-1">Low Stock Items</h3>
            <p className="text-gray-900">{lowStockBooks} books</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-gray-500 mb-1">Inventory Value</h3>
            <p className="text-gray-900">${totalValue.toFixed(2)}</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">Low Stock Alert</h2>
            <div className="space-y-4">
              {mockBooks
                .filter(book => book.quantity <= book.threshold)
                .slice(0, 5)
                .map(book => (
                  <div key={book.isbn} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex-1">
                      <p className="text-gray-900">{book.title}</p>
                      <p className="text-gray-600">ISBN: {book.isbn}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-700">{book.quantity} left</p>
                      <p className="text-gray-500">Threshold: {book.threshold}</p>
                    </div>
                  </div>
                ))}
              {mockBooks.filter(book => book.quantity <= book.threshold).length === 0 && (
                <p className="text-gray-500 text-center py-4">All books are well stocked</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-center w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.action}</p>
                    <p className="text-gray-600">{activity.details}</p>
                    <p className="text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-gray-900 mb-6">Books by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Science', 'Art', 'Religion', 'History', 'Geography'].map(category => {
              const count = mockBooks.filter(book => book.category === category).length;
              const quantity = mockBooks
                .filter(book => book.category === category)
                .reduce((sum, book) => sum + book.quantity, 0);
              return (
                <div key={category} className="bg-gray-50 rounded-lg p-4 text-center">
                  <h3 className="text-gray-900 mb-2">{category}</h3>
                  <p className="text-gray-600">{count} titles</p>
                  <p className="text-gray-500">{quantity} units</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
