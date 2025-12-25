import React, { useState, useEffect } from 'react';
import categoryApi from '../../services/categoryApi';
import productApi from '../../services/productApi';

const CategoryApiTest = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    testCategoryApi();
  }, []);

  const testCategoryApi = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Testing categoryApi.getAll()...');
      const categoryResponse = await categoryApi.getAll();
      console.log('Categories Response:', categoryResponse);
      
      console.log('Testing productApi.getAll()...');
      const productResponse = await productApi.getAll();
      console.log('Products Response:', productResponse);

      setCategories(categoryResponse || []);
      setProducts(Array.isArray(productResponse) ? productResponse : (productResponse?.data || []));
    } catch (err) {
      console.error('API Test Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading API test...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Category API Test Results</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Categories ({categories.length})</h3>
        <div className="bg-gray-100 p-3 rounded">
          <pre>{JSON.stringify(categories, null, 2)}</pre>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Products ({products.length})</h3>
        <div className="bg-gray-100 p-3 rounded max-h-40 overflow-y-auto">
          <pre>{JSON.stringify(products.slice(0, 3), null, 2)}</pre>
          {products.length > 3 && <p className="mt-2 text-sm text-gray-600">...and {products.length - 3} more</p>}
        </div>
      </div>

      <button
        onClick={testCategoryApi}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Refresh Test
      </button>
    </div>
  );
};

export default CategoryApiTest;