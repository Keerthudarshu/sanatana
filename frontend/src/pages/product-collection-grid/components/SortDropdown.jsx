import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SortDropdown = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'best-selling', label: 'Best Selling' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-a-z', label: 'Name: A to Z' },
    { value: 'name-z-a', label: 'Name: Z to A' },
    { value: 'rating-high-low', label: 'Highest Rated' }
  ];

  const currentSortLabel = sortOptions?.find(option => option?.value === currentSort)?.label || 'Best Selling';

  const handleSortSelect = (sortValue) => {
    onSortChange(sortValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors duration-200 font-body text-foreground"
      >
        <Icon name="ArrowUpDown" size={16} />
        <span>Sort: {currentSortLabel}</span>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <div 
            className="fixed inset-0 z-[1000] md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-warm-lg z-[1001] py-2">
            {sortOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => handleSortSelect(option?.value)}
                className={`w-full text-left px-4 py-2 font-body hover:bg-muted transition-colors duration-200 ${
                  currentSort === option?.value
                    ? 'text-primary bg-primary/5' :'text-foreground'
                }`}
              >
                {option?.label}
                {currentSort === option?.value && (
                  <Icon name="Check" size={16} className="float-right mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;