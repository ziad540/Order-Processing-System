import { BookOpen, Package, TrendingUp, AlertCircle } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import { User, Book } from '../App';
import { bookService } from '../services/bookService';
import { useEffect, useState } from 'react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.searchBooks('', 'All');
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch books for dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const totalBooks = books.length;
  const totalInventory = books.reduce((sum, book) => sum + book.stockLevel, 0);
  const lowStockBooks = books.filter(book => book.stockLevel <= (book.threshold || 0)).length;
  const totalValue = books.reduce((sum, book) => sum + (book.sellingPrice * book.stockLevel), 0);

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
        <div className="grid grid-cols-1 lg:grid-cols-1">
          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-gray-900 mb-6">Low Stock Alert</h2>
            <div className="space-y-4">
              <div className="space-y-4">
                {books
                  .filter(book => book.stockLevel <= (book.threshold || 0))
                  .slice(0, 5)
                  .map(book => (
                    <div key={book.ISBN} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex-1">
                        <p className="text-gray-900">{book.title}</p>
                        <p className="text-gray-600">ISBN: {book.ISBN}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-amber-700">{book.stockLevel} left</p>
                        <p className="text-gray-500">Threshold: {book.threshold}</p>
                      </div>
                    </div>
                  ))}
                {!loading && books.filter(book => book.stockLevel <= (book.threshold || 0)).length === 0 && (
                  <p className="text-gray-500 text-center py-4">All books are well stocked</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h2 className="text-gray-900 mb-6">Books by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Science', 'Art', 'Religion', 'History', 'Geography','Fiction','Technology'].map(category => {
              const count = books.filter(book => book.category === category).length;
              const quantity = books
                .filter(book => book.category === category)
                .reduce((sum, book) => sum + book.stockLevel, 0);
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
