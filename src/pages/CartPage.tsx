import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, X, CreditCard, ShoppingBag } from 'lucide-react';

// For demo purposes - in a real app this would be managed by a state management library
const initialCartItems = [
  {
    id: 1,
    productId: 1,
    name: "Classic Tote Bag",
    price: 1950,
    quantity: 1,
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg"
  },
  {
    id: 2,
    productId: 5,
    name: "Luxury Leather Wallet",
    price: 650,
    quantity: 1,
    image: "https://images.pexels.com/photos/2252360/pexels-photo-2252360.jpeg"
  }
];

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 200 ? 0 : 25;
  const discount = promoSuccess ? Math.round(subtotal * 0.1) : 0; // 10% discount
  const total = subtotal + shipping - discount;

  // Update item quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code.');
      return;
    }
    
    // For demo purposes, accept "LUXE10" as valid code
    if (promoCode.toUpperCase() === 'LUXE10') {
      setPromoSuccess('10% discount applied!');
      setPromoError(null);
    } else {
      setPromoError('Invalid promo code. Please try again.');
      setPromoSuccess(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Your Shopping Bag | Luxe Maroc</title>
      </Helmet>

      {/* Page Header */}
      <section className="bg-luxury-cream py-12">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-serif text-luxury-black text-center">Your Shopping Bag</h1>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <ShoppingBag size={32} className="text-luxury-gray" />
              </div>
              <h2 className="text-2xl font-serif text-luxury-black mb-4">Your shopping bag is empty</h2>
              <p className="text-luxury-gray mb-6">Browse our collection and discover our luxury products.</p>
              <Link to="/shop" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-8">
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm text-luxury-gray">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {cartItems.map(item => (
                  <div key={item.id} className="py-6 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Product */}
                      <div className="col-span-6 flex items-center space-x-4">
                        <Link to={`/product/${item.productId}`} className="w-24 h-24 flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div>
                          <Link 
                            to={`/product/${item.productId}`} 
                            className="text-luxury-black hover:text-luxury-gold transition-colors font-medium"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center text-sm text-luxury-gray hover:text-luxury-gold transition-colors mt-2"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="md:col-span-2 flex justify-between md:justify-center">
                        <span className="md:hidden">Price:</span>
                        <span className="text-luxury-black">${item.price.toLocaleString()}</span>
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                        <span className="md:hidden">Quantity:</span>
                        <div className="flex items-center border border-luxury-gray">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-luxury-black"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-luxury-black"
                            disabled={item.quantity >= 10}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="md:col-span-2 flex justify-between md:justify-end">
                        <span className="md:hidden">Total:</span>
                        <span className="text-luxury-black font-medium">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link to="/shop" className="text-luxury-gold hover:underline flex items-center">
                    <X size={16} className="transform rotate-45 mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <div className="bg-gray-50 p-6 sticky top-24">
                  <h2 className="text-xl font-serif text-luxury-black mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-luxury-gray">Subtotal</span>
                      <span className="text-luxury-black">${subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-luxury-gray">Shipping</span>
                      <span className="text-luxury-black">
                        {shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-success">
                        <span>Discount</span>
                        <span>-${discount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between font-medium">
                        <span className="text-luxury-black">Total</span>
                        <span className="text-luxury-black">${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Promo Code */}
                  <div className="mb-6">
                    <label htmlFor="promo-code" className="block text-sm font-medium text-luxury-gray mb-2">
                      Promo Code
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="promo-code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="luxury-input flex-grow"
                      />
                      <button 
                        onClick={applyPromoCode}
                        className="btn btn-secondary whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                    
                    {promoError && (
                      <p className="text-error text-sm mt-2">{promoError}</p>
                    )}
                    
                    {promoSuccess && (
                      <p className="text-success text-sm mt-2">{promoSuccess}</p>
                    )}
                  </div>
                  
                  {/* Checkout Button */}
                  <button className="btn btn-primary w-full flex items-center justify-center">
                    <CreditCard size={18} className="mr-2" />
                    Proceed to Checkout
                  </button>
                  
                  {/* Shipping Info */}
                  <p className="text-luxury-gray text-sm mt-4">
                    Free shipping on orders over $200. International delivery available.
                  </p>
                  
                  {/* Payment Methods */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-luxury-gray text-sm mb-2">We accept:</p>
                    <div className="flex space-x-2">
                      <img src="https://www.svgrepo.com/show/328132/visa.svg" alt="Visa" className="h-6 w-auto" />
                      <img src="https://www.svgrepo.com/show/328130/mastercard.svg" alt="Mastercard" className="h-6 w-auto" />
                      <img src="https://www.svgrepo.com/show/328127/paypal.svg" alt="PayPal" className="h-6 w-auto" />
                      <img src="https://www.svgrepo.com/show/328093/american-express.svg" alt="American Express" className="h-6 w-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default CartPage;