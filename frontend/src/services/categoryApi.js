import apiClient from './api';

const categoryApi = {
  async getAll() {
    try {
      const res = await apiClient.get('/categories');
      console.log('CategoryAPI: Raw response:', res);
      console.log('CategoryAPI: Response data:', res.data);
      
      // Ensure we return an array and log each category
      const categories = Array.isArray(res.data) ? res.data : [];
      console.log('CategoryAPI: Processed categories:', categories);
      
      categories.forEach((cat, index) => {
        console.log(`CategoryAPI: Category ${index}:`, {
          id: cat?.id,
          name: cat?.name,
          full: cat
        });
      });
      
      return categories;
    } catch (error) {
      console.error('CategoryAPI: Error fetching categories:', error);
      throw error;
    }
  },
  async getById(categoryId) {
    const res = await apiClient.get(`/categories/${categoryId}`);
    return res.data;
  },
  async add(categoryPayload) {
    const res = await apiClient.post('/admin/categories', categoryPayload);
    return res.data;
  },
  async update(categoryId, categoryPayload) {
    const res = await apiClient.put(`/admin/categories/${categoryId}`, categoryPayload);
    return res.data;
  },
  async remove(categoryId) {
    const res = await apiClient.delete(`/admin/categories/${categoryId}`);
    return res.data;
  }
};

export default categoryApi;
