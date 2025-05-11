import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { products, brands, categories } from '../data/products';
import { X, ChevronDown, ChevronUp, Filter, Grid, List } from 'lucide-react';

interface SearchResult {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  brand?: string;
  type: 'product';
}

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBrand, setActiveBrand] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [brandExpanded, setBrandExpanded] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Category filters
  const categoryFilters = [
    { id: 'all', name: 'All Products' },
    ...categories.filter(cat => cat.id !== 'all')
  ];

  // Brand filters
  const brandFilters = [
    { id: 'all', name: 'All Brands' },
    ...brands.filter(brand => brand.id !== 'all')
  ];

  useEffect(() => {
    if (query) {
      // Simulate loading state
      setLoading(true);
      
      // Search for products after a short delay (simulating API call)
      setTimeout(() => {
        const normalizedQuery = query.toLowerCase().trim();
        
        const matchedProducts = products
          .filter(product => 
            product.name.toLowerCase().includes(normalizedQuery) ||
            (product.brand && product.brand.toLowerCase().includes(normalizedQuery)) ||
            product.category.toLowerCase().includes(normalizedQuery) ||
            product.description.toLowerCase().includes(normalizedQuery)
          )
          .map(product => ({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            category: product.category,
            brand: product.brand,
            type: 'product' as const
          }));
        
        setResults(matchedProducts);
        setLoading(false);
      }, 500);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  // Apply filters
  const filteredResults = results
    .filter(result => activeCategory === 'all' || result.category === activeCategory)
    .filter(result => activeBrand === 'all' || result.brand === activeBrand);

  // Toggle mobile filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  // Handle brand selection
  const handleBrandChange = (brandId: string) => {
    setActiveBrand(brandId);
  };

  // Reset all filters
  const resetFilters = () => {
    setActiveCategory('all');
    setActiveBrand('all');
  };

  // Get brand name from ID
  const getBrandName = (brandId: string | undefined) => {
    if (!brandId) return null;
    return brands.find(b => b.id === brandId)?.name || brandId;
  };

  return (
    <>
      <Helmet>
        <title>{query ? `Results for "${query}"` : 'Search'} | Luxe Maroc</title>
      </Helmet>

      <section className="bg-white py-6 border-b border-gray-200">
        <div className="container text-center">
          <h1 className="text-2xl md:text-3xl font-serif text-luxury-black">
            {query ? `Results for "${query}"` : 'Search'}
          </h1>
          <p className="text-luxury-gray mt-2">
            {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            {/* Mobile filter toggle */}
            <button 
              className="md:hidden flex items-center text-luxury-black"
              onClick={toggleFilters}
            >
              <Filter size={18} className="mr-2" />
              Filters {showFilters ? 'Hide' : 'Show'}
            </button>

            {/* View toggle */}
            <div className="ml-auto flex border border-gray-200">
              <button 
                className={`p-2 ${view === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
                onClick={() => setView('grid')}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button 
                className={`p-2 ${view === 'list' ? 'bg-gray-100' : 'bg-white'}`}
                onClick={() => setView('list')}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Filters sidebar - desktop always visible, mobile toggleable */}
            <AnimatePresence>
              {(showFilters || window.innerWidth >= 768) && (
                <motion.aside 
                  className="w-full md:w-64 md:mr-8 mb-6 md:mb-0"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-white border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-serif text-luxury-black">Filters</h2>
                      <button 
                        className="text-luxury-gray text-sm underline"
                        onClick={resetFilters}
                      >
                        Reset all
                      </button>
                    </div>

                    {/* Category filter */}
                    <div className="mb-6">
                      <button 
                        className="flex w-full items-center justify-between text-luxury-black font-medium mb-3"
                        onClick={() => setCategoryExpanded(!categoryExpanded)}
                      >
                        <span>Category</span>
                        {categoryExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      
                      <AnimatePresence>
                        {categoryExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-2">
                              {categoryFilters.map(category => (
                                <label 
                                  key={category.id} 
                                  className="flex items-center cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name="category"
                                    checked={activeCategory === category.id}
                                    onChange={() => handleCategoryChange(category.id)}
                                    className="hidden"
                                  />
                                  <div className={`w-4 h-4 border mr-2 flex-shrink-0 transition-colors ${
                                    activeCategory === category.id 
                                      ? 'bg-luxury-gold border-luxury-gold' 
                                      : 'border-gray-300'
                                  }`}>
                                    {activeCategory === category.id && (
                                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
                                        <path
                                          fill="currentColor"
                                          d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="text-luxury-black">
                                    {category.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Brand filter */}
                    <div>
                      <button 
                        className="flex w-full items-center justify-between text-luxury-black font-medium mb-3"
                        onClick={() => setBrandExpanded(!brandExpanded)}
                      >
                        <span>Brand</span>
                        {brandExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      
                      <AnimatePresence>
                        {brandExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {brandFilters.map(brand => (
                                <label 
                                  key={brand.id} 
                                  className="flex items-center cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name="brand"
                                    checked={activeBrand === brand.id}
                                    onChange={() => handleBrandChange(brand.id)}
                                    className="hidden"
                                  />
                                  <div className={`w-4 h-4 border mr-2 flex-shrink-0 transition-colors ${
                                    activeBrand === brand.id 
                                      ? 'bg-luxury-gold border-luxury-gold' 
                                      : 'border-gray-300'
                                  }`}>
                                    {activeBrand === brand.id && (
                                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
                                        <path
                                          fill="currentColor"
                                          d="M9,16.17L4.83,12l-1.42,1.41L9,19 21,7l-1.41-1.41L9,16.17z"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="text-luxury-black">
                                    {brand.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Search results */}
            <div className="flex-1">
              {loading ? (
                // Loading state with LV style loading spinner
                <div className="py-12 text-center">
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-4 border-t-2 border-luxury-gold rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-luxury-gray">Searching...</p>
                </div>
              ) : filteredResults.length > 0 ? (
                // Search results grid
                <div className={view === 'grid' 
                  ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-6"
                }>
                  {filteredResults.map(result => (
                    <motion.div
                      key={result.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className={view === 'grid' ? "group" : "flex border-b border-gray-200 pb-6"}
                    >
                      <Link to={`/product/${result.id}`} className={view === 'grid' ? "block" : "flex flex-row gap-6"}>
                        <div className={view === 'grid' 
                          ? "aspect-square overflow-hidden mb-4" 
                          : "w-40 h-40 flex-shrink-0 overflow-hidden"
                        }>
                          <img 
                            src={result.image} 
                            alt={result.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        
                        <div className={view === 'list' ? "flex-1" : ""}>
                          {/* Brand if available */}
                          {result.brand && (
                            <div className="uppercase text-xs text-luxury-gray tracking-wider mb-1">
                              {getBrandName(result.brand)}
                            </div>
                          )}
                          
                          <h3 className="font-serif text-luxury-black text-lg mb-1 transition-colors group-hover:text-luxury-gold">
                            {result.name}
                          </h3>
                          
                          <p className="text-luxury-gray">{result.price.toLocaleString()} MAD</p>
                          
                          {view === 'list' && (
                            <p className="text-luxury-gray mt-2 line-clamp-2">
                              {products.find(p => p.id === result.id)?.description.substring(0, 120)}...
                            </p>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                // No results
                <div className="py-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <X size={32} className="text-luxury-gray" />
                  </div>
                  <p className="text-luxury-gray mb-4">No results match your search.</p>
                  <p className="text-luxury-gray">Try with a different term or browse our collections.</p>
                  <div className="mt-8">
                    <Link to="/shop" className="btn btn-primary">
                      Browse our collections
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchResultsPage;