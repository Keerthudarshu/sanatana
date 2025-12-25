import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import productApi from '../../../services/productApi';
import { resolveImageUrl } from '../../../lib/resolveImageUrl';

const FeaturedProductsSection = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('bestsellers');
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({}); // Track selected variant per product

  const categories = [
    { id: 'bestsellers', name: 'Best Sellers', icon: 'Star', filter: { sort: 'rating', category: null } },
    { id: 'new-arrivals', name: 'New Arrivals', icon: 'Zap', filter: { sort: 'newest', category: null } },
    { id: 'offers', name: 'Special Offers', icon: 'Tag', filter: { minDiscount: 15, category: null } }
  ];

  // Helper function to map database products to display format
  const mapProductData = (dbProduct) => {
    const variants = dbProduct.variants || [];
    
    // Store full variant objects with all details
    const variantObjects = variants.length > 0 
      ? variants.map((v, idx) => ({
          id: v.id || `variant-${idx}`,
          label: `${v.weightValue}${v.weightUnit}`,
          weightValue: v.weightValue,
          weightUnit: v.weightUnit,
          price: v.price || dbProduct.price || 0,
          originalPrice: v.originalPrice || v.mrp || (v.price ? Math.round(v.price / (1 - (dbProduct.discount || 0) / 100)) : dbProduct.price),
          stockQuantity: v.stockQuantity || v.stock || 0
        }))
      : [{
          id: 'default',
          label: dbProduct.weightValue ? `${dbProduct.weightValue}${dbProduct.weightUnit}` : 'Default',
          weightValue: dbProduct.weightValue,
          weightUnit: dbProduct.weightUnit,
          price: dbProduct.price || 0,
          originalPrice: dbProduct.originalPrice || dbProduct.mrp || dbProduct.price || 0,
          stockQuantity: dbProduct.stockQuantity || 0
        }];
    
    const firstVariant = variantObjects[0];
    const price = firstVariant.price || 0;
    const originalPrice = firstVariant.originalPrice || price;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : (dbProduct.discount || 0);

    // Use imageUrl from database, resolve it properly, fallback to default
    const imageUrl = dbProduct.imageUrl || dbProduct.image || '';
    const resolvedImage = imageUrl 
      ? resolveImageUrl(imageUrl) 
      : '/assets/images/no_image.png';

    return {
      id: dbProduct.id,
      name: dbProduct.name,
      price: price,
      originalPrice: originalPrice,
      rating: dbProduct.rating || 0,
      reviews: dbProduct.reviewCount || 0,
      image: resolvedImage,
      badge: dbProduct.badge || 'Featured',
      variants: variantObjects, // Store full variant objects
      category: dbProduct.category,
      inStock: dbProduct.stockQuantity > 0 || (variantObjects.length > 0 && variantObjects.some(v => v.stockQuantity > 0)),
      discount: discount,
      stockQuantity: dbProduct.stockQuantity
    };
  };

  // Fetch products for each category on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productsData = {};

        // Fetch for each category
        for (const category of categories) {
          try {
            let params = { limit: 4 };
            
            // Add filters based on category
            if (category.filter.category) {
              params.category = category.filter.category;
            }
            if (category.filter.sort) {
              params.sort = category.filter.sort;
            }
            if (category.filter.minDiscount) {
              params.discount = category.filter.minDiscount;
            }

            const categoryProducts = await productApi.getAll(params);
            productsData[category.id] = Array.isArray(categoryProducts) 
              ? categoryProducts.map(mapProductData) 
              : [];
          } catch (err) {
            console.error(`Failed to fetch ${category.name}:`, err);
            productsData[category.id] = [];
          }
        }

        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError(err.message || 'Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const activeProducts = (products[activeCategory] || []).slice(0, 4);

  // Get selected variant for a product (or default to first variant)
  const getSelectedVariant = (productId, product) => {
    if (selectedVariants[productId] !== undefined) {
      return product.variants[selectedVariants[productId]] || product.variants[0];
    }
    return product.variants[0];
  };

  // Handle variant selection
  const handleVariantSelect = (productId, variantIndex) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantIndex
    }));
  };

  const handleQuickAdd = (product) => {
    if (onAddToCart) {
      const selectedVariant = getSelectedVariant(product.id, product);
      onAddToCart({
        ...product,
        variant: selectedVariant.label,
        price: selectedVariant.price,
        originalPrice: selectedVariant.originalPrice,
        selectedVariantId: selectedVariant.id
      });
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl font-bold text-primary mb-4">
            Featured Products
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked premium products loved by our customers. Order online with fast delivery.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-100 text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <Icon name={category.icon} size={18} />
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading featured products...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-12 text-center">
            <p className="text-red-600 font-medium">Failed to load featured products</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && activeProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products available in this category</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && activeProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {activeProducts.map((product) => {
            const selectedVariant = getSelectedVariant(product.id, product);
            const currentPrice = selectedVariant.price;
            const currentOriginalPrice = selectedVariant.originalPrice;
            const currentDiscount = currentOriginalPrice > currentPrice 
              ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100) 
              : 0;
            
            return (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-lg border border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&auto=format&q=80';
                  }}
                />
                
                {/* Enhanced Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-primary/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg border border-primary/20">
                    {product.badge}
                  </span>
                </div>

                {/* Stock Status */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {currentDiscount > 0 && (
                    <span className="bg-accent/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-accent/20">
                      {currentDiscount}% OFF
                    </span>
                  )}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm border ${
                    product.inStock 
                      ? 'bg-green-500/90 text-white border-green-500/20' 
                      : 'bg-red-500/90 text-white border-red-500/20'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>

                {/* Quick Add Button with Better Design */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="bg-white/95 backdrop-blur-sm text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-3 shadow-xl border border-white/30 transform translate-y-4 group-hover:translate-y-0"
                  >
                    <Icon name="ShoppingCart" size={18} />
                    Quick Add
                  </button>
                </div>

                {/* Wishlist Button */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300 shadow-lg border border-white/30">
                    <Icon name="Heart" size={16} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={14}
                        className={`${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews})
                  </span>
                </div>

                {/* Weight Options */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Weight:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.slice(0, 5).map((variant, idx) => {
                        const isSelected = selectedVariants[product.id] === idx || (selectedVariants[product.id] === undefined && idx === 0);
                        return (
                          <button
                            key={idx}
                            onClick={() => handleVariantSelect(product.id, idx)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-md border transition-all duration-200 ${
                              isSelected
                                ? 'bg-primary text-white border-primary shadow-md'
                                : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                            }`}
                          >
                            {variant.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xl font-bold text-primary">
                      ₹{currentPrice}
                    </span>
                    {currentOriginalPrice > currentPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{currentOriginalPrice}
                      </span>
                    )}
                  </div>
                  <div className={`text-sm font-medium ${product.inStock ? 'text-success' : 'text-destructive'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/product-detail-page/${product.id}`}
                    className="flex-1 bg-primary/10 text-primary text-center py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleQuickAdd(product)}
                    disabled={!product.inStock}
                    className="bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon name="ShoppingCart" size={16} />
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
        )}

        {/* View All CTA */}
        <div className="text-center">
          <Link
            to="/product-collection-grid"
            className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-heading font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Shop All Products
            <Icon name="ArrowRight" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;