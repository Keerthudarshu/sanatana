import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import categoryApi from '../../services/categoryApi';
import productApi from '../../services/productApi';

const CategoryDropdown = ({ isOpen, onClose, onToggle }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories and products in parallel
      const [categoriesResponse, productsResponse] = await Promise.allSettled([
        categoryApi.getAll(),
        productApi.getAll()
      ]);

      const categoriesData = categoriesResponse.status === 'fulfilled' 
        ? (categoriesResponse.value || []) 
        : [];

      const productsData = productsResponse.status === 'fulfilled' 
        ? (Array.isArray(productsResponse.value) ? productsResponse.value : (productsResponse.value?.data || []))
        : [];

      console.log('Fetched categories:', categoriesData.length);
      console.log('Fetched products:', productsData.length);

      // Process categories and add product counts
      const processedCategories = categoriesData.map(category => {
        const categoryName = category.name || category.categoryName;
        if (!categoryName) return null;

        // Count products in this category using improved matching
        const productCount = productsData.filter(product => {
          const productCategory = product.category || product.categoryId;
          if (!productCategory) return false;
          
          // Normalize both category names for comparison
          const normalizedCategoryName = categoryName.toLowerCase().trim().replace(/\s+/g, '-');
          const normalizedProductCategory = productCategory.toLowerCase().trim().replace(/\s+/g, '-');
          
          return normalizedProductCategory === normalizedCategoryName ||
                 normalizedProductCategory.includes(normalizedCategoryName) ||
                 normalizedCategoryName.includes(normalizedProductCategory);
        }).length;

        const processedCategory = {
          id: category.id,
          name: categoryName,
          displayName: formatCategoryName(categoryName),
          productCount: productCount,
          icon: getCategoryIcon(categoryName)
        };
        
        console.log('Processed category:', processedCategory);
        return processedCategory;
      }).filter(cat => cat !== null && cat.productCount > 0) // Only show categories with products
        .sort((a, b) => b.productCount - a.productCount) // Sort by product count
        .slice(0, 8); // Limit to 8 categories

      console.log('Final categories for dropdown:', processedCategories);
      setCategories(processedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const formatCategoryName = (name) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'wood-pressed-oils': 'Droplets',
      'spice-powders': 'Sparkles',
      'pickles': 'Jar',
      'ghee-honey': 'Heart',
      'jaggery': 'Candy',
      'papads': 'Cookie',
      'sweets': 'Cake',
      'snacks': 'Package'
    };

    const key = categoryName.toLowerCase().replace(/\s+/g, '-');
    return iconMap[key] || 'Package';
  };

  const handleCategoryClick = (category) => {
    navigate(`/product-collection-grid?category=${encodeURIComponent(category.name)}`);
    onClose();
  };

  const handleViewAllCategories = () => {
    navigate('/categories');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 w-80 bg-white shadow-2xl border border-border rounded-lg z-50 mt-2"
    >
      {/* Dropdown Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Browse Categories
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      </div>

      {/* Dropdown Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <CategoryDropdownSkeleton />
        ) : error ? (
          <CategoryDropdownError error={error} onRetry={fetchCategories} />
        ) : (
          <div className="py-2">
            {/* Categories List */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors text-left group"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Icon name={category.icon} size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-heading font-medium text-foreground group-hover:text-primary transition-colors">
                    {category.displayName}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {category.productCount} product{category.productCount !== 1 ? 's' : ''}
                  </p>
                </div>
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" 
                />
              </button>
            ))}

            {/* Divider */}
            {categories.length > 0 && (
              <div className="border-t border-border my-2"></div>
            )}

            {/* View All Categories Button */}
            <button
              onClick={handleViewAllCategories}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/10 transition-colors text-left group"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all duration-300">
                <Icon name="Grid" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-heading font-medium text-foreground group-hover:text-accent transition-colors">
                  View All Categories
                </h4>
                <p className="text-sm text-muted-foreground">
                  Browse complete category list
                </p>
              </div>
              <Icon 
                name="ArrowRight" 
                size={16} 
                className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all duration-300" 
              />
            </button>

            {/* Quick Links */}
            <div className="border-t border-border mt-2 pt-2">
              <div className="px-4 py-2">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Quick Links
                </h5>
                <div className="space-y-1">
                  <Link
                    to="/product-collection-grid?featured=true"
                    onClick={onClose}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    Featured Products
                  </Link>
                  <Link
                    to="/product-collection-grid?sort=newest"
                    onClick={onClose}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    New Arrivals
                  </Link>
                  <Link
                    to="/product-collection-grid?sort=best-selling"
                    onClick={onClose}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    Best Sellers
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryDropdownSkeleton = () => (
  <div className="py-2">
    {Array(6).fill(0).map((_, index) => (
      <div key={index} className="flex items-center gap-3 px-4 py-3">
        <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-muted rounded mb-1 animate-pulse"></div>
          <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

const CategoryDropdownError = ({ error, onRetry }) => (
  <div className="p-4 text-center">
    <Icon name="AlertCircle" size={32} className="text-red-500 mx-auto mb-2" />
    <p className="text-sm text-red-600 mb-3">{error}</p>
    <button
      onClick={onRetry}
      className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
    >
      Retry
    </button>
  </div>
);

export default CategoryDropdown;