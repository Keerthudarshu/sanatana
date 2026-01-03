import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import cartApi from '../services/cartApi';
import wishlistApi from '../services/wishlistApi';
import apiClient from '../services/api';
import { resolveImageUrl } from '../lib/resolveImageUrl';

const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Simple notification function
  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`;
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          ${type === 'success'
        ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>'
        : '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>'
      }
        </svg>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const { user } = useAuth();

  // Load cart from backend for logged-in users; fallback to local for guests
  useEffect(() => {
    const init = async () => {
      const savedForLater = localStorage.getItem('neenu_saved_items');
      const savedWishlist = localStorage.getItem('neenu_wishlist');
      if (savedForLater) {
        try {
          setSavedItems(JSON.parse(savedForLater));
        } catch { }
      }
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist));
        } catch { }
      }
      if (user?.email) {
        try {
          const serverCart = await cartApi.getCart(user.email);
          setCartItems(
            serverCart.map((ci) => ({
              id: ci.productId,
              name: ci.name,
              image: resolveImageUrl(ci.imageUrl || ci.image),
              price: ci.price,
              originalPrice: ci.originalPrice || ci.price,
              quantity: ci.quantity,
              variant: ci.variantName || 'Default',
              variantId: ci.variantId,
              weightValue: ci.weightValue,
              weightUnit: ci.weightUnit,
            }))
          );
        } catch {
          const savedCart = localStorage.getItem('neenu_cart');
          if (savedCart) {
            try {
              setCartItems(JSON.parse(savedCart));
            } catch { }
          }
        }
      } else {
        const savedCart = localStorage.getItem('neenu_cart');
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch { }
        }
      }
    };
    init();
  }, [user?.email]);

  // Save cart/saved/wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('neenu_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('neenu_saved_items', JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    localStorage.setItem('neenu_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Load wishlist from backend
  useEffect(() => {
    const loadWishlist = async () => {
      if (!user?.email) return;
      try {
        const items = await wishlistApi.getAll(user.email);
        const normalized = (items || []).map((it) => ({
          id: it.productId,
          name: it.productName,
          image: resolveImageUrl(it.productImage),
          price: it.productPrice,
          originalPrice: it.productPrice,
          inStock: it.inStock !== false,
          stockQuantity: it.stockQuantity ?? null,
          category: it.category,
          brand: it.brand,
          addedDate: it.createdAt,
        }));
        setWishlistItems(normalized);
      } catch {
        // silent fallback
      }
    };
    loadWishlist();
  }, [user?.email]);

  const addToCart = async (product, quantity = 1) => {
    const sanitizedProduct = {
      ...product,
      price: parseFloat(product.price) || 0,
      originalPrice: parseFloat(product.originalPrice) || parseFloat(product.price) || 0,
      quantity: parseInt(quantity) || 1,
    };

    const availableStock = sanitizedProduct.stock ?? sanitizedProduct.stockQuantity ?? null;
    if (availableStock !== null) {
      if (parseInt(availableStock) <= 0) {
        showNotification('This product is out of stock', 'error');
        return;
      }
      if (sanitizedProduct.quantity > parseInt(availableStock)) {
        showNotification('Stock limit exceeded', 'error');
        sanitizedProduct.quantity = parseInt(availableStock);
      }
    }

    // Extract numeric product ID from composite IDs like "2-default"
    const getNumericProductId = (id) => {
      if (typeof id === 'string' && id.includes('-')) {
        return parseInt(id.split('-')[0]);
      }
      return parseInt(id);
    };

    const productId = getNumericProductId(sanitizedProduct.productId || sanitizedProduct.id);
    const variantId = sanitizedProduct.variantId || 'default';

    if (user?.email) {
      try {
        const apiResponse = await cartApi.add(user.email, {
          productId: productId,
          quantity: sanitizedProduct.quantity,
          price: sanitizedProduct.price,
          variantId: sanitizedProduct.variantId,
          variant: sanitizedProduct.variant,
          weightValue: sanitizedProduct.weightValue,
          weightUnit: sanitizedProduct.weightUnit,
        });

        setCartItems((prev) => {
          const existingItem = prev.find(
            (item) =>
              getNumericProductId(item.productId || item.id) === productId &&
              (item.variantId || 'default') === variantId
          );
          if (existingItem) {
            showNotification(`Updated ${sanitizedProduct.name} quantity in cart!`);
            return prev.map((item) =>
              getNumericProductId(item.productId || item.id) === productId &&
                (item.variantId || 'default') === variantId
                ? {
                  ...item,
                  quantity: sanitizedProduct.quantity,
                  price: sanitizedProduct.price,
                  originalPrice: sanitizedProduct.originalPrice,
                  variant: apiResponse?.variantName || sanitizedProduct.variant || item.variant,
                  variantId: apiResponse?.variantId || sanitizedProduct.variantId || item.variantId,
                  weight: apiResponse?.variantName || sanitizedProduct.weight || item.weight,
                  weightValue: apiResponse?.weightValue || sanitizedProduct.weightValue || item.weightValue,
                  weightUnit: apiResponse?.weightUnit || sanitizedProduct.weightUnit || item.weightUnit,
                  stockQuantity: apiResponse?.stockQuantity ?? sanitizedProduct.stockQuantity ?? item.stockQuantity,
                }
                : item
            );
          } else {
            showNotification(`${sanitizedProduct.name} added to cart!`);
            return [
              ...prev,
              {
                id: `${productId}-${variantId}`,
                productId: productId,
                variantId: sanitizedProduct.variantId,
                name: sanitizedProduct.name,
                image: resolveImageUrl(sanitizedProduct.image || apiResponse.imageUrl),
                price: sanitizedProduct.price,
                originalPrice: sanitizedProduct.originalPrice,
                quantity: sanitizedProduct.quantity,
                variant: apiResponse?.variantName || sanitizedProduct.variant || 'Default',
                category: sanitizedProduct.category,
                brand: sanitizedProduct.brand,
                weight: apiResponse?.variantName || sanitizedProduct.weight,
                weightValue: apiResponse?.weightValue || sanitizedProduct.weightValue,
                weightUnit: apiResponse?.weightUnit || sanitizedProduct.weightUnit,
                stockQuantity: sanitizedProduct.stockQuantity,
              },
            ];
          }
        });
      } catch (error) {
        showNotification(error?.message || 'Failed to add to cart. Please try again.', 'error');
        return;
      }
    } else {
      // Guest user
      setCartItems((prev) => {
        const existingItem = prev.find(
          (item) =>
            getNumericProductId(item.productId || item.id) === productId &&
            (item.variantId || 'default') === variantId
        );
        const currentQty = existingItem ? parseInt(existingItem.quantity) || 0 : 0;
        const requestedQty = parseInt(quantity) || 1;
        let newQty = currentQty + requestedQty;
        if (availableStock !== null && newQty > parseInt(availableStock)) {
          showNotification('Stock limit exceeded', 'error');
          newQty = parseInt(availableStock);
        }

        if (existingItem) {
          showNotification(`Updated ${sanitizedProduct.name} quantity in cart!`);
          return prev.map((item) =>
            getNumericProductId(item.productId || item.id) === productId &&
              (item.variantId || 'default') === variantId
              ? { ...item, quantity: newQty }
              : item
          );
        } else {
          showNotification(`${sanitizedProduct.name} added to cart!`);
          return [
            ...prev,
            {
              id: `${productId}-${variantId}`,
              productId: productId,
              variantId: sanitizedProduct.variantId,
              name: sanitizedProduct.name,
              variant: sanitizedProduct.variant || 'Default',
              price: sanitizedProduct.price,
              originalPrice: sanitizedProduct.originalPrice,
              image: sanitizedProduct.image,
              category: sanitizedProduct.category,
              brand: sanitizedProduct.brand,
              weight: sanitizedProduct.weight,
              weightValue: sanitizedProduct.weightValue,
              weightUnit: sanitizedProduct.weightUnit,
              stockQuantity: sanitizedProduct.stockQuantity,
              quantity: Math.max(1, Math.min(requestedQty, availableStock ?? requestedQty)),
            },
          ];
        }
      });
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    // Extract productId and variantId from composite IDs like "2-default"
    const getIds = (id) => {
      if (typeof id === 'string' && id.includes('-')) {
        const [pid, vid] = id.split('-');
        return { productId: parseInt(pid), variantId: vid };
      }
      return { productId: parseInt(id), variantId: 'default' };
    };

    const { productId, variantId } = getIds(itemId);

    setCartItems((prev) =>
      prev.map((item) =>
        getIds(item.id).productId === productId && (getIds(item.id).variantId === variantId)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    if (user?.email) {
      try {
        await cartApi.update(user.email, { productId, variantId, quantity: newQuantity });
      } catch { }
    }
  };

  const removeFromCart = async (itemId) => {
    // Extract productId and variantId from composite IDs like "2-default"
    const getIds = (id) => {
      if (typeof id === 'string' && id.includes('-')) {
        const [pid, vid] = id.split('-');
        return { productId: parseInt(pid), variantId: vid };
      }
      return { productId: parseInt(id), variantId: 'default' };
    };

    const { productId, variantId } = getIds(itemId);

    setCartItems((prev) =>
      prev.filter((item) =>
        !(getIds(item.id).productId === productId && getIds(item.id).variantId === variantId)
      )
    );
    if (user?.email) {
      try {
        await cartApi.remove(user.email, { productId, variantId });
      } catch { }
    }
  };

  const saveForLater = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      setSavedItems((prev) => [...prev, { ...item, quantity: 1 }]);
      removeFromCart(itemId);
    }
  };

  const moveToCart = (item) => {
    addToCart(item, 1);
    setSavedItems((prev) => prev.filter((saved) => saved.id !== item.id));
  };

  const removeFromSaved = (itemId) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + price * quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + (parseInt(item.quantity) || 0), 0);
  };

  const addToWishlist = async (product) => {
    const already = wishlistItems.some((w) => w.id === product.id);
    if (already) {
      showNotification(`${product.name} is already in wishlist!`, 'error');
      return;
    }
    if (user?.email) {
      try {
        await wishlistApi.add(user.email, { productId: product.id });
        showNotification(`${product.name} added to wishlist!`);
        setWishlistItems((prev) => [...prev, { inStock: true, ...product }]);
        return;
      } catch (e) {
        showNotification(e?.message || 'Failed to add to wishlist', 'error');
        return;
      }
    }
    showNotification(`${product.name} added to wishlist!`);
    setWishlistItems((prev) => [...prev, { inStock: true, ...product }]);
  };

  const removeFromWishlist = async (productId) => {
    if (user?.email) {
      try {
        await wishlistApi.remove(user.email, { productId });
      } catch (e) {
        showNotification(e?.message || 'Failed to remove from wishlist', 'error');
      }
    }
    setWishlistItems((prev) => {
      const product = prev.find((item) => item.id === productId);
      if (product) {
        showNotification(`${product.name} removed from wishlist!`);
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const value = {
    cartItems,
    savedItems,
    wishlistItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    removeFromSaved,
    clearCart,
    getCartTotal,
    getCartItemCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
