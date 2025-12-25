import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProductImageGallery from './components/ProductImageGallery';
import ProductInfo from './components/ProductInfo';
import ProductDetails from './components/ProductDetails';
import ProductFAQ from './components/ProductFAQ';
import ProductReviews from './components/ProductReviews';
import RelatedProducts from './components/RelatedProducts';
import productApi from '../../services/productApi';
import dataService from '../../services/dataService';
import apiClient from '../../services/api';
import { resolveImageUrl } from '../../lib/resolveImageUrl';

const ProductDetailPage = () => {
  const [searchParams] = useSearchParams();
  const { id: urlParamId } = useParams();
  const productId = urlParamId || searchParams?.get('id') || '1';
  
  const { cartItems, addToCart, addToWishlist, removeFromWishlist, isInWishlist, getCartItemCount } = useCart();

  // State for product data
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Load product data from database
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching product details for ID:', productId);
        
        // Try to fetch from backend API first
        let productData = null;
        try {
          productData = await productApi.getById(productId);
          console.log('Successfully loaded product from API:', productData);
          console.log('Product image data:', {
            images: productData?.images,
            gallery: productData?.gallery,
            image: productData?.image,
            imageUrl: productData?.imageUrl,
            image_path: productData?.image_path,
            thumbnailUrl: productData?.thumbnailUrl
          });
        } catch (apiError) {
          console.warn('Backend API failed, falling back to local data:', apiError?.message);
          
          // Fallback to hardcoded data from dataService
          const response = await dataService.getProducts();
          const products = response?.data || [];
          productData = products.find(p => p.id === productId || p.id === parseInt(productId));
          
          if (!productData) {
            throw new Error(`Product with ID ${productId} not found`);
          }
          console.log('Loaded product from fallback data:', productData);
          console.log('Fallback product image data:', {
            images: productData?.images,
            gallery: productData?.gallery,
            image: productData?.image,
            imageUrl: productData?.imageUrl,
            image_path: productData?.image_path,
            thumbnailUrl: productData?.thumbnailUrl
          });
        }

        // Normalize product data to expected format
        const normalizedVariants = Array.isArray(productData?.variants) && productData.variants.length > 0
          ? productData.variants.map((v, idx) => ({
              ...v,
              id: v?.id ?? `variant-${idx}`,
              weight: v?.weight || (v?.weightValue ? `${v.weightValue}${v.weightUnit || ''}` : 'Default'),
              stockQuantity: v?.stockQuantity ?? v?.stock ?? 0
            }))
          : [
              {
                id: 'default',
                weight: productData?.weightValue ? `${productData.weightValue}${productData.weightUnit || ''}` : (productData?.weight || 'Default'),
                weightValue: productData?.weightValue,
                weightUnit: productData?.weightUnit,
                price: productData?.price || productData?.salePrice || 0,
                originalPrice: productData?.originalPrice || productData?.mrp || productData?.price || 0,
                stock: productData?.stockQuantity ?? productData?.stock ?? 0,
                stockQuantity: productData?.stockQuantity ?? productData?.stock ?? 0
              }
            ];

        const normalizedProduct = {
          id: productData?.id,
          name: productData?.name || productData?.title,
          shortDescription: productData?.shortDescription || productData?.description?.substring(0, 100) + '...',
          description: productData?.description || 'No description available.',
          images: (() => {
            // Only use actual backend image data, no fallback images
            if (productData?.images && Array.isArray(productData.images) && productData.images.length > 0) {
              return productData.images.map(resolveImageUrl).filter(Boolean);
            }
            if (productData?.gallery && Array.isArray(productData.gallery) && productData.gallery.length > 0) {
              return productData.gallery.map(resolveImageUrl).filter(Boolean);
            }
            if (productData?.imageUrl && productData.imageUrl.trim() !== '') {
              return [resolveImageUrl(productData.imageUrl)].filter(Boolean);
            }
            if (productData?.image && productData.image.trim() !== '') {
              return [resolveImageUrl(productData.image)].filter(Boolean);
            }
            if (productData?.image_path && productData.image_path.trim() !== '') {
              return [resolveImageUrl(productData.image_path)].filter(Boolean);
            }
            if (productData?.thumbnailUrl && productData.thumbnailUrl.trim() !== '') {
              return [resolveImageUrl(productData.thumbnailUrl)].filter(Boolean);
            }
            // Return empty array if no actual image data found
            return [];
          })(),
          variants: normalizedVariants,
          badges: productData?.badges || [],
          // Parse features from description - everything after "Key Features:" or similar
          features: (() => {
            if (productData?.features && Array.isArray(productData.features)) {
              return productData.features;
            }
            // Try to extract features from description
            const desc = productData?.description || '';
            const featuresMatch = desc.match(/(?:key features?|features?):\s*([\s\S]*?)(?:\n\n|$)/i);
            if (featuresMatch) {
              return featuresMatch[1]
                .split(/\n|\*|•|-/)
                .map(f => f.trim())
                .filter(f => f && f.length > 0);
            }
            return [];
          })(),
          
          // Parse ingredients from backend string format
          ingredients: (() => {
            const ingredientsStr = productData?.ingredients || '';
            if (!ingredientsStr || typeof ingredientsStr !== 'string') {
              return {
                description: "Ingredient information not available.",
                primary: [],
                spices: []
              };
            }
            
            // Parse comma-separated ingredients
            const ingredientList = ingredientsStr
              .split(',')
              .map(item => item.trim())
              .filter(item => item.length > 0);
            
            return {
              description: ingredientsStr,
              primary: ingredientList,
              spices: [] // Keep empty as admin doesn't separate spices
            };
          })(),
          
          // Parse benefits from backend string format  
          benefits: (() => {
            const benefitsStr = productData?.benefits || '';
            if (!benefitsStr || typeof benefitsStr !== 'string') {
              return [];
            }
            
            // Parse comma-separated benefits
            return benefitsStr
              .split(',')
              .map(item => item.trim())
              .filter(item => item.length > 0);
          })(),
          nutrition: productData?.nutrition || {},
          rating: productData?.rating || productData?.ratingValue || 0,
          reviewCount: productData?.reviewCount || 0,
          category: productData?.category || productData?.categoryId,
          brand: productData?.brand || productData?.manufacturer || 'Sanatana Parampare'
        };

        setProduct(normalizedProduct);

        // Load related products (same category, excluding current)
        try {
          const all = await productApi.getAll();
          const items = Array.isArray(all) ? all : [];
          const sameCategory = items
            .filter(p => (p?.category || p?.categoryId) === normalizedProduct.category && p?.id !== normalizedProduct.id)
            .slice(0, 8);

          // Normalize for RelatedProducts card structure
          const normalizedRelated = sameCategory.map(p => {
            const relatedVariants = Array.isArray(p?.variants) && p.variants.length > 0
              ? p.variants.map((v, idx) => ({
                  ...v,
                  id: v?.id ?? `variant-${idx}`,
                  weight: v?.weight || (v?.weightValue ? `${v.weightValue}${v.weightUnit || ''}` : 'Default')
                }))
              : [
                  {
                    id: 'default',
                    weight: p?.weightValue ? `${p.weightValue}${p.weightUnit || ''}` : (p?.weight || 'Default'),
                    price: parseFloat(p?.price ?? p?.salePrice ?? 0) || 0,
                    originalPrice: parseFloat(p?.originalPrice ?? p?.price ?? p?.salePrice ?? 0) || 0
                  }
                ];

            return {
              id: p?.id,
              name: p?.name || p?.title,
              image: resolveImageUrl(p?.image || p?.imageUrl || p?.thumbnailUrl),
              rating: p?.rating || 4.5,
              reviewCount: p?.reviewCount || 0,
              badges: p?.badges || [],
              variants: relatedVariants
            };
          });
          setRelatedProducts(normalizedRelated);
        } catch (e) {
          // Non-fatal if related fail; keep empty
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const breadcrumbItems = [
    { label: 'Home', path: '/homepage' },
    { label: 'Products', path: '/product-collection-grid' },
    { label: product?.category || 'Category', path: `/product-collection-grid?category=${encodeURIComponent(product?.category || '')}`},
    { label: product?.name || 'Product', path: `/product-detail-page?id=${productId}` }
  ];

  const handleAddToCart = (item) => {
    if (!product) return;
    
    // Use the item data directly - it has all the variant info already prepared by ProductInfo
    const productToAdd = {
      id: `${item?.productId}-${item?.variantId}`,
      productId: item?.productId,
      variantId: item?.variantId,
      name: item?.name || product?.name,
      variant: item?.weight,
      price: parseFloat(item?.price) || 0,
      originalPrice: parseFloat(item?.originalPrice) || parseFloat(item?.price) || 0,
      image: item?.image || product?.images?.[0],
      category: item?.category || product?.category,
      brand: item?.brand || product?.brand,
      stockQuantity: item?.stockQuantity,
      weightValue: item?.weightValue,
      weightUnit: item?.weightUnit
    };
    
    addToCart(productToAdd, item?.quantity || 1);
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    
    const isInWishlistStatus = isInWishlist(product?.id);
    
    if (isInWishlistStatus) {
      removeFromWishlist(product?.id);
    } else {
      const wishlistProduct = {
        id: product?.id,
        name: product?.name,
        image: product?.images?.[0],
        price: parseFloat(product?.variants?.[0]?.price) || 0
      };
      addToWishlist(wishlistProduct);
    }
  };

  const isProductInWishlist = product ? isInWishlist(product?.id) : false;
  const averageRating = product?.rating || 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          cartItemCount={getCartItemCount()}
          cartItems={cartItems}
          onSearch={() => {}}
        />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading product details...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          cartItemCount={getCartItemCount()}
          cartItems={cartItems}
          onSearch={() => {}}
        />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-destructive mb-4">Error loading product: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          cartItemCount={getCartItemCount()}
          cartItems={cartItems}
          onSearch={() => {}}
        />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Product not found</p>
              <a 
                href="/product-collection-grid" 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Browse Products
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={getCartItemCount()}
        cartItems={cartItems}
        onSearch={() => {}}
      />
      <main className="container mx-auto px-4 py-6">
        <Breadcrumb customItems={breadcrumbItems} />
        
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductImageGallery 
              images={product?.images}
              productName={product?.name}
            />
          </div>
          
          {/* Product Information */}
          <div>
            <ProductInfo
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              isInWishlist={isProductInWishlist}
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="mb-12">
          <ProductDetails product={product} />
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <ProductFAQ faqs={[]} />
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <ProductReviews
            reviews={[]}
            averageRating={averageRating}
            totalReviews={0}
          />
        </div>

        {/* Related Products */}
        <div className="mb-12">
          <RelatedProducts
            products={relatedProducts}
            onAddToCart={handleAddToCart}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;