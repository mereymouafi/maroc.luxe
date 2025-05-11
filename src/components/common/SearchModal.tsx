import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ArrowRight, Loader } from 'lucide-react';
import { products, categories, brands } from '../../data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchSuggestion {
  type: 'product' | 'category' | 'brand';
  id: number | string;
  name: string;
  image?: string;
  price?: number;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [instantResults, setInstantResults] = useState<SearchSuggestion[]>([]);
  const [matchedBrand, setMatchedBrand] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches).slice(0, 4));
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length >= 1) {
      setIsSearching(true);
      
      // Debounce the search for better performance
      const timer = setTimeout(() => {
        getSuggestions(query);
        getInstantResults(query);
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setInstantResults([]);
      setMatchedBrand(null);
      setIsSearching(false);
    }
  };

  // Generate suggestions based on search query
  const getSuggestions = (query: string) => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Filter products
    const productSuggestions = products
      .filter(product => 
        product.name.toLowerCase().includes(normalizedQuery) || 
        (product.brand && product.brand.toLowerCase().includes(normalizedQuery)) ||
        product.category.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 4)
      .map(product => ({
        type: 'product' as const,
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price
      }));
    
    // Filter categories
    const categorySuggestions = categories
      .filter(category => 
        category.name.toLowerCase().includes(normalizedQuery) &&
        category.id !== 'all'
      )
      .slice(0, 2)
      .map(category => ({
        type: 'category' as const,
        id: category.id,
        name: category.name
      }));
    
    // Filter brands
    const brandSuggestions = brands
      .filter(brand => 
        brand.name.toLowerCase().includes(normalizedQuery) ||
        brand.id.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 2)
      .map(brand => ({
        type: 'brand' as const,
        id: brand.id,
        name: brand.name
      }));
    
    // Combine suggestions with products first
    setSuggestions([
      ...productSuggestions,
      ...categorySuggestions,
      ...brandSuggestions
    ]);
  };

  // Get comprehensive instant results as user types
  const getInstantResults = (query: string) => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check if query matches any brand name or ID
    const matchedBrandObj = brands.find(
      brand => brand.name.toLowerCase().includes(normalizedQuery) || 
               brand.id.toLowerCase().includes(normalizedQuery)
    );
    
    if (matchedBrandObj) {
      setMatchedBrand(matchedBrandObj.name);
      
      // Get all products from this brand
      const brandProducts = products
        .filter(product => product.brand === matchedBrandObj.id)
        .map(product => ({
          type: 'product' as const,
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price
        }));
      
      setInstantResults(brandProducts);
    } else {
      setMatchedBrand(null);
      
      // Get all products matching the query
      const matchingProducts = products
        .filter(product => 
          product.name.toLowerCase().includes(normalizedQuery) || 
          product.description.toLowerCase().includes(normalizedQuery) ||
          product.category.toLowerCase().includes(normalizedQuery)
        )
        .map(product => ({
          type: 'product' as const,
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price
        }));
      
      setInstantResults(matchingProducts);
    }
  };

  // Handle search submission
  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (searchQuery.trim()) {
      // Save to recent searches
      const updatedSearches = [
        searchQuery,
        ...recentSearches.filter(search => search !== searchQuery)
      ].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      
      // Navigate to search results
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      onClose();
      setSearchQuery('');
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    switch (suggestion.type) {
      case 'product':
        navigate(`/product/${suggestion.id}`);
        break;
      case 'category':
        navigate(`/shop/${suggestion.id}`);
        break;
      case 'brand':
        navigate(`/shop/${suggestion.id}`);
        break;
    }
    onClose();
    setSearchQuery('');
  };

  // Handle recent search click
  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    navigate(`/search?q=${encodeURIComponent(search)}`);
    onClose();
  };

  // Handle search icon click when there's a query
  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      handleSearch();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full bg-white shadow-xl"
          >
            <div className="container mx-auto max-w-screen-xl">
              {/* Search input and buttons */}
              <div className="py-8 border-b border-gray-200 relative">
                <div className="flex items-center px-4 md:px-0">
                  <form onSubmit={handleSearch} className="flex-1 flex items-center relative">
                    <div className="w-10 h-10 flex items-center justify-center">
                      {isSearching ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader size={20} className="text-luxury-gray" />
                        </motion.div>
                      ) : (
                        <Search 
                          size={20} 
                          className="text-luxury-gray cursor-pointer"
                          onClick={handleSearchIconClick}
                        />
                      )}
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                      placeholder="What are you looking for?"
                      className="w-full py-2 px-2 text-xl md:text-2xl font-light text-luxury-black focus:outline-none placeholder-luxury-gray"
                      autoComplete="off"
                    />
                  </form>
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close search"
                  >
                    <X size={20} className="text-luxury-black" />
                  </button>
                </div>
              </div>

              {/* Search suggestions and results */}
              <div className="py-8 px-4 md:px-0 overflow-y-auto max-h-[70vh]">
                {/* Recent searches - only show when no query */}
                {searchQuery.trim() === '' && recentSearches.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-10"
                  >
                    <h3 className="text-sm text-luxury-gray uppercase tracking-wider mb-4">Recent Searches</h3>
                    <div className="space-y-4">
                      {recentSearches.map((search, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          onClick={() => handleRecentSearchClick(search)}
                          className="block text-lg text-luxury-black hover:text-luxury-gold transition-colors"
                        >
                          {search}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Trending searches */}
                {searchQuery.trim() === '' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="mb-10"
                  >
                    <h3 className="text-sm text-luxury-gray uppercase tracking-wider mb-4">Trending Now</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Luxury Bags', 'Designer Shoes', 'Summer Collection', 'Premium Accessories'].map((item, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          onClick={() => handleRecentSearchClick(item)}
                          className="bg-gray-50 hover:bg-gray-100 p-4 text-center transition-colors"
                        >
                          {item}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Instant results when typing */}
                {searchQuery.trim() !== '' && (
                  <AnimatePresence mode="wait">
                    {isSearching ? (
                      <motion.div 
                        key="searching"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-12 flex justify-center"
                      >
                        <div className="text-luxury-gray text-center">
                          <div className="inline-block mb-4">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Loader size={24} className="text-luxury-gold" />
                            </motion.div>
                          </div>
                          <p>Searching...</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {/* Brand matched heading */}
                        {matchedBrand && instantResults.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-xl font-serif text-luxury-black mb-4">
                              {matchedBrand} Products
                            </h3>
                          </div>
                        )}

                        {/* Show instant results */}
                        {instantResults.length > 0 ? (
                          <div className="mb-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                              {instantResults.map((result, index) => (
                                <motion.div
                                  key={`instant-${result.id}-${index}`}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.4, delay: index * 0.05 }}
                                  className="group cursor-pointer"
                                  onClick={() => handleSuggestionClick(result)}
                                >
                                  {result.image && (
                                    <div className="aspect-square overflow-hidden mb-3">
                                      <motion.img 
                                        src={result.image} 
                                        alt={result.name} 
                                        className="w-full h-full object-cover transition-transform duration-700"
                                        whileHover={{ scale: 1.05 }}
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-serif text-luxury-black group-hover:text-luxury-gold transition-colors">
                                      {result.name}
                                    </p>
                                    {result.price && (
                                      <p className="text-luxury-gray mt-1">
                                        {result.price.toLocaleString()} MAD
                                      </p>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        ) : searchQuery.trim().length > 1 && (
                          <div className="text-luxury-gray text-center py-8">
                            <p>No results for "{searchQuery}"</p>
                            <p className="mt-2 text-sm">Try checking your spelling or use more general terms</p>
                          </div>
                        )}

                        {/* If we have more results than shown, show button */}
                        {instantResults.length > 0 && (
                          <div className="mt-8 text-center">
                            <button
                              onClick={handleSearch}
                              className="btn btn-primary inline-flex items-center"
                            >
                              View all results <ArrowRight size={16} className="ml-2" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal; 