import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

import Input from './Input';
import AnnouncementBar from './AnnouncementBar';
import MegaMenu from './MegaMenu';
import CategoryDropdown from './CategoryDropdown';
import CartDrawer from './CartDrawer';
import { useCart } from '../../contexts/CartContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Header = ({ isLoggedIn = false, onSearch = () => {} }) => {
  const { user } = useAuth();
  const loggedIn = user || isLoggedIn;
  const { cartItems, getCartItemCount, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsCategoryDropdownOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }
    let ignore = false;
    setSearchLoading(true);
    const timer = setTimeout(async () => {
      try {
        const list = await fetch('/api/products');
        let items = await list.json();
        const qLower = q.toLowerCase();
        items = items.filter(p => String(p?.name || p?.title || '').toLowerCase().includes(qLower));
        const limited = items.slice(0, 8).map(p => ({
          id: p?.id,
          name: p?.name || p?.title,
          price: p?.price ?? p?.salePrice ?? 0,
          image: p?.imageUrl || p?.image || p?.thumbnailUrl || p?.image_path
        }));
        if (!ignore) {
          setSuggestions(limited);
          setSuggestionsOpen(true);
        }
      } catch (e) {
        if (!ignore) {
          setSuggestions([]);
          setSuggestionsOpen(false);
        }
      } finally {
        if (!ignore) setSearchLoading(false);
      }
    }, 250);
    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery?.trim()) params.set('search', searchQuery.trim());
    const target = `/product-collection-grid${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(target);
    if (searchQuery?.trim() && onSearch) onSearch(searchQuery.trim());
  };

  const navigationItems = [
    { label: 'Home', path: '/homepage', icon: 'Home' },
    { label: 'Products', path: '/product-collection-grid', icon: 'Package' },
    { label: 'Categories', path: '/categories', icon: 'Grid', hasDropdown: true, isCategories: true },
    { label: 'About', path: '/about', icon: 'Info' },
    { label: 'Contact', path: '/contact', icon: 'Phone' },
  ];

  return (
    <>
      {/* Simplified Top Bar */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-2 text-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Icon name="Truck" size={14} />
              Free Shipping ₹499+
            </span>
            <span className="hidden md:flex items-center gap-2">
              <Icon name="Shield" size={14} />
              100% Authentic Products
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
              FLAT10 - 10% OFF above ₹1499
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Primary Header Row */}
          <div className="flex items-center justify-between py-4">
            {/* Logo Section */}
            <Link to="/homepage" className="flex items-center group">
              <div className="relative w-14 h-14 flex items-center justify-center overflow-visible">
                <img
                  src="/assets/images/logo.jpg"
                  alt="Sanatana Parampare Logo"
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-14 max-h-none transform scale-125 group-hover:scale-150 transition-transform duration-300 pointer-events-none"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <div key={index} className="relative group">
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 px-4 py-3 text-foreground hover:text-primary font-medium transition-all duration-300 relative group"
                    onClick={(e) => {
                      if (item.hasDropdown) {
                        e.preventDefault();
                        if (item.isCategories) {
                          setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                          setIsMegaMenuOpen(false);
                        } else {
                          setIsMegaMenuOpen(!isMegaMenuOpen);
                          setIsCategoryDropdownOpen(false);
                        }
                      } else {
                        setIsMegaMenuOpen(false);
                        setIsCategoryDropdownOpen(false);
                      }
                    }}
                  >
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <Icon name="ChevronDown" size={16} className="transition-transform duration-200 group-hover:rotate-180" />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </Link>
                  
                  {/* Category Dropdown */}
                  {item.isCategories && (
                    <CategoryDropdown
                      isOpen={isCategoryDropdownOpen}
                      onClose={() => setIsCategoryDropdownOpen(false)}
                      onToggle={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    />
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar - Centered */}
            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative bg-muted/50 rounded-full border border-border hover:border-primary/50 focus-within:border-primary transition-colors duration-300">
                  <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="w-full pl-12 pr-4 py-3 bg-transparent border-0 focus:ring-0 rounded-full"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  )}
                </div>
                
                {/* Enhanced Search Suggestions */}
                {suggestionsOpen && suggestions.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <h4 className="text-sm font-semibold text-foreground">Search Results</h4>
                    </div>
                    {suggestions.map(item => (
                      <button
                        key={item.id}
                        onClick={() => navigate(`/product-detail-page?id=${item.id}`)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 text-left transition-colors duration-200"
                      >
                        <img src={item.image || '/assets/images/no_image.png'} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1">
                          <div className="font-medium text-foreground line-clamp-1">{item.name}</div>
                          <div className="text-sm text-primary font-semibold">₹{(item.price || 0).toFixed(2)}</div>
                        </div>
                        <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
                      </button>
                    ))}
                    <div className="border-t border-border p-4">
                      <button
                        onClick={handleSearch}
                        className="w-full text-center py-2 text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors duration-200"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* User Account */}
              <Link
                to={loggedIn ? "/user-account-dashboard" : "/user-login"}
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:text-primary hover:bg-muted/50 rounded-xl transition-all duration-300"
              >
                <Icon name="User" size={20} />
                <span className="hidden xl:block font-medium">
                  {loggedIn ? "Account" : "Login"}
                </span>
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2 text-foreground hover:text-primary hover:bg-muted/50 rounded-xl transition-all duration-300"
              >
                <Icon name="ShoppingCart" size={20} />
                <span className="hidden xl:block font-medium">Cart</span>
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {getCartItemCount()}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-muted/50 transition-colors duration-300"
              >
                <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative bg-muted/50 rounded-full border border-border">
                <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-0 focus:ring-0 rounded-full"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-white">
            <nav className="container mx-auto px-4 py-6">
              <div className="space-y-2">
                {navigationItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 text-foreground hover:text-primary hover:bg-muted/50 rounded-xl transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon name={item.icon} size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <Link
                  to={loggedIn ? "/user-account-dashboard" : "/user-login"}
                  className="flex items-center gap-2 px-4 py-3 text-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon name="User" size={18} />
                  <span className="font-medium">{loggedIn ? "My Account" : "Login"}</span>
                </Link>
              </div>
            </nav>
          </div>
        )}

        {/* Mega Menu */}
        <MegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
        />
      </header>
      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </>
  );
};

export default Header;