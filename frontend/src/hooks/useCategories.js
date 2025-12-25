import { useState, useEffect, useCallback } from 'react';
import categoryApi from '../services/categoryApi';

/**
 * Custom hook for managing categories throughout the application
 * Provides centralized category state management with caching
 */
export const useCategories = (options = {}) => {
  const {
    autoFetch = true,
    enableCache = true,
    cacheTimeout = 5 * 60 * 1000, // 5 minutes
    includeProductCount = true,
    transformCategories = null
  } = options;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Check if cache is still valid
  const isCacheValid = useCallback(() => {
    if (!enableCache || !lastFetch) return false;
    return Date.now() - lastFetch < cacheTimeout;
  }, [enableCache, lastFetch, cacheTimeout]);

  // Fetch categories from API
  const fetchCategories = useCallback(async (forceRefresh = false) => {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && isCacheValid() && categories.length > 0) {
      return categories;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await categoryApi.getAll();
      let categoriesData = response?.data || response || [];

      // Apply custom transformation if provided
      if (transformCategories && typeof transformCategories === 'function') {
        categoriesData = transformCategories(categoriesData);
      } else {
        // Default transformation
        categoriesData = categoriesData.map(category => ({
          id: category.id || category.name?.toLowerCase().replace(/\s+/g, '-'),
          name: category.name || category.categoryName,
          description: category.description || `Quality ${category.name} products`,
          productCount: includeProductCount ? (category.productCount || 0) : undefined,
          image: category.image || category.imageUrl,
          isActive: category.isActive !== false,
          featured: category.featured || false,
          slug: category.slug || category.name?.toLowerCase().replace(/\s+/g, '-'),
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        }));
      }

      setCategories(categoriesData);
      setLastFetch(Date.now());
      return categoriesData;

    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to load categories');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isCacheValid, categories, transformCategories, includeProductCount]);

  // Get category by ID or name
  const getCategoryBy = useCallback((field, value) => {
    return categories.find(cat => {
      if (field === 'id') return cat.id === value;
      if (field === 'name') return cat.name?.toLowerCase() === value?.toLowerCase();
      if (field === 'slug') return cat.slug === value;
      return false;
    });
  }, [categories]);

  // Get categories by criteria
  const getCategoriesBy = useCallback((criteria) => {
    return categories.filter(cat => {
      if (criteria.featured !== undefined && cat.featured !== criteria.featured) return false;
      if (criteria.isActive !== undefined && cat.isActive !== criteria.isActive) return false;
      if (criteria.minProductCount && cat.productCount < criteria.minProductCount) return false;
      if (criteria.nameContains && !cat.name?.toLowerCase().includes(criteria.nameContains.toLowerCase())) return false;
      return true;
    });
  }, [categories]);

  // Get featured categories
  const getFeaturedCategories = useCallback(() => {
    return getCategoriesBy({ featured: true, isActive: true });
  }, [getCategoriesBy]);

  // Search categories
  const searchCategories = useCallback((query) => {
    if (!query) return categories;
    
    const lowercaseQuery = query.toLowerCase();
    return categories.filter(cat => 
      cat.name?.toLowerCase().includes(lowercaseQuery) ||
      cat.description?.toLowerCase().includes(lowercaseQuery)
    );
  }, [categories]);

  // Add new category (admin function)
  const addCategory = useCallback(async (categoryData) => {
    try {
      setLoading(true);
      const response = await categoryApi.add(categoryData);
      const newCategory = response?.data || response;
      
      // Update local state
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error('Error adding category:', err);
      setError(err.message || 'Failed to add category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update category (admin function)
  const updateCategory = useCallback(async (categoryId, updateData) => {
    try {
      setLoading(true);
      const response = await categoryApi.update(categoryId, updateData);
      const updatedCategory = response?.data || response;
      
      // Update local state
      setCategories(prev => 
        prev.map(cat => cat.id === categoryId ? { ...cat, ...updatedCategory } : cat)
      );
      return updatedCategory;
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.message || 'Failed to update category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete category (admin function)
  const deleteCategory = useCallback(async (categoryId) => {
    try {
      setLoading(true);
      await categoryApi.remove(categoryId);
      
      // Update local state
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Failed to delete category');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh categories
  const refreshCategories = useCallback(() => {
    return fetchCategories(true);
  }, [fetchCategories]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [fetchCategories, autoFetch]);

  return {
    // State
    categories,
    loading,
    error,
    lastFetch,
    
    // Actions
    fetchCategories,
    refreshCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Getters
    getCategoryBy,
    getCategoriesBy,
    getFeaturedCategories,
    searchCategories,
    
    // Utils
    isCacheValid: isCacheValid()
  };
};

// Specific hook variants for common use cases
export const useFeaturedCategories = () => {
  return useCategories({
    transformCategories: (categories) => categories.filter(cat => cat.featured === true)
  });
};

export const useActiveCategoriesOnly = () => {
  return useCategories({
    transformCategories: (categories) => categories.filter(cat => cat.isActive !== false)
  });
};

export const useCategoriesWithMinProducts = (minCount = 1) => {
  return useCategories({
    transformCategories: (categories) => categories.filter(cat => (cat.productCount || 0) >= minCount)
  });
};