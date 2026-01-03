import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import categoryApi from '../../services/categoryApi';
import productApi from '../../services/productApi';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Home', path: '/homepage' },
    { label: 'Categories', path: '/categories' }
  ];

  useEffect(() => {
    fetchCategoriesWithImages();
  }, []);

  const fetchCategoriesWithImages = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories from backend
      const categoriesResponse = await categoryApi.getAll();
      const categoriesData = categoriesResponse || [];

      // Fetch products to get category images and counts
      let productsData = [];
      try {
        const productsResponse = await productApi.getAll();
        productsData = Array.isArray(productsResponse) ? productsResponse : (productsResponse?.data || []);
      } catch (productError) {
        console.warn('Failed to fetch products for category enrichment:', productError);
      }

      // Process categories and enrich with product information
      const enrichedCategories = await Promise.all(categoriesData.map(async (category) => {
        const categoryName = category.name || category.categoryName;
        if (!categoryName) return null;

        // Find products in this category
        const categoryProducts = productsData.filter(product => {
          const productCategory = product.category || product.categoryId;
          return productCategory && productCategory.toLowerCase() === categoryName.toLowerCase();
        });

        // Get the first available product image for category, or a mapped fallback
        const categoryImage = getCategoryImage(categoryProducts, categoryName);
        
        return {
          id: category.id,
          name: categoryName,
          displayName: formatCategoryName(categoryName),
          description: generateCategoryDescription(categoryName),
          image: categoryImage,
          productCount: categoryProducts.length,
          products: categoryProducts.slice(0, 3), // Show first 3 products as preview
          slug: categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        };
      }));

      // Debug: log all category slugs before filtering
      console.log('All category slugs from backend:', enrichedCategories.map(cat => cat && cat.slug));

      // Only allow specific categories to be shown
      const allowedSlugs = [
        'wood-pressed-oils',
        'spice-powders',
        'pickles',
        'ghee-honey',
        'papads',
        'jaggery',
        'jaggery-sweeteners'
      ];
      const validCategories = enrichedCategories
        .filter(cat => cat !== null && allowedSlugs.includes(cat.slug))
        .sort((a, b) => b.productCount - a.productCount);

      setCategories(validCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryImage = (products, categoryName) => {
    // Try to find a good image from products
    for (const product of products) {
      const image = product.imageUrl || product.image || product.image_path || product.thumbnailUrl;
      if (image && image !== '/assets/images/no_image.png') {
        return image;
      }
    }

    // Fallback images per category (external CDN/Unsplash) to ensure visuals
    const key = (categoryName || '').toLowerCase().replace(/\s+/g, '-');
    const fallbackImages = {
      'wood-pressed-oils': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=350&fit=crop&auto=format&q=85',
      'spice-powders': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=350&fit=crop&auto=format&q=85',
      'pickles': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=350&fit=crop&auto=format&q=85',
      'ghee-honey': '/assets/banner/gee3.avif',
      'jaggery': '/assets/banner/Jaggery_Sweeteners.jpg',
      'papads': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=350&fit=crop&auto=format&q=85'
    };

    if (fallbackImages[key]) return fallbackImages[key];

    // Generic default image
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d';
  };

  const formatCategoryName = (name) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const generateCategoryDescription = (categoryName) => {
    const descriptions = {
      'wood-pressed-oils': 'Pure, traditional wood-pressed oils extracted using ancient methods',
      'spice-powders': 'Authentic spice blends and powders ground fresh using traditional techniques',
      'pickles': 'Homemade pickles and preserves using traditional family recipes',
      'ghee-honey': 'Pure A2 ghee and wild honey sourced directly from farms',
      'jaggery': 'Chemical-free natural jaggery made using traditional methods',
      'papads': 'Hand-rolled papads and traditional snacks made with care'
    };

    const key = categoryName.toLowerCase().replace(/\s+/g, '-');
    return descriptions[key] || `Discover our premium ${formatCategoryName(categoryName).toLowerCase()} collection`;
  };

  const handleCategoryClick = (category) => {
    navigate(`/product-collection-grid?category=${encodeURIComponent(category.name)}`);
  };

  const handleRetry = () => {
    fetchCategoriesWithImages();
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Categories - Sanatana Parampare | Browse Product Categories</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-6">
            <div className="container mx-auto px-4">
              <Breadcrumb customItems={breadcrumbItems} />
              <CategoryLoadingSkeleton />
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Categories - Sanatana Parampare | Browse Product Categories</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-6">
            <div className="container mx-auto px-4">
              <Breadcrumb customItems={breadcrumbItems} />
              <CategoryError error={error} onRetry={handleRetry} />
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Categories - Sanatana Parampare | Browse Traditional Food Categories</title>
        <meta name="description" content="Browse all product categories at Sanatana Parampare. From wood-pressed oils to traditional spices, discover authentic Indian food products organized by category." />
        <meta name="keywords" content="product categories, traditional food categories, wood pressed oils, spice powders, pickles, ghee honey, sanatana parampare categories" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-6">
          <div className="container mx-auto px-4">
            <Breadcrumb customItems={breadcrumbItems} />

            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6">
                Product Categories
              </h1>
              <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
              <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Explore our carefully curated categories of traditional Indian products. 
                Each category represents generations of authentic recipes and traditional methods.
              </p>
            </div>

            {/* Categories Grid */}
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                {categories.map((category) => (
                  <CategoryCard 
                    key={category.id} 
                    category={category} 
                    onClick={() => handleCategoryClick(category)} 
                  />
                ))}
              </div>
            ) : (
              <EmptyCategories />
            )}

            {/* Call to Action */}
            <div className="text-center py-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl">
              <h2 className="font-heading text-3xl font-bold text-primary mb-4">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Browse all our products or use our search to find specific items
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/product-collection-grid"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-heading font-semibold transition-all duration-300 inline-block"
                >
                  View All Products
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-full font-heading font-semibold transition-all duration-300 inline-block"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

const CategoryCard = ({ category, onClick }) => (
  <div 
    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
    onClick={onClick}
  >
    {/* Category Image */}
    <div className="aspect-video relative overflow-hidden">
      <img
        src={category.image}
        alt={category.displayName}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        onError={(e) => {
          e.target.src = '/assets/images/no_image.png';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
      
      {/* Product Count Badge */}
      <div className="absolute top-4 right-4">
        <span className="bg-white/90 text-primary px-3 py-1 rounded-full text-sm font-semibold">
          {category.productCount} Products
        </span>
      </div>

      {/* Category Name Overlay */}
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="font-heading text-xl font-bold mb-1">
          {category.displayName}
        </h3>
        <p className="text-white/90 text-sm">
          Traditional & Authentic
        </p>
      </div>
    </div>

    {/* Category Info */}
    <div className="p-6">
      <p className="font-body text-muted-foreground text-sm mb-4 line-clamp-2">
        {category.description}
      </p>

      {/* Product Preview */}
      {category.products.length > 0 && (
        <div className="mb-4">
          <p className="font-heading text-sm font-semibold text-foreground mb-2">
            Featured Products:
          </p>
          <div className="flex gap-2">
            {category.products.slice(0, 3).map((product, index) => (
              <div key={index} className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                <img
                  src={product.imageUrl || product.image || '/assets/images/no_image.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300"
      >
        <span className="flex items-center justify-center gap-2">
          Explore Category
          <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </Button>
    </div>
  </div>
);

const CategoryLoadingSkeleton = () => (
  <div className="space-y-12">
    <div className="text-center">
      <div className="h-12 bg-muted rounded w-1/3 mx-auto mb-6 animate-pulse"></div>
      <div className="h-1 bg-muted rounded w-24 mx-auto mb-6 animate-pulse"></div>
      <div className="h-6 bg-muted rounded w-2/3 mx-auto animate-pulse"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array(8).fill(0).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="aspect-video bg-muted animate-pulse"></div>
          <div className="p-6">
            <div className="h-4 bg-muted rounded mb-4 animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="flex gap-2 mb-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="w-12 h-12 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="h-10 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CategoryError = ({ error, onRetry }) => (
  <div className="text-center py-16">
    <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
      <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
      <h3 className="font-heading text-xl font-semibold text-red-800 mb-2">
        Failed to Load Categories
      </h3>
      <p className="text-red-600 mb-6">
        {error}
      </p>
      <Button
        onClick={onRetry}
        className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-lg transition-colors"
      >
        Retry
      </Button>
    </div>
  </div>
);

const EmptyCategories = () => (
  <div className="text-center py-16">
    <Icon name="Package" size={64} className="text-muted-foreground mx-auto mb-6" />
    <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">
      No Categories Found
    </h3>
    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
      We're working on organizing our products. Please check back soon or browse all products.
    </p>
    <Link
      to="/product-collection-grid"
      className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-heading font-semibold transition-all duration-300 inline-block"
    >
      View All Products
    </Link>
  </div>
);

export default CategoriesPage;