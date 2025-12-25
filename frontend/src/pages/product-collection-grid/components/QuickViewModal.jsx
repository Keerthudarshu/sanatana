import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !product) return null;

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
        <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={16} className="text-warning fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  const currentPrice = selectedVariant?.salePrice || selectedVariant?.price || product?.salePrice || product?.price;
  const originalPrice = selectedVariant?.originalPrice || selectedVariant?.price || product?.originalPrice || product?.price;
  const savings = calculateSavings(originalPrice, currentPrice);

  const productImages = product?.gallery || [product?.image];

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariant, quantity);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[1004]"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-card rounded-lg shadow-warm-xl z-[1004] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-heading font-semibold text-lg text-foreground">
              Quick View
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors duration-200"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={productImages?.[selectedImageIndex]}
                    alt={product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {productImages?.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {productImages?.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                          selectedImageIndex === index
                            ? 'border-primary' :'border-border hover:border-primary/50'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product?.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                {/* Product Name & Rating */}
                <div className="space-y-3">
                  <h1 className="font-heading font-bold text-2xl text-foreground">
                    {product?.name}
                  </h1>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {renderStars(product?.rating)}
                    </div>
                    <span className="font-caption text-sm text-muted-foreground">
                      ({product?.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Badges */}
                {product?.badges && product?.badges?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product?.badges?.map((badge, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary text-sm font-caption font-medium px-3 py-1 rounded-full border border-primary/20"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-data font-bold text-3xl text-foreground">
                      ₹{currentPrice}
                    </span>
                    {originalPrice && originalPrice > currentPrice && (
                      <span className="font-data text-xl text-muted-foreground line-through">
                        ₹{originalPrice}
                      </span>
                    )}
                    {savings > 0 && (
                      <span className="bg-success text-success-foreground text-sm font-caption font-bold px-2 py-1 rounded-full">
                        {savings}% OFF
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <p className="font-caption text-success">
                      You save ₹{originalPrice - currentPrice}
                    </p>
                  )}
                </div>

                {/* Variant Selection */}
                {product?.variants && product?.variants?.length > 1 && (
                  <div className="space-y-3">
                    <h3 className="font-body font-semibold text-foreground">
                      Weight Options:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product?.variants?.map((variant, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-4 py-2 font-caption rounded-lg border transition-colors duration-200 ${
                            selectedVariant?.weight === variant?.weight
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background text-foreground hover:border-primary'
                          }`}
                        >
                          {variant?.weight || (variant?.weightValue ? variant.weightValue + (variant.weightUnit || '') : '')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="space-y-3">
                  <h3 className="font-body font-semibold text-foreground">
                    Quantity:
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors duration-200"
                    >
                      <Icon name="Minus" size={16} />
                    </button>
                    <span className="font-data font-semibold text-lg w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors duration-200"
                    >
                      <Icon name="Plus" size={16} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {product?.shortDescription && (
                  <div className="space-y-2">
                    <h3 className="font-body font-semibold text-foreground">
                      Description:
                    </h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      {product?.shortDescription}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="default"
                    fullWidth
                    onClick={handleAddToCart}
                    iconName="ShoppingCart"
                    iconPosition="left"
                  >
                    Add to Cart - ₹{(currentPrice * quantity)?.toFixed(2)} {selectedVariant?.weight || (selectedVariant?.weightValue ? selectedVariant.weightValue + (selectedVariant.weightUnit || '') : '')}
                  </Button>
                  
                  <Link to={`/product-detail-page?id=${product?.id}`}>
                    <Button variant="outline" fullWidth onClick={onClose}>
                      View Full Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickViewModal;