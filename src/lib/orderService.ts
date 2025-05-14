import { supabase } from './supabase';
import type { Database } from './database.types';

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

/**
 * Creates a new order in the database
 */
export const createOrder = async (order: OrderInsert): Promise<{ data: Order | null, error: any }> => {
  const { data, error } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single();
  
  return { data, error };
};

/**
 * Creates order items linked to an order
 */
export const createOrderItems = async (items: OrderItemInsert[]): Promise<{ data: OrderItem[] | null, error: any }> => {
  console.log('Creating order items with data:', JSON.stringify(items, null, 2));
  
  try {
    // Ensure all fields are properly formatted for Supabase
    const formattedItems = items.map(item => ({
      ...item,
      order_id: item.order_id, // Ensure UUID format
      product_id: typeof item.product_id === 'string' ? parseInt(item.product_id) : item.product_id, // Ensure integer
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price, // Ensure number
      quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity, // Ensure integer
    }));

    console.log('Formatted items for insert:', JSON.stringify(formattedItems, null, 2));
    
    // Insert items in batches to avoid potential size limitations
    // Process 10 items at a time
    const batchSize = 10;
    const results: OrderItem[] = [];
    let hasError = null;
    
    for (let i = 0; i < formattedItems.length; i += batchSize) {
      const batch = formattedItems.slice(i, i + batchSize);
      console.log(`Processing batch ${i/batchSize + 1}, size: ${batch.length}`);
      
      const { data, error } = await supabase
        .from('order_items')
        .insert(batch)
        .select();
      
      if (error) {
        console.error(`Error in batch ${i/batchSize + 1}:`, error);
        hasError = error;
        break;
      } else {
        console.log(`Batch ${i/batchSize + 1} successful, items:`, data?.length);
        if (data) results.push(...data);
      }
    }
    
    if (hasError) {
      return { data: null, error: hasError };
    }
    
    console.log('All order items created successfully, total:', results.length);
    return { data: results, error: null };
  } catch (e) {
    console.error('Exception creating order items:', e);
    return { data: null, error: e };
  }
};

/**
 * Gets an order by ID including all its items
 */
export const getOrderWithItems = async (orderId: string): Promise<{ 
  order: Order | null, 
  items: OrderItem[] | null, 
  error: any 
}> => {
  // Get order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  
  if (orderError) {
    return { order: null, items: null, error: orderError };
  }
  
  // Get order items
  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);
  
  return { 
    order, 
    items, 
    error: itemsError 
  };
};

/**
 * Updates order payment status
 */
export const updateOrderStatus = async (
  orderId: string, 
  status: 'pending' | 'paid' | 'cancelled'
): Promise<{ success: boolean, error: any }> => {
  const { error } = await supabase
    .from('orders')
    .update({ 
      payment_status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);
  
  return { 
    success: !error, 
    error 
  };
};

/**
 * Get all orders with optional filtering
 */
export const getOrders = async (
  options?: { 
    status?: string, 
    limit?: number, 
    offset?: number 
  }
): Promise<{ 
  data: Order[] | null, 
  count: number | null, 
  error: any 
}> => {
  const { status, limit = 10, offset = 0 } = options || {};
  
  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' });
  
  if (status) {
    query = query.eq('payment_status', status);
  }
  
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  return { data, count, error };
};
