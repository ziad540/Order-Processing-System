import { useState } from 'react';
import { CheckCircle, Clock, Package } from 'lucide-react';
import AdminNavbar from './AdminNavbar';
import { User } from '../App';
import { mockPublisherOrders as initialOrders } from '../data/mockData';

interface AdminPublisherOrdersProps {
  user: User;
  onLogout: () => void | Promise<void>;
}

export default function PublisherOrders({ user, onLogout }: AdminPublisherOrdersProps) {
  const [orders, setOrders] = useState(initialOrders);

  const handleConfirmOrder = (orderId: string) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: 'Confirmed' as const } : order
    ));
  };

  const pendingOrders = orders.filter(order => order.status === 'Pending');
  const confirmedOrders = orders.filter(order => order.status === 'Confirmed');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminNavbar user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Publisher Orders</h1>
          <p className="text-muted-foreground">Manage orders placed to book publishers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-muted rounded-lg">
                <Package className="w-6 h-6 text-blue-600 dark:text-foreground" />
              </div>
            </div>
            <h3 className="text-muted-foreground mb-1">Total Orders</h3>
            <p className="text-foreground">{orders.length}</p>
          </div>

          <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-muted rounded-lg">
                <Clock className="w-6 h-6 text-amber-600 dark:text-foreground" />
              </div>
            </div>
            <h3 className="text-muted-foreground mb-1">Pending Orders</h3>
            <p className="text-foreground">{pendingOrders.length}</p>
          </div>

          <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-muted rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-foreground" />
              </div>
            </div>
            <h3 className="text-muted-foreground mb-1">Confirmed Orders</h3>
            <p className="text-foreground">{confirmedOrders.length}</p>
          </div>
        </div>

        {/* Pending Orders */}
        {pendingOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-foreground mb-4">Pending Orders</h2>
            <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-amber-50 border-b border-amber-200 dark:bg-muted dark:border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-muted-foreground">Order ID</th>
                      <th className="px-6 py-3 text-left text-muted-foreground">Publisher</th>
                      <th className="px-6 py-3 text-left text-muted-foreground">ISBN</th>
                      <th className="px-6 py-3 text-left text-muted-foreground">Book Title</th>
                      <th className="px-6 py-3 text-center text-muted-foreground">Quantity</th>
                      <th className="px-6 py-3 text-left text-muted-foreground">Order Date</th>
                      <th className="px-6 py-3 text-center text-muted-foreground">Status</th>
                      <th className="px-6 py-3 text-center text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrders.map(order => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted">
                        <td className="px-6 py-4 text-foreground">{order.id}</td>
                        <td className="px-6 py-4 text-muted-foreground">{order.publisherName}</td>
                        <td className="px-6 py-4 text-muted-foreground">{order.isbn}</td>
                        <td className="px-6 py-4 text-foreground">{order.bookTitle}</td>
                        <td className="px-6 py-4 text-center text-foreground">{order.quantity}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(order.orderDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 dark:bg-muted dark:text-foreground rounded-full">
                            <Clock className="w-4 h-4 inline mr-1" />
                            Pending
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleConfirmOrder(order.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 transition-colors"
                          >
                            Confirm Order
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Confirmed Orders */}
        {confirmedOrders.length > 0 && (
          <div>
            <h2 className="text-foreground mb-4">Confirmed Orders</h2>
            <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50 border-b border-green-200 dark:bg-muted dark:border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-muted-foreground">Order ID</th>
                      <th className="px-6 py-3 text-left text-muted-foreground">Publisher</th>
                      <th className="px-6 py-3 text-left text-muted-foreground">ISBN</th>
                      <th className="px-6 py-3 text-left text-muted-foreground">Book Title</th>
                      <th className="px-6 py-3 text-center text-muted-foreground">Quantity</th>
                      <th className="px-6 py-3 text-left text-muted-foreground">Order Date</th>
                      <th className="px-6 py-3 text-center text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedOrders.map(order => (
                      <tr key={order.id} className="border-b border-border hover:bg-muted">
                        <td className="px-6 py-4 text-foreground">{order.id}</td>
                        <td className="px-6 py-4 text-muted-foreground">{order.publisherName}</td>
                        <td className="px-6 py-4 text-muted-foreground">{order.isbn}</td>
                        <td className="px-6 py-4 text-foreground">{order.bookTitle}</td>
                        <td className="px-6 py-4 text-center text-foreground">{order.quantity}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(order.orderDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 dark:bg-muted dark:text-foreground rounded-full">
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-foreground mb-2">No Publisher Orders</h2>
            <p className="text-muted-foreground">Publisher orders will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
