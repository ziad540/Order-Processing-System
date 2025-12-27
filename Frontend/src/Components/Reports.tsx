import { useState } from 'react';
import { Calendar, TrendingUp, Users, BookOpen, Search } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import { User } from '../App';

interface AdminReportsProps {
  user: User;
  onLogout: () => void;
}

export default function Reports({ user, onLogout }: AdminReportsProps) {
  const [selectedDate, setSelectedDate] = useState('2024-12-15');
  const [searchIsbn, setSearchIsbn] = useState('');

  // Mock data for reports
  const totalSalesLastMonth = 15234.50;
  const salesOnSelectedDate = 1250.75;

  const topCustomers = [
    { rank: 1, name: 'Alice Johnson', email: 'alice.j@university.edu', totalSpent: 1250.99, orders: 8 },
    { rank: 2, name: 'Bob Smith', email: 'bob.smith@university.edu', totalSpent: 1100.50, orders: 7 },
    { rank: 3, name: 'Carol Davis', email: 'carol.d@university.edu', totalSpent: 950.25, orders: 6 },
    { rank: 4, name: 'David Wilson', email: 'david.w@university.edu', totalSpent: 875.00, orders: 5 },
    { rank: 5, name: 'Emma Brown', email: 'emma.b@university.edu', totalSpent: 820.75, orders: 5 }
  ];

  const topSellingBooks = [
    { rank: 1, ISBN: '978-0-451-52493-5', title: 'Sapiens: A Brief History of Humankind', unitsSold: 145, revenue: 3333.55 },
    { rank: 2, ISBN: '978-0-134-68599-1', title: 'Introduction to Algorithms', unitsSold: 98, revenue: 8819.02 },
    { rank: 3, ISBN: '978-0-13-468599-0', title: 'Database System Concepts', unitsSold: 87, revenue: 6959.13 },
    { rank: 4, ISBN: '978-0-262-03384-8', title: 'Artificial Intelligence: A Modern Approach', unitsSold: 76, revenue: 7219.24 },
    { rank: 5, ISBN: '978-1-118-06333-0', title: 'Clean Code', unitsSold: 72, revenue: 3599.28 },
    { rank: 6, ISBN: '978-0-691-14267-2', title: 'Guns, Germs, and Steel', unitsSold: 65, revenue: 1819.35 },
    { rank: 7, ISBN: '978-0-465-02414-8', title: 'The Renaissance: A Short History', unitsSold: 58, revenue: 1449.42 },
    { rank: 8, ISBN: '978-0-13-235088-4', title: 'Operating System Concepts', unitsSold: 52, revenue: 4419.48 },
    { rank: 9, ISBN: '978-0-500-28638-0', title: 'Art: The Definitive Visual Guide', unitsSold: 48, revenue: 2207.52 },
    { rank: 10, ISBN: '978-0-142-00047-6', title: 'The Art Spirit', unitsSold: 45, revenue: 854.55 }
  ];

  const publisherOrderCount = searchIsbn ? 12 : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminNavbar user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">View sales reports and performance metrics</p>
        </div>

        {/* Sales Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Sales Last Month */}
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-muted rounded-lg">
                <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-foreground" />
              </div>
            </div>
            <h2 className="text-foreground mb-2">Total Sales Last Month</h2>
            <p className="text-muted-foreground mb-4">November 2024</p>
            <p className="text-foreground">${totalSalesLastMonth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>

          {/* Sales on Selected Date */}
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-muted rounded-lg">
                <Calendar className="w-6 h-6 text-green-600 dark:text-foreground" />
              </div>
            </div>
            <h2 className="text-foreground mb-2">Sales on Selected Date</h2>
            <div className="mb-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <p className="text-foreground">${salesOnSelectedDate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* Top 5 Customers */}
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-muted rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-foreground" />
            </div>
            <div>
              <h2 className="text-foreground">Top 5 Customers</h2>
              <p className="text-muted-foreground">Last 3 months</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-muted-foreground">Rank</th>
                  <th className="px-6 py-3 text-left text-muted-foreground">Customer Name</th>
                  <th className="px-6 py-3 text-left text-muted-foreground">Email</th>
                  <th className="px-6 py-3 text-center text-muted-foreground">Total Orders</th>
                  <th className="px-6 py-3 text-right text-muted-foreground">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map(customer => (
                  <tr key={customer.rank} className="border-b border-border hover:bg-muted">
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-700 dark:bg-muted dark:text-foreground rounded-full">
                        {customer.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{customer.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{customer.email}</td>
                    <td className="px-6 py-4 text-center text-foreground">{customer.orders}</td>
                    <td className="px-6 py-4 text-right text-foreground">
                      ${customer.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 10 Selling Books */}
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-amber-100 dark:bg-muted rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600 dark:text-foreground" />
            </div>
            <div>
              <h2 className="text-foreground">Top 10 Selling Books</h2>
              <p className="text-muted-foreground">Last 3 months</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-muted-foreground">Rank</th>
                  <th className="px-6 py-3 text-left text-muted-foreground">ISBN</th>
                  <th className="px-6 py-3 text-left text-muted-foreground">Title</th>
                  <th className="px-6 py-3 text-center text-muted-foreground">Units Sold</th>
                  <th className="px-6 py-3 text-right text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSellingBooks.map(book => (
                  <tr key={book.rank} className="border-b border-border hover:bg-muted">
                    <td className="px-6 py-4">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${book.rank <= 3 ? 'bg-amber-100 text-amber-700 dark:bg-muted dark:text-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                        {book.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{book.ISBN}</td>
                    <td className="px-6 py-4 text-foreground">{book.title}</td>
                    <td className="px-6 py-4 text-center text-foreground">{book.unitsSold}</td>
                    <td className="px-6 py-4 text-right text-foreground">
                      ${book.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Publisher Order Count by ISBN */}
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-muted rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-foreground" />
            </div>
            <div>
              <h2 className="text-foreground">Publisher Order Count</h2>
              <p className="text-muted-foreground">Check how many times a book was ordered from publishers</p>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="isbnSearch" className="block text-muted-foreground mb-2">
              Enter ISBN to Search
            </label>
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                id="isbnSearch"
                type="text"
                value={searchIsbn}
                onChange={(e) => setSearchIsbn(e.target.value)}
                placeholder="e.g., 978-0-134-68599-1"
                className="w-full pl-10 pr-3 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {searchIsbn && (
            <div className="bg-blue-50 border border-blue-200 dark:bg-muted dark:border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground mb-1">ISBN: {searchIsbn}</p>
                  <p className="text-muted-foreground">Times Ordered from Publishers</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-900 dark:text-primary">{publisherOrderCount} times</p>
                </div>
              </div>
            </div>
          )}

          {!searchIsbn && (
            <div className="text-center py-8 text-muted-foreground">
              Enter an ISBN to see how many times it was ordered from publishers
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
