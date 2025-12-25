import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import categoryApi from '../../services/categoryApi';
import Icon from '../AppIcon';

const CategoryBreadcrumb = () => {
  const [searchParams] = useSearchParams();
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const categoryParam = searchParams.get('category');

  useEffect(() => {
    const fetchCategoryInfo = async () => {
      if (!categoryParam) {
        setCategoryInfo(null);
        return;
      }

      try {
        setLoading(true);
        
        // First try to get all categories and find matching one
        const response = await categoryApi.getAll();
        const categoriesData = response?.data || response || [];
        
        // Find category by name or ID
        const foundCategory = categoriesData.find(cat => 
          (cat.name && cat.name.toLowerCase() === categoryParam.toLowerCase()) ||
          (cat.id && cat.id.toLowerCase() === categoryParam.toLowerCase()) ||
          (cat.categoryName && cat.categoryName.toLowerCase() === categoryParam.toLowerCase())
        );
        
        if (foundCategory) {
          setCategoryInfo({
            id: foundCategory.id,
            name: foundCategory.name || foundCategory.categoryName,
            description: foundCategory.description,
            productCount: foundCategory.productCount || 0,
            image: foundCategory.image || foundCategory.imageUrl
          });
        } else {
          // If not found in database, create a display-friendly version
          setCategoryInfo({
            name: categoryParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: `Browse our ${categoryParam.replace(/-/g, ' ')} collection`,
            productCount: 0
          });
        }
      } catch (error) {
        console.error('Error fetching category info:', error);
        // Fallback to display-friendly version
        setCategoryInfo({
          name: categoryParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `Browse our ${categoryParam.replace(/-/g, ' ')} collection`,
          productCount: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryInfo();
  }, [categoryParam]);

  if (!categoryParam && !categoryInfo) {
    return (
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link to="/homepage" className="hover:text-primary transition-colors">
          <Icon name="Home" size={16} />
        </Link>
        <Icon name="ChevronRight" size={16} />
        <span className="text-foreground">All Products</span>
      </nav>
    );
  }

  return (
    <div className="mb-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
        <Link to="/homepage" className="hover:text-primary transition-colors flex items-center">
          <Icon name="Home" size={16} />
          <span className="ml-1">Home</span>
        </Link>
        <Icon name="ChevronRight" size={16} />
        <Link to="/product-collection-grid" className="hover:text-primary transition-colors">
          Products
        </Link>
        {categoryInfo && (
          <>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground font-medium">
              {loading ? 'Loading...' : categoryInfo.name}
            </span>
          </>
        )}
      </nav>

      {/* Category Info Banner */}
      {categoryInfo && !loading && (
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="font-heading text-2xl lg:text-3xl font-bold text-primary mb-2">
                {categoryInfo.name}
              </h1>
              {categoryInfo.description && (
                <p className="text-muted-foreground mb-3 max-w-2xl">
                  {categoryInfo.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm">
                {categoryInfo.productCount > 0 && (
                  <span className="flex items-center gap-1 text-accent">
                    <Icon name="Package" size={16} />
                    {categoryInfo.productCount} Products
                  </span>
                )}
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Icon name="Truck" size={16} />
                  Free shipping above ₹499
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Icon name="Shield" size={16} />
                  Quality guaranteed
                </span>
              </div>
            </div>
            {categoryInfo.image && (
              <div className="hidden md:block ml-6">
                <img
                  src={categoryInfo.image}
                  alt={categoryInfo.name}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="bg-muted/20 border border-border rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-3"></div>
            <div className="flex gap-4">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-4 bg-muted rounded w-28"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryBreadcrumb;