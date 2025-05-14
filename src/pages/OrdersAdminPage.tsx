import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Order, OrderItem } from '../lib/orderService';
import { Helmet } from 'react-helmet-async';

interface OrderWithItems extends Order {
  items?: OrderItem[];
  isExpanded?: boolean;
}

const OrdersAdminPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Exchange rate (static for demo purposes)
  const MADtoUSDRate = 0.1; // 1 MAD = 0.1 USD (example rate)
  
  // Format price to USD
  const formatToUSD = (priceInMAD: number): string => {
    const priceInUSD = priceInMAD * MADtoUSDRate;
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(priceInUSD);
  };
  
  // Toggle order expansion to show items
  const toggleOrderExpansion = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, isExpanded: !order.isExpanded } 
          : order
      )
    );
  };

  // Fetch all orders with their items
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        return;
      }
      
      // Fetch order items for all orders
      const orderIds = ordersData.map(order => order.id);
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);
      
      if (itemsError) throw itemsError;
      
      // Combine orders with their items
      const ordersWithItems: OrderWithItems[] = ordersData.map(order => {
        const orderItems = itemsData?.filter(item => item.order_id === order.id) || [];
        return {
          ...order,
          items: orderItems,
          isExpanded: false
        };
      });
      
      setOrders(ordersWithItems);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchOrders();
    
    // Subscribe to changes in the orders table
    const ordersSubscription = supabase
      .channel('orders-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        payload => {
          console.log('Orders table changed:', payload);
          fetchOrders(); // Refetch all orders when any change occurs
        }
      )
      .subscribe();
    
    // Subscribe to changes in the order_items table
    const orderItemsSubscription = supabase
      .channel('order-items-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'order_items' }, 
        payload => {
          console.log('Order items table changed:', payload);
          fetchOrders(); // Refetch all orders when any change occurs
        }
      )
      .subscribe();
    
    // Cleanup subscriptions on component unmount
    return () => {
      ordersSubscription.unsubscribe();
      orderItemsSubscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-luxury-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-red-50 rounded-lg shadow-md my-8">
        <h2 className="text-xl font-bold text-red-700 mb-4">Error</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Orders Admin | Luxe Maroc</title>
      </Helmet>
      
      <div className="mb-12 text-center py-8">
        <h1 className="text-5xl font-serif font-bold mb-4 text-luxury-black">Orders Dashboard</h1>
        <div className="w-24 h-1 bg-luxury-gold mx-auto mb-6"></div>
        <p className="text-gray-600 text-xl max-w-3xl mx-auto">View and manage all orders and their items</p>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-medium text-gray-600">No Orders Found</h2>
          <p className="mt-2 text-gray-500">When customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-luxury-cream">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-bold text-luxury-black uppercase tracking-wider">Order ID</th>
                  <th className="px-8 py-5 text-center text-sm font-bold text-luxury-black uppercase tracking-wider w-1/3">Customer Info</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-luxury-black uppercase tracking-wider">Date</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-luxury-black uppercase tracking-wider">Total (MAD)</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-luxury-black uppercase tracking-wider">Total (USD)</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-luxury-black uppercase tracking-wider">Status</th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-luxury-black uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id.substring(0, 8)}...
                      </td>
                      <td className="px-8 py-7">
                        <div className="p-4 bg-luxury-cream bg-opacity-30 rounded-lg border border-luxury-cream">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-luxury-gold bg-opacity-20 flex items-center justify-center text-luxury-gold border-2 border-luxury-gold">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="text-xl font-bold text-luxury-black mb-2">{order.customer_name}</div>
                              <div className="space-y-3">
                                <div className="flex items-center px-3 py-2 bg-white rounded-md shadow-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  <span className="font-medium">{order.phone}</span>
                                </div>
                                <div className="flex items-start px-3 py-3 bg-white rounded-md shadow-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  <div className="font-medium break-words whitespace-normal" style={{ maxWidth: '300px', wordBreak: 'break-word' }}>{order.address}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {order.total_amount.toLocaleString()} MAD
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatToUSD(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 text-sm font-medium rounded-full shadow-sm ${
                          order.payment_status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : order.payment_status === 'cancelled' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {order.isExpanded ? 'Hide Items' : 'View Items'}
                        </button>
                      </td>
                    </tr>
                    
                    {order.isExpanded && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price (MAD)</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price (USD)</th>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {order.items && order.items.length > 0 ? (
                                  order.items.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                      <td className="px-4 py-3">
                                        <div className="flex items-center">
                                          {item.image && (
                                            <img 
                                              src={item.image} 
                                              alt={item.name} 
                                              className="w-10 h-10 object-cover rounded mr-3"
                                            />
                                          )}
                                          <div>
                                            <p className="font-medium">{item.name}</p>
                                            {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                                            <p className="text-xs text-gray-500">Product ID: {item.product_id}</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-sm">{item.quantity}</td>
                                      <td className="px-4 py-3 text-sm">{item.price.toLocaleString()} MAD</td>
                                      <td className="px-4 py-3 text-sm">{formatToUSD(item.price)}</td>
                                      <td className="px-4 py-3 text-sm font-medium">
                                        {(item.price * item.quantity).toLocaleString()} MAD
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={5} className="px-4 py-3 text-sm text-center text-gray-500">
                                      No items found for this order
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAdminPage;
