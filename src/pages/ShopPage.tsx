import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';

// Import products data (in a real app, this would come from an API)
import { products } from '../data/products';

const ShopPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filters, setFilters] = useState({
    category: category || 'all',
    priceRange: 'all',
    sortBy: 'newest',
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Update filtered products when filters change
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (filters.category !== 'all') {
      result = result.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase());
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
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value="all"
                        checked={filters.category === 'all'}
                        onChange={() => handleFilterChange('category', 'all')}
                        className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                      />
                      <span className="ml-2 text-luxury-gray">All Products</span>
                    </label>
                    {['Handbags', 'Accessories', 'Wallets', 'Collections'].map(cat => (
                      <label key={cat} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={cat.toLowerCase()}
                          checked={filters.category === cat.toLowerCase()}
                          onChange={() => handleFilterChange('category', cat.toLowerCase())}
                          className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                        />
                        <span className="ml-2 text-luxury-gray">{cat}</span>
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
                      { label: 'Under $1,000', value: '0-1000' },
                      { label: '$1,000 - $2,000', value: '1000-2000' },
                      { label: '$2,000 - $5,000', value: '2000-5000' },
                      { label: 'Over $5,000', value: '5000-' },
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
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="mobile-category"
                        value="all"
                        checked={filters.category === 'all'}
                        onChange={() => handleFilterChange('category', 'all')}
                        className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                      />
                      <span className="ml-2 text-luxury-gray">All Products</span>
                    </label>
                    {['Handbags', 'Accessories', 'Wallets', 'Collections'].map(cat => (
                      <label key={cat} className="flex items-center">
                        <input
                          type="radio"
                          name="mobile-category"
                          value={cat.toLowerCase()}
                          checked={filters.category === cat.toLowerCase()}
                          onChange={() => handleFilterChange('category', cat.toLowerCase())}
                          className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                        />
                        <span className="ml-2 text-luxury-gray">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-luxury-black mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="mobile-priceRange"
                        value="all"
                        checked={filters.priceRange === 'all'}
                        onChange={() => handleFilterChange('priceRange', 'all')}
                        className="h-4 w-4 border-luxury-gray text-luxury-gold focus:ring-luxury-gold"
                      />
                      <span className="ml-2 text-luxury-gray">All Prices</span>
                    </label>
                    {[
                      { label: 'Under $1,000', value: '0-1000' },
                      { label: '$1,000 - $2,000', value: '1000-2000' },
                      { label: '$2,000 - $5,000', value: '2000-5000' },
                      { label: 'Over $5,000', value: '5000-' },
                    ].map(range => (
                      <label key={range.value} className="flex items-center">
                        <input
                          type="radio"
                          name="mobile-priceRange"
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
                
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={toggleMobileFilters}
                    className="btn btn-primary w-full"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-grow">
              {/* Sort By Dropdown */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-luxury-gray">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
                
                <div className="relative">
                  <div className="flex items-center border border-luxury-gray px-3 py-2">
                    <label htmlFor="sortBy" className="text-sm text-luxury-gray mr-2">
                      Sort by:
                    </label>
                    <select
                      id="sortBy"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="appearance-none bg-transparent text-luxury-black focus:outline-none pr-8"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Products */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-luxury-gray text-lg">No products found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group product-card-hover"
                    >
                      <a href={`/product/${product.id}`} className="block">
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
                          <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="btn btn-gold w-full text-sm py-2">
                              Quick View
                            </button>
                          </div>
                        </div>
                        <h3 className="font-serif text-luxury-black text-lg mb-1">{product.name}</h3>
                        <p className="text-luxury-gold font-medium">${product.price.toLocaleString()}</p>
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopPage;