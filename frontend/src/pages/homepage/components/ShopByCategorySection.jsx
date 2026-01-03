import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Popup from '../../../components/ui/Popup';

const ShopByCategorySection = () => {
  const [popup, setPopup] = useState({ open: false, message: '', type: 'success' });

  const categories = [
    {
      id: 'wood-pressed-oils',
      name: 'Wood Pressed Oils',
      productCount: 25,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=350&fit=crop&auto=format&q=85',
      icon: 'Droplets',
      description: 'Cold pressed, chemical-free oils',
      featured: ['Coconut Oil', 'Sesame Oil', 'Groundnut Oil'],
      startingPrice: 180,
      badge: 'Best Seller'
    },
    {
      id: 'spice-powders',
      name: 'Spice Powders',
      productCount: 42,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=350&fit=crop&auto=format&q=85',
      icon: 'Sparkles',
      description: 'Traditional masalas & spice blends',
      featured: ['Sambar Powder', 'Rasam Powder', 'Garam Masala'],
      startingPrice: 85,
      badge: 'Authentic'
    },
    {
      id: 'pickles-preserves',
      name: 'Pickles & Preserves',
      productCount: 18,
      image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=350&fit=crop&auto=format&q=85',
      icon: 'Jar',
      description: 'Homemade traditional pickles',
      featured: ['Mango Pickle', 'Lemon Pickle', 'Mixed Veg'],
      startingPrice: 120,
      badge: 'Homemade'
    },
    {
      id: 'ghee-honey',
      name: 'Ghee & Honey',
      productCount: 12,
        image: '/assets/banner/gee3.avif',
      icon: 'Heart',
      description: 'Pure A2 ghee & wild honey',
      featured: ['Pure Ghee', 'Wild Honey', 'A2 Cow Ghee'],
      startingPrice: 450,
      badge: 'Premium'
    },
    {
      id: 'jaggery-sweeteners',
      name: 'Jaggery & Sweeteners',
      productCount: 8,
      image: '/assets/banner/Jaggery_Sweeteners.jpg',
      icon: 'Candy',
      description: 'Chemical-free natural sweeteners',
      featured: ['Powder Jaggery', 'Solid Jaggery', 'Palm Jaggery'],
      startingPrice: 95,
      badge: 'Natural'
    },
    {
      id: 'papads-traditional',
      name: 'Papads & More',
      productCount: 15,
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=350&fit=crop&auto=format&q=85',
      icon: 'Cookie',
      description: 'Handmade papads & traditional items',
      featured: ['Rice Papad', 'Urad Papad', 'Ragi Items'],
      startingPrice: 65,
      badge: 'Handmade'
    }
  ];

  // Handler for adding to cart/wishlist (example)
  const handleAddToCart = (categoryName) => {
    setPopup({ open: true, message: `${categoryName} added to cart!`, type: 'success' });
  };
  const handleAddToWishlist = (categoryName) => {
    setPopup({ open: true, message: `${categoryName} added to wishlist!`, type: 'success' });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Popup Notification */}
        <Popup
          open={popup.open}
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ ...popup, open: false })}
        />
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-primary mb-4">
            Shop by Category
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our premium product categories. Click to explore and add to cart.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/product-collection-grid?category=${category.id}`}
              className="group bg-white rounded-2xl shadow-lg border border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Enhanced Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-primary/20">
                    {category.badge}
                  </span>
                </div>

                {/* Product Count */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white/95 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-white/30">
                    {category.productCount} Items
                  </span>
                </div>

                {/* Icon */}
                <div className="absolute bottom-4 left-4">
                  <div className="w-14 h-14 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/30">
                    <Icon name={category.icon} size={26} className="text-primary" />
                  </div>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-4 right-4">
                  <div className="bg-accent/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-lg border border-accent/20">
                    <span className="text-xs font-medium">From ₹{category.startingPrice}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category Name */}
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {category.name}
                </h3>
                
                {/* Description */}
                <p className="font-body text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>

                {/* Featured Products */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {category.featured.slice(0, 2).map((product, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                      >
                        {product}
                      </span>
                    ))}
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      +{category.featured.length - 2} more
                    </span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Starting from</span>
                    <span className="font-heading text-lg font-bold text-primary">
                      ₹{category.startingPrice}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-primary group-hover:text-accent transition-colors duration-300">
                    <span className="font-medium text-sm mr-2">Shop Now</span>
                    <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Demo Buttons for Add to Cart/Wishlist */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/80"
                    onClick={(e) => { e.preventDefault(); handleAddToCart(category.name); }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="px-3 py-1 bg-accent text-white rounded hover:bg-accent/80"
                    onClick={(e) => { e.preventDefault(); handleAddToWishlist(category.name); }}
                  >
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

  );
};

export default ShopByCategorySection;