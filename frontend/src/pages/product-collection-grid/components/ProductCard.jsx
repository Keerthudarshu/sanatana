import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductCard = ({ 
  product, 
  onQuickView, 
  onAddToCart, 
  onAddToWishlist, 
  isInWishlist = false 
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);

  // Stock handling
  const rawStock = (selectedVariant?.stock ?? product?.stockQuantity);
  const hasExplicitStock = rawStock !== undefined && rawStock !== null;
  const availableStock = hasExplicitStock ? Math.max(0, parseInt(rawStock, 10) || 0) : Number.POSITIVE_INFINITY;
  const inStock = (product?.inStock !== false) && (hasExplicitStock ? availableStock > 0 : true);

  const calculateSavings = (originalPrice, salePrice) => {
    if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={12} className="text-warning fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={12} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  const currentPrice = parseFloat(selectedVariant?.salePrice || selectedVariant?.price || product?.salePrice || product?.price) || 0;
  const originalPrice = parseFloat(selectedVariant?.originalPrice || product?.originalPrice) || 0;
  const savings = calculateSavings(originalPrice, currentPrice);


  // Always use selected variant if available
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!inStock || availableStock <= 0) {
      alert('This product is out of stock');
      return;
    }
    let cartItem;
    if (selectedVariant) {
      const formatVariantLabel = (variant) => {
        if (!variant) return null;
        if (variant.weight) return variant.weight;
        if (variant.weightValue) return `${variant.weightValue}${variant.weightUnit || ''}`;
        if (variant.size) return variant.size;
        if (variant.label) return variant.label;
        if (variant.volume) return variant.volume;
        if (variant.capacity) return variant.capacity;
        return null;
      };
      const variantLabel = formatVariantLabel(selectedVariant) || 'Default';
      cartItem = {
        id: selectedVariant.id || `${product.id}-${variantLabel}`,
        productId: product.id,
        variantId: selectedVariant.id,
        name: product.name,
        price: selectedVariant.salePrice || selectedVariant.price,
        originalPrice: selectedVariant.originalPrice || selectedVariant.price,
        image: product.image,
        variant: variantLabel,
        category: product.category,
        brand: product.brand,
        weightValue: selectedVariant.weightValue,
        weightUnit: selectedVariant.weightUnit,
        ...(hasExplicitStock ? { stockQuantity: availableStock } : {})
      };
    } else {
      let variantLabel = '';
      let variantId = null;
      let weightValue = null;
      let weightUnit = null;
      if (product?.variants?.[0]) {
        const v = product.variants[0];
        if (v.weight) variantLabel = v.weight;
        else if (v.weightValue) variantLabel = v.weightValue + (v.weightUnit || '');
        else if (v.id) variantLabel = `Variant #${v.id}`;
        else variantLabel = 'Default';
        variantId = v.id;
        weightValue = v.weightValue;
        weightUnit = v.weightUnit;
      } else {
        variantLabel = 'Default';
      }
      cartItem = {
        id: product.id,
        productId: product.id,
        variantId: variantId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        variant: variantLabel,
        category: product.category,
        brand: product.brand,
        weightValue: weightValue,
        weightUnit: weightUnit,
        ...(hasExplicitStock ? { stockQuantity: availableStock } : {})
      };
    }
    onAddToCart(product, selectedVariant, 1);
    console.log('Added to cart:', cartItem);
  };

  // Handle Add to Cart for products with variants
  const handleAddToCartWithVariant = (e) => {
    e.stopPropagation();
    if (!selectedVariant) return; // Ensure a variant is selected
    if (!inStock || availableStock <= 0) {
      alert('This product is out of stock');
      return;
    }

    const cartItem = {
      id: selectedVariant.id || `${product.id}-${selectedVariant.weight || selectedVariant.weightValue || ''}`,
      productId: product.id,
      name: product.name,
      price: selectedVariant.salePrice || selectedVariant.price,
      originalPrice: selectedVariant.originalPrice || selectedVariant.price,
      image: product.image, // Consider if variants have different images
      variant: selectedVariant.weight || (selectedVariant.weightValue + (selectedVariant.weightUnit || '')),
      category: product.category,
      brand: product.brand,
      ...(hasExplicitStock ? { stockQuantity: availableStock } : {})
    };
    onAddToCart(product, selectedVariant, 1);
    console.log('Added to cart:', cartItem);
  };

  const navigate = useNavigate();
  const handleCardClick = (e) => {
    // Prevent navigation if a button or link inside is clicked
    if (
      e.target.closest('button') ||
      e.target.closest('a') ||
      e.target.closest('input')
    ) {
      return;
    }
    navigate(`/product-detail-page/${product?.id}`);
  };
  return (
    <div
      className="group bg-card rounded-lg border border-border hover:shadow-warm-md transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(e); }}
      style={{ outline: 'none' }}
    >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={product?.image}
            alt={product?.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
          />
          {/* Loading Skeleton */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product?.badges?.map((badge, index) => (
              <span
                key={index}
                className="bg-primary text-primary-foreground text-xs font-caption font-medium px-2 py-1 rounded-full"
              >
                {badge}
              </span>
            ))}
            {savings > 0 && (
              <span className="bg-destructive text-destructive-foreground text-xs font-caption font-bold px-2 py-1 rounded-full">
                {savings}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist(product?.id);
            }}
            className="absolute top-2 right-2 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors duration-200 opacity-0 group-hover:opacity-100"
          >
            <Icon 
              name="Heart" 
              size={16} 
              className={isInWishlist ? 'text-destructive fill-current' : 'text-muted-foreground'} 
            />
          </button>

          {/* Quick View Button */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => { e.preventDefault(); onQuickView(product); }}
              className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            >
              Quick View
            </Button>
          </div>
        </div>
        {/* Product Info */}
        <div className="p-4 space-y-3 flex-grow flex flex-col">
          {/* Product Name */}
          <h3 className="font-body font-medium text-foreground hover:text-primary transition-colors duration-200 line-clamp-2 min-h-[2.5rem]">
            {product?.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(product?.rating)}
            </div>
            <span className="font-caption text-xs text-muted-foreground">
              ({product?.reviewCount})
            </span>
          </div>

          <div className="flex-grow space-y-3">
            {/* Variant Selection */}
            {product?.variants && product?.variants?.length > 1 ? (
              <div className="space-y-2">
                <span className="font-caption text-xs text-muted-foreground">Weight:</span>
                <div className="flex flex-wrap gap-1">
                  {product?.variants?.map((variant, index) => (
                    <button
                      key={index}
                      onClick={(e) => { e.preventDefault(); setSelectedVariant(variant); }}
                      className={`px-2 py-1 text-xs font-caption rounded border transition-colors duration-200 ${
                        selectedVariant?.weight === variant?.weight
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:border-primary'
                      }`}
                    >
                      {variant?.weight || (variant?.weightValue + (variant?.weightUnit || ''))}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="font-caption text-xs text-muted-foreground">Weight:</span>
                <div className="font-caption text-sm text-foreground">
                  {selectedVariant?.weight || (selectedVariant?.weightValue + (selectedVariant?.weightUnit || '')) || 'N/A'}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
              <span className="font-data font-bold text-lg text-foreground">
                ₹{(parseFloat(selectedVariant?.salePrice || selectedVariant?.price || product?.salePrice || product?.price) || 0).toFixed(2)}
              </span>
              {originalPrice && originalPrice > currentPrice && (
                <span className="font-data text-sm text-muted-foreground line-through">
                  ₹{originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <div className="flex items-center justify-between">
                <span className="font-caption text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                  {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
                </span>
                <p className="font-caption text-xs text-success font-medium">
                  You save ₹{(originalPrice - currentPrice)?.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-auto">
          <Button
            variant="default"
            fullWidth
            onClick={selectedVariant ? handleAddToCartWithVariant : handleAddToCart}
            disabled={!inStock}
            iconName="ShoppingCart"
            iconPosition="left"
            iconSize={16}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;