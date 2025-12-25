import React from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../../hooks/useCategories';
import Icon from '../../../components/AppIcon';

const EnhancedCategoriesSection = () => {
  const { 
    categories, 
    loading, 
    error, 
    getFeaturedCategories,
    refreshCategories 
  } = useCategories({
    includeProductCount: true,
    transformCategories: (cats) => cats.filter(cat => cat.isActive !== false).slice(0, 8)
  });

  const featuredCategories = getFeaturedCategories().slice(0, 3);

  if (loading && categories.length === 0) {
    return <CategorySkeleton />;
  }

  if (error && categories.length === 0) {
    return <CategoryError onRetry={refreshCategories} />;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">
            Shop by Category
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover our carefully curated categories of traditional Indian products, 
            each maintaining the highest standards of purity and authenticity.
          </p>
        </div>

        {/* Featured Categories Highlight */}
        {featuredCategories.length > 0 && (
          <div className="mb-16">
            <h3 className="font-heading text-2xl font-bold text-center mb-8">
              Featured Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCategories.map(category => (
                <FeaturedCategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        )}

        {/* All Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* View All Categories Link */}
        <div className="text-center mt-12">
          <Link
            to="/product-collection-grid"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-heading font-semibold transition-all duration-300 hover:scale-105"
          >
            <span>Explore All Products</span>
            <Icon name="ArrowRight" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

const FeaturedCategoryCard = ({ category }) => (
  <Link 
    to={`/product-collection-grid?category=${encodeURIComponent(category.name)}`}
    className="group block"
  >
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
      {/* Featured Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold">
          Featured
        </span>
      </div>
      
      {/* Category Image */}
      <div className="aspect-video relative overflow-hidden">
        <img
          src={category.image || '/assets/images/no_image.png'}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-heading text-xl font-bold">{category.name}</h3>
          {category.productCount > 0 && (
            <p className="text-white/90 text-sm">{category.productCount} Products</p>
          )}
        </div>
      </div>
      
      {/* Category Info */}
      <div className="p-6">
        <p className="font-body text-muted-foreground text-sm">
          {category.description}
        </p>
      </div>
    </div>
  </Link>
);

const CategoryCard = ({ category }) => (
  <Link 
    to={`/product-collection-grid?category=${encodeURIComponent(category.name)}`}
    className="group block"
  >
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:transform group-hover:scale-105">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={category.image || '/assets/images/no_image.png'}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-muted-foreground">
            {category.productCount > 0 ? `${category.productCount} items` : 'View products'}
          </span>
          <Icon 
            name="ArrowRight" 
            size={16} 
            className="text-muted-foreground group-hover:text-primary group-hover:transform group-hover:translate-x-1 transition-all duration-300" 
          />
        </div>
      </div>
    </div>
  </Link>
);

const CategorySkeleton = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <div className="h-12 bg-muted rounded w-1/3 mx-auto mb-6"></div>
        <div className="h-1 bg-muted rounded w-24 mx-auto mb-8"></div>
        <div className="h-6 bg-muted rounded w-2/3 mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-muted rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CategoryError = ({ onRetry }) => (
  <section className="py-20">
    <div className="container mx-auto px-4 text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
        <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="font-heading text-xl font-semibold text-red-800 mb-2">
          Failed to Load Categories
        </h3>
        <p className="text-red-600 mb-4">
          We're having trouble loading the categories. Please try again.
        </p>
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  </section>
);

export default EnhancedCategoriesSection;