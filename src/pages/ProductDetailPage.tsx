import React, { useState, useEffect, useContext } from 'react';
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

// Import CartContext (we'll create this next)
import { CartContext } from '../context/CartContext';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  
  // Get cart context
  const { addToCart } = useContext(CartContext);
  
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

  // Set default size when product changes
  useEffect(() => {
    if (product?.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[2]); // Default to size 42 (index 2)
    } else {
      setSelectedSize(null);
    }
    setSizeError(false);
  }, [product]);

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
    // Check if size is selected for footwear
    if (product.category === 'footwear' && !selectedSize) {
      setSizeError(true);
      return;
    }
    
    // In a real app, this would dispatch to a state management system
    console.log(`Added ${quantity} of ${product.name} to cart`);
    
    // Add to cart context
    addToCart({
      id: Date.now(), // Generate a unique ID for the cart item
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      brand: product.brand,
      size: selectedSize
    });
    
    setAddedToCart(true);
    
    // Reset the "Added" confirmation after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleQuickBuy = () => {
    // Check if size is selected for footwear
    if (product.category === 'footwear' && !selectedSize) {
      setSizeError(true);
      return;
    }
    
    // Add to cart and redirect to checkout
    handleAddToCart();
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
                {product.price.toLocaleString()} MAD
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

                {/* Size selector for footwear */}
                {product.category === 'footwear' && product.sizes && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium text-luxury-black">Size</div>
                      <button 
                        onClick={toggleSizeGuide}
                        className="text-xs text-luxury-gold underline"
                      >
                        Size Guide
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          className={`w-12 h-10 border ${
                            selectedSize === size 
                              ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-black' 
                              : 'border-gray-300 hover:border-gray-400 text-luxury-gray'
                          }`}
                          onClick={() => {
                            setSelectedSize(size);
                            setSizeError(false);
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {sizeError && (
                      <div className="mt-2 text-sm text-red-500">
                        Please select a size
                      </div>
                    )}
                  </div>
                )}

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
                        {relatedProduct.price.toLocaleString()} MAD
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
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2">EU Size</th>
                      <th className="border border-gray-300 px-4 py-2">UK Size</th>
                      <th className="border border-gray-300 px-4 py-2">US Size</th>
                      <th className="border border-gray-300 px-4 py-2">Foot Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-center">40</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">6.5</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">7.5</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">25.5</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-center">41</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">7</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">8</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">26.2</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-center">42</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">8</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">9</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">26.8</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-center">43</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">9</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">10</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">27.5</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-center">44</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">10</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">11</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">28.2</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 text-center">45</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">10.5</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">11.5</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">28.8</td>
                    </tr>
                  </tbody>
                </table>
                <p className="mt-4 text-luxury-gray text-sm">
                  To find your perfect size, measure your foot length and compare it with the chart above. If you are between sizes, we recommend going up to the larger size.
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