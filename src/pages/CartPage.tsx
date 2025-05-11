import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, X, CreditCard, ShoppingBag, Check } from 'lucide-react';

// Import brands data
import { brands } from '../data/products';

// For demo purposes - in a real app this would be managed by a state management library
const initialCartItems = [
  {
    id: 1,
    productId: 1,
    name: "Classic Tote Bag",
    price: 1950,
    quantity: 1,
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
    brand: "louis-vuitton"
  },
  {
    id: 2,
    productId: 5,
    name: "Luxury Leather Wallet",
    price: 650,
    quantity: 1,
    image: "https://images.pexels.com/photos/2252360/pexels-photo-2252360.jpeg",
    brand: "gucci" 
  },
  {
    id: 3,
    productId: 21,
    name: "ZEGNA TRIPLE STITCH",
    price: 2400,
    quantity: 1,
    image: "https://images.pexels.com/photos/19090/pexels-photo.jpg",
    brand: "zegna"
  }
];

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 25; // Free shipping over $1000
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

  // Simulate checkout process
  const handleCheckout = () => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      // In a real app, you would redirect to order confirmation page
      alert('Payment processed successfully!');
    }, 2000);
  };

  // Get brand name function
  const getBrandName = (brandId: string | undefined) => {
    if (!brandId) return null;
    return brands.find(b => b.id === brandId)?.name;
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
                <div className="bg-white p-6 border border-gray-200 mb-6">
                  <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm text-luxury-gray">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>

                  {cartItems.map(item => (
                    <div key={item.id} className="py-6 border-b border-gray-200 last:border-b-0">
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
                            {/* Brand display */}
                            {item.brand && (
                              <div className="text-xs text-luxury-gray uppercase tracking-wider mb-1">
                                {getBrandName(item.brand)}
                              </div>
                            )}
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
                </div>

                {/* Continue Shopping & Promo Code */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <Link to="/shop" className="text-luxury-gold hover:underline flex items-center">
                    <X size={16} className="transform rotate-45 mr-2" />
                    Continue Shopping
                  </Link>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="w-full sm:w-64 border border-luxury-gray px-4 py-2 focus:outline-none focus:border-luxury-gold"
                      />
                      {promoError && (
                        <div className="text-red-500 text-xs mt-1">{promoError}</div>
                      )}
                      {promoSuccess && (
                        <div className="flex items-center text-green-600 text-xs mt-1">
                          <Check size={12} className="mr-1" />
                          {promoSuccess}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-luxury-black text-white hover:bg-luxury-black/90 focus:outline-none transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4">
                <div className="bg-white p-6 border border-gray-200 sticky top-24">
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
                      <div className="flex justify-between">
                        <span className="text-luxury-gray">Discount</span>
                        <span className="text-green-600">-${discount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between font-medium">
                        <span className="text-luxury-black">Total</span>
                        <span className="text-luxury-gold">${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-luxury-black mb-3">Payment Method</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-luxury-gray rounded-sm cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                        />
                        <span className="ml-2">Credit Card</span>
                        <div className="ml-auto flex space-x-1">
                          <div className="w-6 h-4 bg-blue-600 rounded"></div>
                          <div className="w-6 h-4 bg-red-500 rounded"></div>
                          <div className="w-6 h-4 bg-gray-800 rounded"></div>
                        </div>
                      </label>

                      <label className="flex items-center p-3 border border-luxury-gray rounded-sm cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                          className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                        />
                        <span className="ml-2">PayPal</span>
                        <div className="ml-auto">
                          <div className="w-12 h-4 bg-blue-700 rounded"></div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessingPayment || cartItems.length === 0}
                    className={`w-full py-3 flex items-center justify-center focus:outline-none transition-colors ${
                      isProcessingPayment || cartItems.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90'
                    }`}
                  >
                    {isProcessingPayment ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-luxury-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <CreditCard size={20} className="mr-2" />
                        Proceed to Checkout
                      </>
                    )}
                  </button>
                  
                  <p className="text-xs text-center text-luxury-gray mt-4">
                    By completing your purchase, you agree to our{' '}
                    <Link to="/terms" className="text-luxury-gold hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-luxury-gold hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
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