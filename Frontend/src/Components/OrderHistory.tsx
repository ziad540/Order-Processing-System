import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import CustomerNavbar from './CustomerNavbar';
import { User } from '../App';
import { reportsService } from '../services/reportsService';

interface OrderHistoryProps {
  user: User;
  onLogout: () => void;
}

export default function OrderHistory({ user, onLogout }: OrderHistoryProps) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await reportsService.getOrderHistory(Number(user.id));
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch order history:', error);
      }
    };
    if (user.id) {
      fetchOrders();
    }
  }, [user.id]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CustomerNavbar user={user} onLogout={onLogout} />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Order History</h1>
          <p className="text-muted-foreground">View your past orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.orderNumber} className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden">
                {/* Order Header */}
                <div className="bg-muted px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <div>
                        <p className="text-muted-foreground mb-1">Order Number</p>
                        <p className="text-foreground">{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Order Date</p>
                        <p className="text-foreground">{new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Total</p>
                        <p className="text-foreground">${order.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-muted dark:text-foreground' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-muted dark:text-foreground' :
                        'bg-red-100 text-red-700 dark:bg-muted dark:text-foreground'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <h3 className="text-foreground mb-4">Books Ordered</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted border-b border-border">
                        <tr>
                          <th className="px-4 py-3 text-left text-muted-foreground">ISBN</th>
                          <th className="px-4 py-3 text-left text-muted-foreground">Title</th>
                          <th className="px-4 py-3 text-center text-muted-foreground">Quantity</th>
                          <th className="px-4 py-3 text-right text-muted-foreground">Price</th>
                          <th className="px-4 py-3 text-right text-muted-foreground">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item: any) => (
                          <tr key={item.isbn} className="border-b border-border">
                            <td className="px-4 py-3 text-muted-foreground">{item.isbn}</td>
                            <td className="px-4 py-3 text-foreground">{item.title}</td>
                            <td className="px-4 py-3 text-center text-muted-foreground">{item.quantity}</td>
                            <td className="px-4 py-3 text-right text-muted-foreground">${item.price.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right text-foreground">${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
