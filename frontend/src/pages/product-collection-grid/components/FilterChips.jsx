import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ activeFilters, onRemoveFilter, onClearAll }) => {
  const getFilterLabel = (type, value) => {
    const labels = {
      priceRange: {
        'under-200': 'Under ₹200',
        '200-500': '₹200 - ₹500',
        '500-1000': '₹500 - ₹1000',
        'above-1000': 'Above ₹1000'
      },
      dietary: {
        'vegan': 'Vegan',
        'gluten-free': 'Gluten Free',
        'no-preservatives': 'No Preservatives',
        'organic': 'Organic',
        'handmade': 'Handmade',
        'no-palm-oil': 'No Palm Oil'
      },
      categories: {
        'sweets': 'Sweets',
        'savouries': 'Savouries',
        'pickles': 'Pickles',
        'combos': 'Combos',
        'summer-coolers': 'Summer Coolers',
        'kitchen-essentials': 'Kitchen Essentials'
      },
      brands: {
        'sanatana-parampare': "Sanatana Parampare",
        'traditional-tastes': 'Traditional Tastes',
        'organic-origins': 'Organic Origins',
        'homemade-heritage': 'Homemade Heritage'
      }
    };

    return labels?.[type]?.[value] || value;
  };

  const getAllActiveFilters = () => {
    const filters = [];
    
    activeFilters?.priceRange?.forEach(value => {
      filters?.push({ type: 'priceRange', value, label: getFilterLabel('priceRange', value) });
    });
    
    activeFilters?.dietary?.forEach(value => {
      filters?.push({ type: 'dietary', value, label: getFilterLabel('dietary', value) });
    });
    
    activeFilters?.categories?.forEach(value => {
      filters?.push({ type: 'categories', value, label: getFilterLabel('categories', value) });
    });
    
    activeFilters?.brands?.forEach(value => {
      filters?.push({ type: 'brands', value, label: getFilterLabel('brands', value) });
    });
    
    return filters;
  };

  const allFilters = getAllActiveFilters();

  if (allFilters?.length === 0) return null;

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-body font-semibold text-foreground">
          Active Filters ({allFilters?.length})
        </h3>
        <button
          onClick={onClearAll}
          className="font-caption text-sm text-primary hover:text-primary/80 transition-colors duration-200"
        >
          Clear All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {allFilters?.map((filter, index) => (
          <div
            key={`${filter?.type}-${filter?.value}-${index}`}
            className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-sm font-caption"
          >
            <span>{filter?.label}</span>
            <button
              onClick={() => onRemoveFilter(filter?.type, filter?.value)}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors duration-200"
              aria-label={`Remove ${filter?.label} filter`}
            >
              <Icon name="X" size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;