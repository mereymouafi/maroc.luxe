import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Minus, Plus, Share, Heart, Check, ShoppingBag, ChevronRight, X } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import products data (in a real app, this would come from an API)
import { products, brands } from '../data/products';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Find the product
  const product = products.find(p => p.id === parseInt(id || '0'));
  
  // Get brand name if available
  const brandName = product?.brand ? 
    brands.find(b => b.id === product.brand)?.name : null;
  
  // Redirect if product not found
  useEffect(() => {
    if (!product && id) {
      navigate('/not-found');
    }
  }, [product, id, navigate]);

  if (!product) {
    return null;
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // In a real app, this would dispatch to a state management system
    console.log(`Added ${quantity} of ${product.name} to cart`);
    setAddedToCart(true);
    
    // Reset the "Added" confirmation after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleQuickBuy = () => {
    // In a real app, this would add to cart and redirect to checkout
    console.log(`Quick buy ${quantity} of ${product.name}`);
    navigate('/cart');
  };

  const toggleSizeGuide = () => {
    setShowSizeGuide(!showSizeGuide);
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Luxe Maroc</title>
        <meta name="description" content={product.description.substring(0, 160)} />
      </Helmet>

      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-3">
        <div className="container">
          <div className="flex items-center text-sm text-luxury-gray">
            <Link to="/" className="hover:text-luxury-gold transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/shop" className="hover:text-luxury-gold transition-colors">Shop</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to={`/shop/${product.category}`} className="hover:text-luxury-gold transition-colors capitalize">
              {product.category}
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-luxury-black font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="relative">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="product-swiper"
                  onSlideChange={(swiper) => setSelectedImage(swiper.activeIndex)}
                >
                  {product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="aspect-square">
                        <img 
                          src={image} 
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Product status badges */}
                <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                  {product.isNew && (
                    <div className="bg-luxury-gold px-3 py-1 text-xs text-luxury-black font-medium">
                      New
                    </div>
                  )}
                  {product.isBestSeller && (
                    <div className="bg-luxury-black px-3 py-1 text-xs text-white font-medium">
                      Best Seller
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail previews */}
              <div className="flex space-x-2 mt-4">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 ${
                      selectedImage === index ? 'border-luxury-gold' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              {/* Brand if available */}
              {brandName && (
                <div className="text-sm text-luxury-gray uppercase tracking-wider mb-2">
                  {brandName}
                </div>
              )}
              
              <h1 className="text-3xl font-serif text-luxury-black mb-4">
                {product.name}
              </h1>
              
              <div className="text-xl text-luxury-gold font-medium mb-6">
                ${product.price.toLocaleString()}
              </div>

              <div className="mb-8">
                <p className="text-luxury-gray mb-4">
                  {product.description}
                </p>
              </div>

              <div className="space-y-6 mb-8">
                {/* Color */}
                <div>
                  <div className="text-sm font-medium text-luxury-black mb-2">Color: {product.color}</div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className={`w-8 h-8 rounded-full border-2 border-luxury-gold flex items-center justify-center`}
                      style={{ backgroundColor: product.color.toLowerCase() === 'black' ? '#000' : 
                                               product.color.toLowerCase() === 'white' ? '#fff' :
                                               product.color.toLowerCase() === 'cream' ? '#f5f5dc' :
                                               product.color.toLowerCase() === 'burgundy' ? '#800020' :
                                               product.color.toLowerCase() === 'navy blue' ? '#000080' :
                                               product.color.toLowerCase() === 'brown' ? '#964B00' :
                                               product.color.toLowerCase() === 'tan' ? '#D2B48C' :
                                               product.color.toLowerCase() === 'gold' ? '#FFD700' :
                                               product.color.toLowerCase() === 'dark blue' ? '#00008B' :
                                               product.color.toLowerCase() === 'medium blue' ? '#0000CD' :
                                               '#ccc' }}
                    >
                      {product.color.toLowerCase() !== 'black' && product.color.toLowerCase() !== 'burgundy' && 
                       product.color.toLowerCase() !== 'navy blue' && (
                        <Check size={16} className="text-luxury-black" />
                      )}
                      {(product.color.toLowerCase() === 'black' || product.color.toLowerCase() === 'burgundy' || 
                        product.color.toLowerCase() === 'navy blue') && (
                        <Check size={16} className="text-white" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Product Features */}
                <div className="space-y-2">
                  <div className="flex">
                    <div className="w-24 text-sm text-luxury-gray">Material:</div>
                    <div className="text-sm">{product.material}</div>
                  </div>
                  <div className="flex">
                    <div className="w-24 text-sm text-luxury-gray">Dimensions:</div>
                    <div className="text-sm">{product.dimensions}</div>
                  </div>
                  <div className="flex">
                    <div className="w-24 text-sm text-luxury-gray">Made in:</div>
                    <div className="text-sm">{product.madeIn}</div>
                  </div>
                </div>
              </div>
              
              {/* Quantity selector */}
              <div className="mb-6">
                <div className="text-sm font-medium text-luxury-black mb-2">Quantity</div>
                <div className="flex items-center border border-luxury-gray inline-block">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="px-4 py-2 text-luxury-black focus:outline-none"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 border-x border-luxury-gray">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="px-4 py-2 text-luxury-black focus:outline-none"
                    disabled={quantity >= 10}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart & Buy Now buttons */}
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-6 flex items-center justify-center focus:outline-none transition-colors duration-300 ${
                    addedToCart 
                      ? 'bg-green-600 text-white' 
                      : 'bg-luxury-black text-white hover:bg-luxury-black/90'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check size={20} className="mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} className="mr-2" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleQuickBuy}
                  className="flex-1 py-3 px-6 bg-luxury-gold text-luxury-black hover:bg-luxury-gold/90 focus:outline-none transition-colors duration-300"
                >
                  Quick Buy
                </button>
              </div>

              {/* Wishlist and Share */}
              <div className="flex space-x-6 mb-8">
                <button className="flex items-center text-luxury-gray hover:text-luxury-black">
                  <Heart size={18} className="mr-2" />
                  <span className="text-sm">Add to Wishlist</span>
                </button>
                <button className="flex items-center text-luxury-gray hover:text-luxury-black">
                  <Share size={18} className="mr-2" />
                  <span className="text-sm">Share</span>
                </button>
              </div>

              {/* Tabbed content */}
              <div className="border-t border-b border-luxury-gray py-6">
                <div className="flex border-b">
                  <button
                    className={`py-2 px-4 text-sm font-medium relative ${
                      activeTab === 'description' 
                        ? 'text-luxury-black' 
                        : 'text-luxury-gray hover:text-luxury-black'
                    }`}
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                    {activeTab === 'description' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold"
                      />
                    )}
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium relative ${
                      activeTab === 'shipping' 
                        ? 'text-luxury-black' 
                        : 'text-luxury-gray hover:text-luxury-black'
                    }`}
                    onClick={() => setActiveTab('shipping')}
                  >
                    Shipping & Returns
                    {activeTab === 'shipping' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold"
                      />
                    )}
                  </button>
                  <button
                    className={`py-2 px-4 text-sm font-medium relative ${
                      activeTab === 'care' 
                        ? 'text-luxury-black' 
                        : 'text-luxury-gray hover:text-luxury-black'
                    }`}
                    onClick={() => setActiveTab('care')}
                  >
                    Care Instructions
                    {activeTab === 'care' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold"
                      />
                    )}
                  </button>
                </div>
                
                <div className="pt-4">
                  {activeTab === 'description' && (
                    <div className="text-luxury-gray">
                      <p>{product.description}</p>
                      <p className="mt-2">
                        Each {product.name.toLowerCase()} is crafted with care and attention to detail, 
                        ensuring a product of exceptional quality and durability.
                      </p>
                    </div>
                  )}
                  
                  {activeTab === 'shipping' && (
                    <div className="text-luxury-gray">
                      <p>Free standard shipping on all orders over $300.</p>
                      <p className="mt-2">Delivery typically takes 3-5 business days depending on your location.</p>
                      <p className="mt-2">Returns accepted within 14 days of delivery for unused items in original packaging.</p>
                    </div>
                  )}
                  
                  {activeTab === 'care' && (
                    <div className="text-luxury-gray">
                      <p>To maintain the beauty of your {product.name.toLowerCase()}, we recommend:</p>
                      <ul className="list-disc pl-4 mt-2 space-y-1">
                        <li>Store in the provided dust bag when not in use</li>
                        <li>Avoid exposure to direct sunlight and moisture</li>
                        <li>Clean with a soft, dry cloth</li>
                        <li>For leather items, apply a leather conditioner every 6 months</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-serif text-luxury-black mb-8">You May Also Like</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter(p => 
                  p.id !== product.id && 
                  (p.category === product.category || p.brand === product.brand)
                )
                .slice(0, 4)
                .map(relatedProduct => (
                  <div key={relatedProduct.id} className="group product-card-hover">
                    <Link to={`/product/${relatedProduct.id}`} className="block">
                      <div className="relative aspect-square overflow-hidden mb-4">
                        <img 
                          src={relatedProduct.image} 
                          alt={relatedProduct.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="btn btn-gold w-full text-sm py-2">
                            Quick View
                          </button>
                        </div>
                      </div>
                      
                      {/* Brand if available */}
                      {relatedProduct.brand && (
                        <div className="uppercase text-xs text-luxury-gray tracking-wider mb-1">
                          {brands.find(b => b.id === relatedProduct.brand)?.name}
                        </div>
                      )}
                      
                      <h3 className="font-serif text-luxury-black text-lg mb-1 truncate">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-luxury-gold font-medium">
                        ${relatedProduct.price.toLocaleString()}
                      </p>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleSizeGuide}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white p-6 max-w-2xl w-full">
              <button
                onClick={toggleSizeGuide}
                className="absolute top-4 right-4 text-luxury-gray hover:text-luxury-black"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-serif text-luxury-black mb-4">Size Guide</h2>
              <div className="mt-4">
                {/* Size guide content would go here */}
                <p className="text-luxury-gray">
                  This would contain specific sizing information for the product.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;