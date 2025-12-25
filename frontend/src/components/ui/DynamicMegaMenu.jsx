import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from '../AppImage';
import categoryApi from '../../services/categoryApi';

const DynamicMegaMenu = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.getAll();
        const categoriesData = response?.data || response || [];
        
        // Group categories into main sections
        const groupedCategories = groupCategories(categoriesData);
        setCategories(groupedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to static categories
        setCategories(getStaticCategories());
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const groupCategories = (categoriesData) => {
    // Group categories by type (you can customize this logic)
    const grouped = {
      'Food Items': [],
      'Spices & Powders': [],
      'Personal Care': [],
      'Health & Wellness': []
    };

    categoriesData.forEach(category => {
      const name = category.name || category.categoryName;
      const categoryGroup = determineCategoryGroup(name);
      
      if (grouped[categoryGroup]) {
        grouped[categoryGroup].push({
          name: name,
          path: `/product-collection-grid?category=${encodeURIComponent(name)}`,
          productCount: category.productCount || 0
        });
      }
    });

    // Convert to array format for rendering
    return Object.entries(grouped).map(([title, items]) => ({
      title,
      items,
      image: getCategoryGroupImage(title)
    }));
  };

  const determineCategoryGroup = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('spice') || name.includes('powder') || name.includes('masala')) {
      return 'Spices & Powders';
    } else if (name.includes('oil') || name.includes('ghee') || name.includes('honey')) {
      return 'Food Items';
    } else if (name.includes('soap') || name.includes('hair') || name.includes('skin')) {
      return 'Personal Care';
    }
    return 'Health & Wellness';
  };

  const getCategoryGroupImage = (groupTitle) => {
    const imageMap = {
      'Food Items': '/assets/images/category-food.jpg',
      'Spices & Powders': '/assets/images/category-spices.jpg',
      'Personal Care': '/assets/images/category-personal-care.jpg',
      'Health & Wellness': '/assets/images/category-health.jpg'
    };
    return imageMap[groupTitle] || '/assets/images/default-category.jpg';
  };

  const getStaticCategories = () => {
    // Your existing static categories as fallback
    return [
      {
        title: 'Food Items',
        items: [
          { name: 'Wood Pressed Oils', path: '/product-collection-grid?category=wood-pressed-oils' },
          { name: 'Ghee & Honey', path: '/product-collection-grid?category=ghee-honey' }
        ],
        image: '/assets/images/category-food.jpg'
      }
      // ... other static categories
    ];
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[1001] lg:hidden"
        onClick={onClose}
      />
      
      {/* Mega Menu Content */}
      <div className="absolute top-full left-0 w-full bg-card shadow-warm-lg border-t border-border z-[1002]">
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Loading categories...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories?.map((category, index) => (
                <div key={index} className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={category?.image}
                      alt={category?.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-3">
                      {category?.title}
                    </h3>
                    <ul className="space-y-2">
                      {category?.items?.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            to={item?.path}
                            onClick={onClose}
                            className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1 flex justify-between items-center"
                          >
                            <span>{item?.name}</span>
                            {item?.productCount > 0 && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                {item.productCount}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DynamicMegaMenu;