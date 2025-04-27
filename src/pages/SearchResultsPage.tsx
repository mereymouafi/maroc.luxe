import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

// Import products data
import { products, Product } from '../data/products';

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q') || '';
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sortBy: 'relevance',
  });

  // Filter products based on search query and filters
  useEffect(() => {
    // First filter by search query
    let results = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Then apply additional filters
    if (filters.category !== 'all') {
      results = results.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase());
    }
    
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      results = results.filter(product => 
        product.price >= min && (max ? product.price <= max : true));
    }
    
    // Sort products
    if (filters.sortBy === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }
    // 'relevance' is default and keeps the original order
    
    setFilteredProducts(results);
  }, [searchQuery, filters]);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <>
      <Helmet>
        <title>Search Results for "{searchQuery}" | Luxe Maroc</title>
      </Helmet>

      {/* Search Header */}
      <section className="bg-luxury-cream py-12">
        <div className="container">
          <h1 className="text-3xl font-serif text-luxury-black text-center mb-6">
            Search Results for "{searchQuery}"
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              defaultValue={searchQuery}
              placeholder="Search again..."
              className="luxury-input pl-12"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const query = (e.target as HTMLInputElement).value;
                  if (query.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                  }
                }
              }}
            />
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-luxury-gray" />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-serif text-luxury-black mb-4">No results found</h2>
              <p className="text-luxury-gray mb-6">
                We couldn't find any products matching your search query "{searchQuery}".
              </p>
              <Link to="/shop" className="btn btn-primary">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-8">
                <p className="text-luxury-gray">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found
                </p>
                
                <div className="flex space-x-4">
                  {/* Category Filter */}
                  <div className="relative">
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="luxury-input pr-10 py-2 appearance-none"
                    >
                      <option value="all">All Categories</option>
                      <option value="handbags">Handbags</option>
                      <option value="accessories">Accessories</option>
                      <option value="wallets">Wallets</option>
                      <option value="collections">Collections</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-luxury-gray" />
                  </div>
                  
                  {/* Price Range Filter */}
                  <div className="relative">
                    <select
                      value={filters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="luxury-input pr-10 py-2 appearance-none"
                    >
                      <option value="all">All Prices</option>
                      <option value="0-1000">Under $1,000</option>
                      <option value="1000-2000">$1,000 - $2,000</option>
                      <option value="2000-5000">$2,000 - $5,000</option>
                      <option value="5000-">Over $5,000</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-luxury-gray" />
                  </div>
                  
                  {/* Sort By Filter */}
                  <div className="relative">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="luxury-input pr-10 py-2 appearance-none"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-luxury-gray" />
                  </div>
                </div>
              </div>
              
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
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
          )}
        </div>
      </section>
    </>
  );
};

export default SearchResultsPage;