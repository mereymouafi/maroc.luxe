import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';

// Import products data and QuickViewModal
import { products, categories, brands, Product } from '../data/products';
import QuickViewModal from '../components/common/QuickViewModal';

const ShopPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({
    category: category || 'all',
    brand: 'all',
    priceRange: 'all',
    sortBy: 'newest',
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Quick View Modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Open Quick View Modal
  const handleQuickView = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
      setIsQuickViewOpen(true);
    }
  };

  // Close Quick View Modal
  const closeQuickView = () => {
    setIsQuickViewOpen(false);
  };

  // Update filtered products when filters change
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase());
    }
    
    // Filter by brand
    if (filters.brand !== 'all') {
      result = result.filter(product => 
        product.brand === filters.brand);
    }
    
    // Filter by price range
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(product => 
        product.price >= min && (max ? product.price <= max : true));
    }
    
    // Sort products
    if (filters.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    // 'newest' is default sorting from the data
    
    setFilteredProducts(result);
  }, [filters, category]);

  // Update category filter when URL param changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: category || 'all'
    }));
  }, [category]);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  // Get page title based on category
  const getPageTitle = () => {
    if (!category) return 'Shop All';
    
    // Check if it's a category
    const categoryMatch = categories.find(cat => cat.id === category);
    if (categoryMatch) return categoryMatch.name;
    
    // Check if it's a brand
    const brandMatch = brands.find(brand => brand.id === category);
    if (brandMatch) return brandMatch.name;
    
    // Default formatting for URL parameter
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()} | Luxe Maroc</title>
        <meta name="description" content={`Shop our luxury ${category || 'products'} collection at Luxe Maroc.`} />
      </Helmet>

      {/* Page Header */}
      <section className="bg-luxury-cream py-12">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-serif text-luxury-black text-center">{getPageTitle()}</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container">
          <div className="flex flex-col lg:flex-row">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0 pr-8">
              <div className="sticky top-24">
                <h3 className="text-xl font-serif text-luxury-black mb-6">Filters</h3>
                
                {/* Category Filter */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-luxury-black mb-3">Category</h4>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <label key={cat.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={cat.id}
                          checked={filters.category === cat.id}
                          onChange={() => handleFilterChange('category', cat.id)}
                          className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                        />
                        <span className="ml-2 text-luxury-gray">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Brand Filter */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-luxury-black mb-3">Brand</h4>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <label key={brand.id} className="flex items-center">
                        <input
                          type="radio"
                          name="brand"
                          value={brand.id}
                          checked={filters.brand === brand.id}
                          onChange={() => handleFilterChange('brand', brand.id)}
                          className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                        />
                        <span className="ml-2 text-luxury-gray">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-luxury-black mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value="all"
                        checked={filters.priceRange === 'all'}
                        onChange={() => handleFilterChange('priceRange', 'all')}
                        className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                      />
                      <span className="ml-2 text-luxury-gray">All Prices</span>
                    </label>
                    {[
                      { label: 'Under 1,000 MAD', value: '0-1000' },
                      { label: '1,000 - 2,000 MAD', value: '1000-2000' },
                      { label: '2,000 - 5,000 MAD', value: '2000-5000' },
                      { label: 'Over 5,000 MAD', value: '5000-' },
                    ].map(range => (
                      <label key={range.value} className="flex items-center">
                        <input
                          type="radio"
                          name="priceRange"
                          value={range.value}
                          checked={filters.priceRange === range.value}
                          onChange={() => handleFilterChange('priceRange', range.value)}
                          className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                        />
                        <span className="ml-2 text-luxury-gray">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filters Button */}
            <div className="lg:hidden mb-6">
              <button
                onClick={toggleMobileFilters}
                className="flex items-center justify-center w-full py-2 border border-luxury-gray text-luxury-black"
              >
                <Filter size={18} className="mr-2" />
                Filters
              </button>
            </div>

            {/* Mobile Filters Sidebar */}
            <div
              className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ${
                mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'
              } lg:hidden`}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-serif text-luxury-black">Filters</h3>
                <button
                  onClick={toggleMobileFilters}
                  className="text-luxury-gray p-1"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
                {/* Category Filter */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-luxury-black mb-3">Category</h4>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <label key={cat.id} className="flex items-center">
                        <input
                          type="radio"
                          name="category-mobile"
                          value={cat.id}
                          checked={filters.category === cat.id}
                          onChange={() => handleFilterChange('category', cat.id)}
                          className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                        />
                        <span className="ml-2 text-luxury-gray">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Brand Filter */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-luxury-black mb-3">Brand</h4>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <label key={brand.id} className="flex items-center">
                        <input
                          type="radio"
                          name="brand-mobile"
                          value={brand.id}
                          checked={filters.brand === brand.id}
                          onChange={() => handleFilterChange('brand', brand.id)}
                          className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                        />
                        <span className="ml-2 text-luxury-gray">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-luxury-black mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange-mobile"
                        value="all"
                        checked={filters.priceRange === 'all'}
                        onChange={() => handleFilterChange('priceRange', 'all')}
                        className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                      />
                      <span className="ml-2 text-luxury-gray">All Prices</span>
                    </label>
                    {[
                      { label: 'Under 1,000 MAD', value: '0-1000' },
                      { label: '1,000 - 2,000 MAD', value: '1000-2000' },
                      { label: '2,000 - 5,000 MAD', value: '2000-5000' },
                      { label: 'Over 5,000 MAD', value: '5000-' },
                    ].map(range => (
                      <label key={range.value} className="flex items-center">
                        <input
                          type="radio"
                          name="priceRange-mobile"
                          value={range.value}
                          checked={filters.priceRange === range.value}
                          onChange={() => handleFilterChange('priceRange', range.value)}
                          className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                        />
                        <span className="ml-2 text-luxury-gray">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    className="flex-1 py-2 border border-luxury-black bg-luxury-black text-white"
                    onClick={() => {
                      setFilters({
                        category: 'all',
                        brand: 'all',
                        priceRange: 'all',
                        sortBy: 'newest',
                      });
                      toggleMobileFilters();
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="flex-1 py-2 border border-luxury-gold bg-luxury-gold text-luxury-black"
                    onClick={toggleMobileFilters}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort Options */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-luxury-gray">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>

                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="appearance-none border border-luxury-gray pl-4 pr-10 py-2 bg-transparent focus:outline-none focus:border-luxury-gold"
                  >
                    <option value="newest">Sort by: Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-luxury-gray" />
                </div>
              </div>

              {/* Products */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 border border-gray-200">
                  <p className="text-luxury-gray">No products found matching your filters.</p>
                  <button 
                    className="text-luxury-gold hover:underline mt-2"
                    onClick={() => setFilters({
                      category: 'all',
                      brand: 'all',
                      priceRange: 'all',
                      sortBy: 'newest',
                    })}
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="group product-card-hover"
                    >
                      <div className="relative">
                        <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden mb-4">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button 
                              className="btn btn-gold w-full text-sm py-2"
                              onClick={(e) => {
                                e.preventDefault();
                                handleQuickView(product.id);
                              }}
                            >
                              Quick View
                            </button>
                          </div>
                        </Link>
                        {product.isNew && (
                          <div className="absolute top-2 left-2 bg-luxury-gold px-2 py-1 text-xs text-luxury-black font-medium">
                            New
                          </div>
                        )}
                        {product.isBestSeller && (
                          <div className="absolute top-2 left-2 bg-luxury-black px-2 py-1 text-xs text-white font-medium">
                            Best Seller
                          </div>
                        )}
                      </div>
                      
                      {/* Display brand if available */}
                      {product.brand && (
                        <div className="uppercase text-xs text-luxury-gray tracking-wider mb-1">
                          {brands.find(b => b.id === product.brand)?.name}
                        </div>
                      )}
                      
                      <h3 className="font-serif text-luxury-black text-lg mb-1">{product.name}</h3>
                      <p className="text-luxury-gold font-medium">{product.price.toLocaleString()} MAD</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </>
  );
};

export default ShopPage;