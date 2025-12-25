import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import categoryApi from '../../../services/categoryApi';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange, 
  onClearFilters,
  isMobile = false,
  products = [] // Add products prop to calculate counts
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    dietary: true,
    category: true,
    brand: true
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const priceRanges = [
    { id: 'under-200', label: 'Under ₹200', min: 0, max: 200 },
    { id: '200-500', label: '₹200 - ₹500', min: 200, max: 500 },
    { id: '500-1000', label: '₹500 - ₹1000', min: 500, max: 1000 },
    { id: 'above-1000', label: 'Above ₹1000', min: 1000, max: 99999 }
  ];

  // Calculate categories and counts from current products
  useEffect(() => {
    const calculateCategories = async () => {
      try {
        setLoading(true);
        
        console.log('FilterSidebar: Calculating categories from products:', products.length);
        
        // If no products available, try to show categories from API anyway
        let categoriesWithCounts = [];
        
        try {
          // Try to fetch category names from API first
          const response = await categoryApi.getAll();
          const categoriesData = response?.data || response || [];
          
          console.log('FilterSidebar: Raw API response:', response);
          console.log('FilterSidebar: Fetched categories from API:', categoriesData);
          
          // Debug individual categories
          categoriesData.forEach((cat, index) => {
            console.log(`FilterSidebar: Category ${index}:`, {
              raw: cat,
              id: cat?.id,
              name: cat?.name,
              type_id: typeof cat?.id,
              type_name: typeof cat?.name
            });
          });
          
          if (categoriesData.length > 0) {
            // When API returns categories, handle multiple shapes robustly:
            // - {id, name} objects (expected)
            // - primitives like [2,3] (some backends may return ids only)
            // Use products to derive counts and best-effort labels when name is missing.
            const isPrimitiveArray = categoriesData.every(item => (typeof item !== 'object' || item === null));

            if (products.length > 0) {
              if (isPrimitiveArray) {
                // API returned an array of ids/strings — map each id to a display label using products
                categoriesWithCounts = await Promise.all(categoriesData.map(async (rawId) => {
                  const idStr = String(rawId);

                  // Find products that reference this id in common fields
                  const matchingProducts = products.filter(product => {
                    const fieldsToCheck = [product?.category, product?.categoryId, product?.subcategory, product?.category_name, product?.categoryName];
                    return fieldsToCheck.some(f => String(f || '').toLowerCase().trim() === idStr.toLowerCase().trim());
                  });

                  // Try to derive a human label: look for a product that carries a category object/name
                  let derivedLabel = idStr;
                  const productWithCategoryObj = products.find(p => p?.category && typeof p.category === 'object' && (String(p.category.id) === idStr || String(p.category?.id) === String(p?.categoryId)));
                  if (productWithCategoryObj && productWithCategoryObj.category?.name) {
                    derivedLabel = productWithCategoryObj.category.name;
                  } else {
                    // Fallback: look for explicit category name fields on products
                    const productWithName = products.find(p => p?.categoryName || p?.category_name || (typeof p?.category === 'string' && isNaN(Number(p.category)) === true && p.category.trim().length > 0));
                    if (productWithName) {
                      derivedLabel = productWithName?.categoryName || productWithName?.category_name || (typeof productWithName?.category === 'string' ? productWithName.category : idStr);
                    }
                  }

                  return {
                    id: idStr,
                    label: derivedLabel,
                    count: matchingProducts.length
                  };
                }));
              } else {
                // API returned category objects. Use their name when present; fall back to id when missing.
                categoriesWithCounts = categoriesData.map(category => {
                  const categoryId = category?.id != null ? String(category.id) : null;
                  const categoryName = (category && category.name) ? String(category.name) : categoryId || 'Unknown';

                  // Count products that match either by id reference or by name
                  const matchingProducts = products.filter(product => {
                    const productCategoryCandidates = [product?.category, product?.categoryId, product?.categoryName, product?.category_name];
                    return productCategoryCandidates.some(pc => {
                      if (pc == null) return false;
                      const pcStr = String(pc).toLowerCase().trim();
                      const catNameStr = String(categoryName).toLowerCase().trim();
                      // direct equality or permissive contains matches
                      return pcStr === catNameStr || pcStr.replace(/\s+/g, '-') === catNameStr.replace(/\s+/g, '-') || pcStr.includes(catNameStr) || catNameStr.includes(pcStr) || pcStr === (categoryId || '').toLowerCase();
                    });
                  });

                    return {
                      id: categoryId || categoryName,
                      label: categoryName,
                      count: matchingProducts.length
                    };
                }).filter(cat => cat.count > 0);
              }
            } else {
              // No products loaded yet — show API categories with 0 count, prefer names
              if (isPrimitiveArray) {
                categoriesWithCounts = categoriesData.map(item => ({ id: String(item), label: String(item), count: 0 }));
              } else {
                categoriesWithCounts = categoriesData.map(category => ({ id: String(category?.id || category?.name || 'Unknown'), label: String(category?.name || category?.id || 'Unknown'), count: 0 }));
              }
              console.log('FilterSidebar: No products loaded, showing API categories with 0 counts');
            }
          }
        } catch (apiError) {
          console.warn('FilterSidebar: Failed to fetch categories from API:', apiError);
        }
        
        // Fallback: Extract categories from products if API failed or returned empty
        if (categoriesWithCounts.length === 0) {
          console.log('FilterSidebar: Using fallback - extracting categories from products');
          
          // Get unique categories from products
          const productCategories = products.reduce((acc, product) => {
            const category = product?.category;
            if (category && category !== 'misc' && category.trim() !== '') {
              const normalizedCategory = category.trim();
              if (!acc[normalizedCategory]) {
                acc[normalizedCategory] = 0;
              }
              acc[normalizedCategory]++;
            }
            return acc;
          }, {});
          
          console.log('FilterSidebar: Product categories found:', productCategories);
          
          categoriesWithCounts = Object.entries(productCategories)
            .map(([categoryName, count]) => ({
              id: categoryName,
              label: categoryName.replace(/([A-Z])/g, ' $1').trim(), // Add spaces before capitals
              count: count
            }))
            .sort((a, b) => b.count - a.count); // Sort by count descending
        }
        
        // Final fallback: If no categories found anywhere, create common categories
        if (categoriesWithCounts.length === 0) {
          console.log('FilterSidebar: No categories found from API or products, using default categories');
          const defaultCategories = [
            'Wood Pressed Oils',
            'Spice Powders', 
            'Pickles',
            'Ghee & Honey',
            'Jaggery',
            'Papads',
            'Essential Oils',
            'Other Food Products'
          ];
          
          categoriesWithCounts = defaultCategories.map(categoryName => {
            const matchingProducts = products.filter(product => {
              const productCategory = String(product?.category || '').toLowerCase().trim();
              const filterCategory = categoryName.toLowerCase().trim();
              
              return productCategory.includes(filterCategory.split(' ')[0].toLowerCase()) ||
                     filterCategory.includes(productCategory);
            });
            
            return {
              id: categoryName,
              label: categoryName,
              count: matchingProducts.length
            };
          }).filter(cat => cat.count > 0 || products.length === 0); // Show all if no products, or only those with products
        }
        
        console.log('FilterSidebar: Final categories with counts:', categoriesWithCounts);
        
        // Additional debug for display
        console.log('FilterSidebar: Categories that will be displayed:');
        categoriesWithCounts.forEach((cat, index) => {
          console.log(`  ${index}: ID="${cat.id}", Label="${cat.label}", Count=${cat.count}`);
        });
        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error('FilterSidebar: Error calculating categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Always try to calculate categories, even with no products (to show from API)
    calculateCategories();
  }, [products]); // Recalculate when products change

  // Helper normalization & selection helpers to support permissive matching
  const normalizeKey = (s) => String(s || '').toLowerCase().trim().replace(/\s+/g, '-');

  const isCategorySelected = (catId) => {
    const selected = filters?.categories || [];
    if (!selected || selected.length === 0) return false;
    return selected.some(sel => {
      const a = normalizeKey(sel);
      const b = normalizeKey(catId);
      return a === b || a.includes(b) || b.includes(a);
    });
  };

  const addCategorySelection = (catId) => {
    const selected = filters?.categories || [];
    if (!selected.some(sel => normalizeKey(sel) === normalizeKey(catId))) {
      onFilterChange('categories', [...selected, catId]);
    }
  };

  const removeCategorySelection = (catId) => {
    const selected = filters?.categories || [];
    const remaining = selected.filter(sel => !(normalizeKey(sel) === normalizeKey(catId) || normalizeKey(sel).includes(normalizeKey(catId)) || normalizeKey(catId).includes(normalizeKey(sel))));
    onFilterChange('categories', remaining);
  };


  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-border pb-4 mb-4">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full py-2 font-heading font-semibold text-foreground hover:text-primary transition-colors duration-200"
      >
        <span>{title}</span>
        <Icon 
          name={expandedSections?.[sectionKey] ? "ChevronUp" : "ChevronDown"} 
          size={16} 
        />
      </button>
      {expandedSections?.[sectionKey] && (
        <div className="mt-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  );

  const sidebarContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg text-foreground">
          Filters
        </h2>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors duration-200"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>

      {/* Active Filters Count */}
      {(filters?.priceRange?.length > 0 || filters?.dietary?.length > 0 || filters?.categories?.length > 0 || filters?.brands?.length > 0) && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-primary font-medium">
              {filters?.priceRange?.length + filters?.dietary?.length + filters?.categories?.length + filters?.brands?.length} filters applied
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-primary hover:text-primary/80"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Price Range */}
      <FilterSection title="Price Range" sectionKey="price">
        {priceRanges?.map((range) => (
          <Checkbox
            key={range?.id}
            label={range?.label}
            checked={filters?.priceRange?.includes(range?.id)}
            onChange={(e) => {
              const newPriceRange = e?.target?.checked
                ? [...filters?.priceRange, range?.id]
                : filters?.priceRange?.filter(id => id !== range?.id);
              onFilterChange('priceRange', newPriceRange);
            }}
          />
        ))}
      </FilterSection>



         {/*Categories */}
    <FilterSection title="Categories" sectionKey="category">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="w-6 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : categories?.length > 0 ? (
          categories.map((category) => (
            <div key={category?.id} className="flex items-center justify-between">
              <Checkbox
                label={category?.label || category?.name || String(category?.id || 'Unknown')}
                checked={isCategorySelected(category?.id)}
                onChange={(e) => {
                  if (e?.target?.checked) {
                    addCategorySelection(category?.id);
                  } else {
                    removeCategorySelection(category?.id);
                  }
                }}
              />
              <span className="font-caption text-xs text-muted-foreground">
                ({category?.count || 0})
              </span>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground text-center py-4">
            No categories available
          </div>
        )}
      </FilterSection>

      
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-[1002]" onClick={onClose} />
        )}
        <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-card shadow-warm-xl z-[1003] transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="h-full overflow-y-auto p-6">
            {sidebarContent}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="w-full bg-card rounded-lg border border-border p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      {sidebarContent}
    </div>
  );
};

export default FilterSidebar;