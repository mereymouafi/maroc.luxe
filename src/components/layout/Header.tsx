import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import Logo from '../common/Logo';

interface HeaderProps {
  scrolled: boolean;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
}

const Header: React.FC<HeaderProps> = ({ scrolled, onOpenSearch, onOpenAuth }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-luxury-black p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="flex-1 lg:flex-initial text-center lg:text-left">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="text-luxury-black hover:text-luxury-gold transition-colors">
            Home
          </Link>
          <Link to="/shop" className="text-luxury-black hover:text-luxury-gold transition-colors">
            Shop
          </Link>
          <Link to="/about" className="text-luxury-black hover:text-luxury-gold transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-luxury-black hover:text-luxury-gold transition-colors">
            Contact
          </Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenSearch}
            className="text-luxury-black hover:text-luxury-gold transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
          <button
            onClick={onOpenAuth}
            className="text-luxury-black hover:text-luxury-gold transition-colors"
            aria-label="Account"
          >
            <User size={20} />
          </button>
          <button
            onClick={handleCartClick}
            className="text-luxury-black hover:text-luxury-gold transition-colors relative"
            aria-label="Shopping bag"
          >
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-black w-4 h-4 rounded-full text-xs flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="container h-full flex flex-col pt-20 pb-6">
          <nav className="flex flex-col space-y-4 text-center text-xl font-serif">
            <Link 
              to="/" 
              className="py-3 border-b border-gray-100 text-luxury-black"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="py-3 border-b border-gray-100 text-luxury-black"
              onClick={toggleMenu}
            >
              Shop
            </Link>
            <Link 
              to="/about" 
              className="py-3 border-b border-gray-100 text-luxury-black"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="py-3 border-b border-gray-100 text-luxury-black"
              onClick={toggleMenu}
            >
              Contact
            </Link>
          </nav>
          <div className="mt-auto">
            <button 
              className="btn btn-primary w-full"
              onClick={() => {
                toggleMenu();
                onOpenAuth();
              }}
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;