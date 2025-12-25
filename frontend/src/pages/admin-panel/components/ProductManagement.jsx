import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import dataService from '../../../services/dataService';
import productApi from '../../../services/productApi';
import apiClient from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import ProductForm from './ProductForm';
import { resolveImageUrl } from '../../../lib/resolveImageUrl';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online', 'offline', 'checking'

  // Check backend connectivity
  const checkBackendHealth = async () => {
    try {
      await apiClient.get('/categories');
      setBackendStatus('online');
      return true;
    } catch (error) {
      console.warn('Backend health check failed:', error);
      setBackendStatus('offline');
      return false;
    }
  };

  // Handle image load errors
  const handleImageError = (e, productName) => {
    console.warn(`Image failed to load for product: ${productName}`, e.target.src);
    e.target.src = '/assets/images/no_image.png';
  };

  useEffect(() => {
    const initializeData = async () => {
      await checkBackendHealth();
      await loadProducts();
    };
    initializeData();
  }, []);

  const loadProducts = async (retryCount = 0) => {
    try {
      setLoading(true);
      // Load products from backend API
      let apiProducts = [];
      try {
        console.log('Admin Panel: Fetching products from backend API...');
        const response = await productApi.admin.getAll();
        // Spring Boot API returns array directly (not response.data)
        apiProducts = Array.isArray(response) ? response : [];
        console.log('Admin Panel: Successfully loaded products from API:', apiProducts.length);
      } catch (apiError) {
        console.warn('Admin Panel: Backend API failed:', apiError?.message);
        
        // Retry once if it's a network error and this is the first attempt
        if (retryCount < 1 && (apiError?.message?.includes('Network Error') || apiError?.code === 'ERR_NETWORK')) {
          console.log('Admin Panel: Retrying API call...');
          setTimeout(() => loadProducts(retryCount + 1), 2000);
          return;
        }
        
        // Fallback to hardcoded data from dataService
        const fallbackResponse = await dataService.getProducts();
        apiProducts = fallbackResponse?.data || [];
        console.log('Admin Panel: Loaded products from fallback data:', apiProducts.length);
      }

      // Normalize backend products for admin panel
      const normalizedProducts = apiProducts.map((p) => ({
        id: p?.id,
        name: p?.name || p?.title || 'Unnamed Product',
        category: p?.category || p?.categoryId || p?.subcategory || 'misc',
        subcategory: p?.subcategory,
        brand: p?.brand || p?.manufacturer || 'Brand',
        price: p?.price ?? p?.salePrice ?? p?.mrp ?? 0,
        originalPrice: p?.originalPrice ?? p?.mrp ?? p?.price ?? 0,
        rating: p?.rating ?? p?.ratingValue ?? 0,
        image: resolveImageUrl(p?.imageUrl),
        imageUrl: p?.imageUrl || null, // keep original relative URL for edit form
        description: p?.description || 'No description available',
        inStock: p?.inStock !== false, // Default to true if not specified
        weight: p?.weight || 'N/A',
        stockQuantity: p?.stockQuantity ?? p?.quantity ?? 0,
        variants: p?.variants || [] // Include variants array for edit form
      }));

      setProducts(normalizedProducts);
    } catch (error) {
      console.error('Admin Panel: Error loading products:', error);
      // Set empty array as fallback
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = (products || []).filter(product => {
    const matchesSearch = (product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product?.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    const confirmMessage = 'Are you sure you want to delete this product? This will permanently remove the product and all its related data (cart items, order history, wishlist entries).';
    
    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);
        await dataService.deleteProduct(productId);
        console.log('Product deleted successfully:', productId);
        await loadProducts(); // Reload products after successful deletion
      } catch (error) {
        console.error('Error deleting product:', error);
        
        // Show user-friendly error message
        if (error.message?.includes('Internal Server Error')) {
          alert('Server error occurred while deleting the product. Please try again or contact support.');
        } else if (error.message?.includes('404')) {
          alert('Product not found. It may have already been deleted.');
          await loadProducts(); // Refresh the list
        } else {
          alert('Failed to delete product: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleProductSaved = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await dataService.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-heading font-bold text-foreground">Product Management</h1>
            <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
              backendStatus === 'online' ? 'bg-green-100 text-green-800' : 
              backendStatus === 'offline' ? 'bg-red-100 text-red-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
             
        
            </div>
          </div>
          <p className="text-muted-foreground">
            Manage your product catalog
            {backendStatus === 'offline' && ' (Using local fallback data)'}
          </p>
        </div>
        <Button onClick={handleAddProduct} className="flex items-center space-x-2" disabled={loading}>
          <Plus size={20} />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
            >
              <option value="" key="all-categories">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category.id || category}>
                  {category.name || category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-square bg-muted relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, product.name)}
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors"
                >
                  <Edit size={16} className="text-primary" />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  disabled={loading}
                  className="p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} className="text-destructive" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-body font-medium text-foreground line-clamp-2 mb-2">
                {product.name}
              </h3>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-foreground">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{product.weight}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={`px-2 py-1 rounded-full ${
                  product.inStock ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleProductSaved}
          onCancel={() => setShowProductForm(false)}
        />
      )}
    </div>
  );
};

export default ProductManagement;