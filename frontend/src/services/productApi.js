import apiClient from './api';

const productApi = {
  async getAll(params = {}) {
    try {
      console.log('ProductAPI: Fetching all products with params:', params);
      const res = await apiClient.get('/products', { params }); // Use public endpoint
      console.log('ProductAPI: Successfully fetched products:', res.data?.length || 0);
      return res.data;
    } catch (error) {
      console.error('ProductAPI: Failed to fetch products:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Provide meaningful error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch products';
      
      throw new Error(`Unable to load products: ${errorMessage}`);
    }
  },

  // Public method for getting products with category filtering
  async getByCategory(categoryName, params = {}) {
    try {
      console.log('ProductAPI: Fetching products by category:', categoryName);
      const queryParams = { category: categoryName, ...params };
      const res = await apiClient.get('/products', { params: queryParams });
      console.log('ProductAPI: Successfully fetched products for category:', categoryName, res.data?.length || 0);
      return res.data;
    } catch (error) {
      console.error('ProductAPI: Failed to fetch products by category:', {
        category: categoryName,
        message: error.message,
        status: error.response?.status
      });
      throw new Error(`Unable to load products for category: ${categoryName}`);
    }
  },

  // Public method for searching products
  async search(query, params = {}) {
    try {
      console.log('ProductAPI: Searching products:', query);
      const queryParams = { search: query, ...params };
      const res = await apiClient.get('/products', { params: queryParams });
      console.log('ProductAPI: Search results:', res.data?.length || 0);
      return res.data;
    } catch (error) {
      console.error('ProductAPI: Failed to search products:', {
        query,
        message: error.message,
        status: error.response?.status
      });
      throw new Error(`Unable to search products: ${query}`);
    }
  },

  async getById(productId) {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      
      console.log('ProductAPI: Fetching product by ID:', productId);
      const res = await apiClient.get(`/products/${productId}`); // Use public endpoint
      console.log('ProductAPI: Successfully fetched product:', res.data?.name || res.data?.id);
      return res.data;
    } catch (error) {
      console.error('ProductAPI: Failed to fetch product by ID:', productId, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 404) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch product';
      
      throw new Error(`Unable to load product: ${errorMessage}`);
    }
  },

  async add(productPayload) {
    try {
      if (!productPayload) {
        throw new Error('Product data is required');
      }
      
      console.log('ProductAPI: Adding new product:', productPayload.name || 'Unnamed Product');
      const res = await apiClient.post('/admin/products', productPayload);
      console.log('ProductAPI: Successfully added product:', res.data?.id);
      return res.data;
    } catch (error) {
      console.error('ProductAPI: Failed to add product:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        payload: productPayload
      });
      
      if (error.response?.status === 400) {
        const validationErrors = error.response?.data?.errors || error.response?.data?.message;
        throw new Error(`Invalid product data: ${validationErrors || 'Please check all required fields'}`);
      }
      
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to add products');
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to add product';
      
      throw new Error(`Unable to add product: ${errorMessage}`);
    }
  },

  async update(productId, productPayload) {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      if (!productPayload) {
        throw new Error('Product data is required');
      }
      
      console.log('ProductAPI: Updating product:', productId, productPayload.name || 'Unnamed Product');
      const res = await apiClient.put(`/admin/products/${productId}`, productPayload);
      console.log('ProductAPI: Successfully updated product:', productId);
      return res.data;
    } catch (error) {
      console.error('ProductAPI: Failed to update product:', productId, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        payload: productPayload
      });
      
      if (error.response?.status === 404) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      
      if (error.response?.status === 400) {
        const validationErrors = error.response?.data?.errors || error.response?.data?.message;
        throw new Error(`Invalid product data: ${validationErrors || 'Please check all required fields'}`);
      }
      
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to update products');
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update product';
      
      throw new Error(`Unable to update product: ${errorMessage}`);
    }
  },

  async remove(productId) {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      
      console.log('ProductAPI: Removing product:', productId);
      const res = await apiClient.delete(`/admin/products/${productId}`);
      console.log('ProductAPI: Successfully removed product:', productId);
      return res.data;
    } catch (error) {
      console.error('ProductAPI: Failed to remove product:', productId, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.status === 404) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to delete products');
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to delete product';
      
      throw new Error(`Unable to delete product: ${errorMessage}`);
    }
  },

  // Admin-specific methods (these use admin endpoints)
  admin: {
    async getAll(params = {}) {
      try {
        console.log('ProductAPI Admin: Fetching all products with params:', params);
        const res = await apiClient.get('/admin/products', { params });
        console.log('ProductAPI Admin: Successfully fetched products:', res.data?.length || 0);
        return res.data;
      } catch (error) {
        console.error('ProductAPI Admin: Failed to fetch products:', error);
        throw new Error('Unable to load products for admin');
      }
    },

    async getById(productId) {
      try {
        const res = await apiClient.get(`/admin/products/${productId}`);
        return res.data;
      } catch (error) {
        console.error('ProductAPI Admin: Failed to fetch product:', productId, error);
        throw new Error(`Unable to load product: ${productId}`);
      }
    },

    async create(productPayload) {
      try {
        const res = await apiClient.post('/admin/products', productPayload);
        return res.data;
      } catch (error) {
        console.error('ProductAPI Admin: Failed to create product:', error);
        throw new Error('Unable to create product');
      }
    },

    async update(productId, productPayload) {
      try {
        const res = await apiClient.put(`/admin/products/${productId}`, productPayload);
        return res.data;
      } catch (error) {
        console.error('ProductAPI Admin: Failed to update product:', productId, error);
        throw new Error('Unable to update product');
      }
    },

    async delete(productId) {
      try {
        const res = await apiClient.delete(`/admin/products/${productId}`);
        return res.data;
      } catch (error) {
        console.error('ProductAPI Admin: Failed to delete product:', productId, error);
        throw new Error('Unable to delete product');
      }
    }
  }
};

export default productApi;
