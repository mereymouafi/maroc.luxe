import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderWithItems } from '../lib/orderService';
import type { Order, OrderItem } from '../lib/orderService';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }

      try {
        const { order, items, error } = await getOrderWithItems(orderId);
        
        if (error) {
          throw new Error(error.message || 'Failed to load order details');
        }

        if (!order) {
          throw new Error('Order not found');
        }

        setOrder(order);
        setItems(items || []);
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
          <div className="h-64 bg-gray-100 rounded max-w-lg mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-red-700 mb-3">Error</h1>
          <p className="text-red-600 mb-6">{error || 'Could not find order information'}</p>
          <Link to="/" className="inline-block bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-50 p-6 border-b border-green-100">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-center text-gray-600">
            Thank you for your order. Your order has been received and is being processed.
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-3">Order Information</h2>
              <div className="bg-gray-50 p-4 rounded">
                <p className="mb-1"><span className="font-medium">Order ID:</span> {order.id.substring(0, 8)}...</p>
                <p className="mb-1"><span className="font-medium">Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                <p className="mb-1"><span className="font-medium">Payment Method:</span> Cash on Delivery</p>
                <p><span className="font-medium">Status:</span> <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span></p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Shipping Information</h2>
              <div className="bg-gray-50 p-4 rounded">
                <p className="mb-1"><span className="font-medium">Name:</span> {order.customer_name}</p>
                <p className="mb-1"><span className="font-medium">Phone:</span> {order.phone}</p>
                <p><span className="font-medium">Address:</span> {order.address}</p>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
          <div className="border rounded overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded mr-3" />
                        )}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">{item.price.toLocaleString()} MAD</td>
                    <td className="px-4 py-3">{(item.price * item.quantity).toLocaleString()} MAD</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right font-medium">Total</td>
                  <td className="px-4 py-3 font-bold">{order.total_amount.toLocaleString()} MAD</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="text-center">
            <p className="mb-6 text-gray-600">
              A confirmation has been sent to your phone. You'll pay when your order is delivered.
            </p>
            <Link to="/" className="inline-block bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
