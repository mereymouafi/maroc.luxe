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
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [instantResults, setInstantResults] = useState<SearchSuggestion[]>([]);
  const [matchedBrand, setMatchedBrand] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [autoNavigateTimeout, setAutoNavigateTimeout] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }

    // Clear any navigation timeouts when modal closes
    return () => {
      if (autoNavigateTimeout) {
        clearTimeout(autoNavigateTimeout);
      }
    };
  }, [isOpen, autoNavigateTimeout]);

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

    // Clear any existing navigation timeout
    if (autoNavigateTimeout) {
      clearTimeout(autoNavigateTimeout);
    }

    if (query.trim().length >= 1) {
      setIsSearching(true);
      setShowSuggestions(true);
      
      // Debounce the search for better performance
      const timer = setTimeout(() => {
        getSuggestions(query);
        getInstantResults(query);
        getSearchSuggestions(query);
        setIsSearching(false);
      }, 300);
      
      return () => {
        clearTimeout(timer);
        if (autoNavigateTimeout) clearTimeout(autoNavigateTimeout);
      };
    } else {
      setSuggestions([]);
      setSearchSuggestions([]);
      setInstantResults([]);
      setMatchedBrand(null);
      setIsSearching(false);
      setShowSuggestions(false);
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

  // Generate text-based search suggestions based on query
  const getSearchSuggestions = (query: string) => {
    const normalizedQuery = query.toLowerCase().trim();
    if (normalizedQuery.length === 0) {
      setSearchSuggestions([]);
      return;
    }
    
    // Get category matches
    const categoryMatches = categories
      .filter(category => 
        category.id !== 'all' && 
        (category.name.toLowerCase().startsWith(normalizedQuery) ||
         category.name.toLowerCase().includes(normalizedQuery))
      )
      .map(category => category.name);
    
    // Get brand matches
    const brandMatches = brands
      .filter(brand => 
        brand.id !== 'all' && 
        (brand.name.toLowerCase().startsWith(normalizedQuery) ||
         brand.name.toLowerCase().includes(normalizedQuery))
      )
      .map(brand => brand.name);
    
    // Get product name matches (both starts with and contains)
    const productNameMatches = products
      .filter(product => 
        product.name.toLowerCase().startsWith(normalizedQuery) ||
        product.name.toLowerCase().includes(` ${normalizedQuery}`) || // Word boundaries
        product.category.toLowerCase().includes(normalizedQuery) ||
        (product.description && product.description.toLowerCase().includes(normalizedQuery))
      )
      .map(product => product.name);
    
    // Add common search patterns
    let suggestedCompletions = [
      `${normalizedQuery} `
    ];
    
    // Combine all potential suggestions
    const allPotentialSuggestions = [
      ...categoryMatches,
      ...brandMatches, 
      ...productNameMatches,
      ...suggestedCompletions
    ];
    
    // Remove duplicates
    const uniqueSuggestions = Array.from(new Set(allPotentialSuggestions));
    
    // Filter to keep only unique suggestions that are different from the query
    const filteredSuggestions = uniqueSuggestions.filter(suggestion => 
      suggestion.toLowerCase() !== normalizedQuery &&
      suggestion.length > normalizedQuery.length
    );
    
    // Sort by relevance:
    // 1. First, terms that start with the query
    // 2. Then other matches
    // 3. For equal relevance, sort by length (shorter first)
    const sortedSuggestions = filteredSuggestions.sort((a, b) => {
      const aStartsWith = a.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;
      const bStartsWith = b.toLowerCase().startsWith(normalizedQuery) ? 0 : 1;
      
      if (aStartsWith !== bStartsWith) return aStartsWith - bStartsWith;
      return a.length - b.length;
    });
    
    // Take top 5 results
    setSearchSuggestions(sortedSuggestions.slice(0, 5));
  };

  // Improved instant results function to find more matches
  const getInstantResults = (query: string) => {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Check if query matches any brand name or ID
    const matchedBrandObj = brands.find(
      brand => brand.name.toLowerCase().includes(normalizedQuery) || 
               brand.id.toLowerCase().includes(normalizedQuery)
    );
    
    // Get all matching products
    // 1. First priority: Starts with query
    const startsWithProducts = products.filter(product => 
      product.name.toLowerCase().startsWith(normalizedQuery) ||
      product.category.toLowerCase().startsWith(normalizedQuery) ||
      (product.brand && product.brand.toLowerCase().startsWith(normalizedQuery))
    );
    
    // 2. Second priority: Contains query
    const containsProducts = products.filter(product => {
      // Skip if already in startsWithProducts
      if (startsWithProducts.some(p => p.id === product.id)) return false;
      
      return (
        product.name.toLowerCase().includes(normalizedQuery) || 
        product.category.toLowerCase().includes(normalizedQuery) ||
        (product.brand && product.brand.toLowerCase().includes(normalizedQuery)) ||
        product.description.toLowerCase().includes(normalizedQuery)
      );
    });
    
    // Combine results
    const allMatchingProducts = [...startsWithProducts, ...containsProducts];
    
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
      
      setInstantResults(brandProducts.slice(0, 6));
    } else {
      setMatchedBrand(null);
      
      // Get all products matching the query
      const matchingProducts = allMatchingProducts
        .slice(0, 6) // Limit to 6 products for UI display
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

  // Handle search submission (if user presses Enter)
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
    // Clear any auto-navigate timeout when user clicks a suggestion
    if (autoNavigateTimeout) {
      clearTimeout(autoNavigateTimeout);
    }
    
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
    // Clear any auto-navigate timeout when user clicks a recent search
    if (autoNavigateTimeout) {
      clearTimeout(autoNavigateTimeout);
    }
    
    setSearchQuery(search);
    navigate(`/search?q=${encodeURIComponent(search)}`);
    onClose();
  };

  // Handle search icon click when there's a query
  const handleSearchIconClick = () => {
    if (searchQuery.trim()) {
      // Clear any auto-navigate timeout when user clicks search icon
      if (autoNavigateTimeout) {
        clearTimeout(autoNavigateTimeout);
      }
      
      handleSearch();
    }
  };

  // Handle clicking a search suggestion
  const handleSearchSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    getSuggestions(suggestion);
    getInstantResults(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-white overflow-auto"
        >
          <div className="container mx-auto px-4 py-8 relative">
            {/* Close button (X) positioned at top-right */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2"
              aria-label="Close search"
            >
              <X size={18} className="text-black" />
            </button>
            
            {/* Brand Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-normal uppercase tracking-widest">
                {matchedBrand || "MAROC LUXE"}
              </h2>
            </div>

            {/* Search input and buttons */}
            <div className="max-w-xl mx-auto mb-8 relative">
              <form onSubmit={handleSearch} className="relative flex items-center border border-gray-300 rounded-full overflow-hidden">
                <div className="flex-shrink-0 pl-4">
                  {isSearching ? (
                    <Loader size={16} className="text-gray-500" />
                  ) : (
                    <Search size={16} className="text-gray-500" onClick={handleSearchIconClick} />
                  )}
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    setIsFocused(true);
                    if (searchQuery.trim().length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => setTimeout(() => {
                    setIsFocused(false);
                    setShowSuggestions(false);
                  }, 200)}
                  placeholder="Rechercher"
                  className="flex-grow py-2 px-3 text-sm focus:outline-none"
                  autoComplete="off"
                />
                {searchQuery.trim() && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="flex-shrink-0 px-4 py-2 text-xs text-gray-500"
                  >
                    Effacer
                  </button>
                )}
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchQuery.trim() && searchSuggestions.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-100 shadow-lg">
                  {searchSuggestions.map((suggestion, index) => {
                    // Find where the query ends and suggestion begins
                    const queryLower = searchQuery.toLowerCase();
                    const suggestionLower = suggestion.toLowerCase();
                    
                    let displaySuggestion;
                    
                    if (suggestionLower.startsWith(queryLower)) {
                      // Direct completion (e.g. 'jean' -> 'jean homme')
                      displaySuggestion = (
                        <>
                          <span className="font-normal text-black">{searchQuery}</span>
                          <span className="text-gray-500">{suggestion.slice(searchQuery.length)}</span>
                        </>
                      );
                    } else if (suggestionLower.includes(queryLower)) {
                      // Query appears in the middle (less common case)
                      const parts = suggestionLower.split(queryLower);
                      displaySuggestion = (
                        <>
                          <span className="text-gray-500">{parts[0]}</span>
                          <span className="font-normal text-black">{searchQuery}</span>
                          <span className="text-gray-500">{
                            parts.slice(1).join(searchQuery.toLowerCase())
                          }</span>
                        </>
                      );
                    } else {
                      // Fallback - just show the full suggestion
                      displaySuggestion = <span>{suggestion}</span>;
                    }
                    
                    return (
                      <div 
                        key={index}
                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleSearchSuggestionClick(suggestion)}
                      >
                        <Search size={16} className="text-gray-400 mr-3 flex-shrink-0" />
                        <span className="text-sm">{displaySuggestion}</span>
                      </div>
                    );
                  })}
                  <div className="px-3 py-2 border-t border-gray-100">
                    <a href="/stores" className="text-sm hover:underline">Trouvez nos magasins</a>
                  </div>
                </div>
              )}
            </div>

            {/* Popular searches */}
            {searchQuery.trim() === '' && (
              <div className="max-w-3xl mx-auto mb-12 text-center">
                <p className="uppercase text-xs tracking-wider text-gray-500 mb-4">Recherches Populaires</p>
                <div className="flex flex-wrap justify-center gap-6">
                  {['speedy', 'pochette', 'neverfull', 'bracelet', 'portefeuille'].map(term => (
                    <button 
                      key={term}
                      onClick={() => handleRecentSearchClick(term)} 
                      className="text-sm hover:underline"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent search example - simplified to match Louis Vuitton style */}
            {searchQuery.trim() === '' && recentSearches.length > 0 && (
              <div className="max-w-3xl mx-auto mb-12">
                <p className="text-sm mb-4">{recentSearches[0]}</p>
              </div>
            )}

            {/* Search results */}
            {searchQuery.trim() !== '' && !isSearching && (
              <>
                {instantResults.length > 0 ? (
                  <div>
                    {/* Brand matched heading if applicable */}
                    {matchedBrand && (
                      <h3 className="text-xl mb-6">
                        {matchedBrand} Products
                      </h3>
                    )}

                    {/* Products grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                      {instantResults.map((result, index) => (
                        <div 
                          key={`product-${result.id}-${index}`}
                          className="group relative cursor-pointer"
                          onClick={() => handleSuggestionClick(result)}
                        >
                          {/* Favorite button */}
                          <button 
                            className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add favorite functionality
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                          </button>
                          
                          {/* Product image */}
                          <div className="mb-2">
                            <div className="text-xs text-gray-500 mb-1">Nouveau</div>
                            {result.image && (
                              <div className="aspect-square bg-gray-50">
                                <img 
                                  src={result.image} 
                                  alt={result.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                          
                          {/* Product info */}
                          <div>
                            <p className="text-xs text-gray-900 font-light leading-tight mb-1 line-clamp-2">
                              {result.name}
                            </p>
                            {result.price && (
                              <p className="text-xs text-gray-900">
                                {result.price.toLocaleString()} MAD
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* View all results */}
                    <div className="text-center">
                      <button
                        onClick={handleSearch}
                        className="text-sm hover:underline inline-flex items-center"
                      >
                        View all results <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm mb-2">No results found for "{searchQuery}"</p>
                    <p className="text-xs text-gray-500">Try checking your spelling or use more general terms</p>
                  </div>
                )}
              </>
            )}

            {/* Loading state */}
            {searchQuery.trim() !== '' && isSearching && (
              <div className="text-center py-12">
                <Loader size={20} className="mx-auto mb-2" />
                <p className="text-sm text-gray-500">Searching...</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal; 