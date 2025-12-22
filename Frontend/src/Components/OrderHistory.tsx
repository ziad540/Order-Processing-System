import { Package } from 'lucide-react';
import CustomerNavbar from './CustomerNavbar';
import { User } from '../App';
import { mockOrders } from '../data/mockData';

interface OrderHistoryProps {
  user: User;
  onLogout: () => void;
}

export default function OrderHistory({ user, onLogout }: OrderHistoryProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNavbar user={user} onLogout={onLogout} />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">View your past orders</p>
        </div>

        {mockOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {mockOrders.map(order => (
              <div key={order.orderNumber} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <div>
                        <p className="text-gray-500 mb-1">Order Number</p>
                        <p className="text-gray-900">{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Order Date</p>
                        <p className="text-gray-900">{new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Total</p>
                        <p className="text-gray-900">${order.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full ${
                        order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <h3 className="text-gray-900 mb-4">Books Ordered</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-gray-700">ISBN</th>
                          <th className="px-4 py-3 text-left text-gray-700">Title</th>
                          <th className="px-4 py-3 text-center text-gray-700">Quantity</th>
                          <th className="px-4 py-3 text-right text-gray-700">Price</th>
                          <th className="px-4 py-3 text-right text-gray-700">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map(item => (
                          <tr key={item.isbn} className="border-b border-gray-100">
                            <td className="px-4 py-3 text-gray-600">{item.isbn}</td>
                            <td className="px-4 py-3 text-gray-900">{item.title}</td>
                            <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-right text-gray-600">${item.price.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
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
