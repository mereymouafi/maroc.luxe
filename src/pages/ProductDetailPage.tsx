import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronRight, Minus, Plus, Heart, ShoppingBag, Share2 } from 'lucide-react';

// Import products data
import { products, Product } from '../data/products';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Find the product by ID
    const productId = parseInt(id || '0');
    const foundProduct = products.find(p => p.id === productId) || null;
    
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.image);
      
      // Find related products (same category, excluding current product)
      const related = products
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      
      setRelatedProducts(related);
    }
    
    // Scroll to top when product changes
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-luxury-gray">Product not found.</p>
        <Link to="/shop" className="btn btn-primary mt-4">
          Return to Shop
        </Link>
      </div>
    );
  }

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

      {/* Product Details */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Images */}
            <div>
              <div className="aspect-square overflow-hidden mb-4">
                <motion.img 
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={selectedImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square overflow-hidden border-2 ${selectedImage === img ? 'border-luxury-gold' : 'border-transparent'}`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-luxury-black mb-3">{product.name}</h1>
              <p className="text-2xl text-luxury-gold font-medium mb-6">${product.price.toLocaleString()}</p>
              
              <div className="mb-8">
                <p className="text-luxury-gray mb-6">{product.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex">
                    <span className="w-32 text-luxury-black font-medium">Color:</span>
                    <span className="text-luxury-gray">{product.color}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-luxury-black font-medium">Dimensions:</span>
                    <span className="text-luxury-gray">{product.dimensions}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-luxury-black font-medium">Material:</span>
                    <span className="text-luxury-gray">{product.material}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-luxury-black font-medium">Made in:</span>
                    <span className="text-luxury-gray">{product.madeIn}</span>
                  </div>
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="border border-luxury-gray flex items-center mr-4">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      className="px-3 py-2 text-luxury-black"
                      disabled={quantity <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-10 text-center">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      className="px-3 py-2 text-luxury-black"
                      disabled={quantity >= 10}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <button className="btn btn-primary flex-grow">
                    <ShoppingBag size={18} className="mr-2" />
                    Add to Bag
                  </button>
                </div>
                
                <div className="flex space-x-4">
                  <button className="btn btn-secondary flex-1">
                    <Heart size={18} className="mr-2" />
                    Add to Wishlist
                  </button>
                  <button className="btn btn-secondary flex-1">
                    <Share2 size={18} className="mr-2" />
                    Share
                  </button>
                </div>
              </div>
              
              {/* Shipping Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-luxury-black font-medium mb-3">Shipping & Returns</h3>
                <p className="text-luxury-gray text-sm mb-2">
                  Free standard shipping on all orders over $200.
                </p>
                <p className="text-luxury-gray text-sm">
                  Returns accepted within 14 days of delivery. See our <Link to="/returns" className="text-luxury-gold hover:underline">return policy</Link> for details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-12 bg-luxury-cream">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-serif text-luxury-black mb-6 text-center">Product Details</h2>
            
            <div className="bg-white p-8">
              <h3 className="text-xl font-serif text-luxury-black mb-4">Description</h3>
              <p className="text-luxury-gray mb-6">
                {product.description}
              </p>
              
              <h3 className="text-xl font-serif text-luxury-black mb-4">Materials & Care</h3>
              <p className="text-luxury-gray mb-4">
                Crafted from {product.material.toLowerCase()}, this exquisite piece represents the pinnacle of luxury craftsmanship. Each item is meticulously created by our skilled artisans in {product.madeIn}.
              </p>
              <p className="text-luxury-gray mb-4">
                To maintain its beauty and quality, we recommend:
              </p>
              <ul className="list-disc pl-5 text-luxury-gray space-y-2 mb-6">
                <li>Store in the provided dust bag when not in use</li>
                <li>Avoid exposure to direct sunlight, heat, moisture, and abrasive surfaces</li>
                <li>Clean with a soft, dry cloth</li>
                <li>For specific stains, consult a professional leather cleaner</li>
              </ul>
              
              <h3 className="text-xl font-serif text-luxury-black mb-4">Dimensions</h3>
              <p className="text-luxury-gray">
                {product.dimensions}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-serif text-luxury-black text-center mb-10">You May Also Like</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group product-card-hover"
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden mb-4">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {product.isNew && (
                        <div className="absolute top-3 left-3 bg-luxury-gold text-luxury-black px-3 py-1 text-xs font-medium">
                          New
                        </div>
                      )}
                    </div>
                    <h3 className="font-serif text-luxury-black text-lg mb-1">{product.name}</h3>
                    <p className="text-luxury-gold font-medium">${product.price.toLocaleString()}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetailPage;