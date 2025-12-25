import { useState, useEffect, useCallback } from 'react';
import categoryApi from '../services/categoryApi';
import productApi from '../services/productApi';

/**
 * Custom hook for managing categories data
 * Fetches categories from backend and enriches with product information
 */
export const useCategoriesData = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
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

      // Process and enrich categories
      const enrichedCategories = categoriesData.map(category => {
        const categoryName = category.name || category.categoryName;
        if (!categoryName) return null;

        // Find products in this category
        const categoryProducts = productsData.filter(product => {
          const productCategory = product.category || product.categoryId;
          return productCategory && productCategory.toLowerCase() === categoryName.toLowerCase();
        });

        return {
          id: category.id,
          name: categoryName,
          displayName: formatCategoryName(categoryName),
          description: generateCategoryDescription(categoryName),
          productCount: categoryProducts.length,
          products: categoryProducts,
          slug: categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          // Get first product image as category image
          image: getCategoryImage(categoryProducts)
        };
      }).filter(cat => cat !== null);

      setCategories(enrichedCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getCategoryImage = (products) => {
    // Try to find a good image from products
    for (const product of products) {
      const image = product.imageUrl || product.image || product.image_path || product.thumbnailUrl;
      if (image && image !== '/assets/images/no_image.png') {
        return image;
      }
    }
    return '/assets/images/default-category.jpg';
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
      'papads': 'Hand-rolled papads and traditional snacks made with care',
      'sweets': 'Traditional Indian sweets made with authentic ingredients',
      'snacks': 'Healthy traditional snacks and savory items'
    };

    const key = categoryName.toLowerCase().replace(/\s+/g, '-');
    return descriptions[key] || `Discover our premium ${formatCategoryName(categoryName).toLowerCase()} collection`;
  };

  const getCategoryByName = useCallback((name) => {
    return categories.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase() ||
      cat.slug === name.toLowerCase()
    );
  }, [categories]);

  const getCategoriesWithProducts = useCallback((minProducts = 1) => {
    return categories.filter(cat => cat.productCount >= minProducts);
  }, [categories]);

  const searchCategories = useCallback((query) => {
    if (!query) return categories;
    
    const lowercaseQuery = query.toLowerCase();
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(lowercaseQuery) ||
      cat.displayName.toLowerCase().includes(lowercaseQuery) ||
      cat.description.toLowerCase().includes(lowercaseQuery)
    );
  }, [categories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategoryByName,
    getCategoriesWithProducts,
    searchCategories
  };
};