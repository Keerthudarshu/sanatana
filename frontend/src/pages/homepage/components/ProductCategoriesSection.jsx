import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const ProductCategoriesSection = () => {
  const productCategories = [
    {
      id: 'wood-pressed-oils',
      title: 'Wood Pressed Oils',
      subtitle: 'Traditional Cold Pressed',
      description: 'Pure oils extracted using traditional wood pressing methods',
      icon: 'Droplets',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',
      products: ['Coconut Oil', 'Sesame Oil', 'Groundnut Oil', 'Safflower Oil'],
      color: 'bg-gradient-to-br from-yellow-100 to-orange-100',
      textColor: 'text-orange-800'
    },
    {
      id: 'spice-powders',
      title: 'Spice Powders',
      subtitle: 'Authentic Masalas',
      description: 'Hand-ground spices following traditional recipes',
      icon: 'Sparkles',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop',
      products: ['Sambar Powder', 'Rasam Powder', 'Garam Masala', 'Turmeric'],
      color: 'bg-gradient-to-br from-red-100 to-orange-100',
      textColor: 'text-red-800'
    },
    {
      id: 'pickles',
      title: 'Pickles & Preserves',
      subtitle: 'Traditional Recipes',
      description: 'Homemade pickles and chutneys with authentic flavors',
      icon: 'Jar',
      image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop',
      products: ['Mango Pickle', 'Lemon Pickle', 'Mixed Vegetables', 'Green Chilli'],
      color: 'bg-gradient-to-br from-green-100 to-lime-100',
      textColor: 'text-green-800'
    },
    {
      id: 'ghee-honey',
      title: 'Ghee & Honey',
      subtitle: 'Pure & Natural',
      description: 'Traditional ghee and unprocessed wild honey',
      icon: 'Heart',
      image: 'https://images.unsplash.com/photo-1587225168002-1841544a4eec?w=400&h=300&fit=crop',
      products: ['Pure Ghee', 'Wild Honey', 'Farm Honey', 'A2 Ghee'],
      color: 'bg-gradient-to-br from-amber-100 to-yellow-100',
      textColor: 'text-amber-800'
    },
    {
      id: 'jaggery-sweeteners',
      title: 'Jaggery & Sweeteners',
      subtitle: 'Chemical Free',
      description: 'Natural sweeteners made using traditional methods',
      icon: 'Candy',
      image: 'https://images.unsplash.com/photo-1582044131936-1a896567b2b7?w=400&h=300&fit=crop',
      products: ['Powder Jaggery', 'Ginger Jaggery', 'Solid Jaggery', 'Palm Jaggery'],
      color: 'bg-gradient-to-br from-brown-100 to-orange-100',
      textColor: 'text-brown-800'
    },
    {
      id: 'papads-traditional',
      title: 'Papads & Traditional',
      subtitle: 'Handmade Delights',
      description: 'Traditional papads and authentic food products',
      icon: 'Cookie',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
      products: ['Rice Papad', 'Urad Papad', 'Palak Papad', 'Traditional Sweets'],
      color: 'bg-gradient-to-br from-purple-100 to-pink-100',
      textColor: 'text-purple-800'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-5xl font-bold text-primary mb-4">
            Our Product Heritage
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover authentic Indian flavors crafted using ancient wisdom and traditional methods. 
            Each product tells a story of our rich culinary heritage.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productCategories.map((category, index) => (
            <Link
              key={category.id}
              to={`/product-collection-grid?category=${category.id}`}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 border border-border"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden rounded-t-3xl">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Icon Overlay */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full">
                  <Icon name={category.icon} size={24} className="text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${category.color} ${category.textColor} mb-2`}>
                    {category.subtitle}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                    {category.title}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>

                {/* Product List */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {category.products.slice(0, 3).map((product, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                      >
                        {product}
                      </span>
                    ))}
                    {category.products.length > 3 && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        +{category.products.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* View More */}
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-primary font-medium group-hover:text-accent transition-colors duration-300">
                    Explore Collection
                  </span>
                  <Icon name="ArrowRight" size={16} className="text-primary group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent rounded-br-full" />
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link
            to="/product-collection-grid"
            className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full font-heading font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Products
            <Icon name="ArrowRight" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCategoriesSection;