import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const RelatedProducts = ({ onAddToCart }) => {
  const relatedProducts = [
    {
      id: 101,
      name: 'Premium Basmati Rice',
      price: 299,
      originalPrice: 349,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 124,
      badges: ['Organic', 'Premium Quality'],
      variant: '1kg'
    },
    {
      id: 102,
      name: 'Homemade Ghee',
      price: 599,
      originalPrice: 699,
      image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 89,
      badges: ['Pure', 'Traditional'],
      variant: '500ml'
    },
    {
      id: 103,
      name: 'Mixed Spice Powder',
      price: 199,
      originalPrice: 249,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 156,
      badges: ['Handmade', 'No Preservatives'],
      variant: '200g'
    },
    {
      id: 104,
      name: 'Organic Jaggery',
      price: 149,
      originalPrice: 179,
      image: 'https://images.unsplash.com/photo-1609501676725-7186f734b2b0?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 78,
      badges: ['Organic', 'Chemical Free'],
      variant: '500g'
    }
  ];

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product?.id,
      name: product?.name,
      price: product?.price,
      originalPrice: product?.originalPrice,
      image: product?.image,
      variant: product?.variant,
      badges: product?.badges,
      quantity: 1
    };
    onAddToCart(cartItem);
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-xl text-foreground">
          You might also like
        </h2>
        <Link to="/product-collection-grid">
          <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
            View All
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts?.map((product) => {
          const discountPercentage = Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100);
          
          return (
            <div
              key={product?.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-warm-md transition-all duration-300 group"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-destructive text-destructive-foreground text-xs font-caption font-bold px-2 py-1 rounded">
                      {discountPercentage}% OFF
                    </span>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="p-2 bg-background/90 hover:bg-background rounded-full shadow-warm transition-colors duration-200"
                    aria-label="Add to wishlist"
                  >
                    <Icon name="Heart" size={16} />
                  </button>
                </div>
              </div>
              {/* Product Info */}
              <div className="p-4">
                {/* Badges */}
                {product?.badges && product?.badges?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product?.badges?.slice(0, 2)?.map((badge, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-caption font-medium bg-accent/10 text-accent"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                <Link to={`/product-detail-page?id=${product?.id}`}>
                  <h3 className="font-body font-semibold text-foreground mb-1 hover:text-primary transition-colors duration-200 line-clamp-2">
                    {product?.name}
                  </h3>
                </Link>
                
                <p className="font-caption text-sm text-muted-foreground mb-2">
                  {product?.variant}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={12}
                        className={i < Math.floor(product?.rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
                      />
                    ))}
                  </div>
                  <span className="font-caption text-xs text-muted-foreground">
                    {product?.rating} ({product?.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-data font-bold text-lg text-foreground">
                    ₹{product?.price}
                  </span>
                  {product?.originalPrice > product?.price && (
                    <span className="font-data text-sm text-muted-foreground line-through">
                      ₹{product?.originalPrice}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button
                  variant="outline"
                  fullWidth
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  iconName="ShoppingCart"
                  iconPosition="left"
                  iconSize={16}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;