import React from 'react';
import './CategoryFilters.css';
import ScrollableRow from '../common/ScrollableRow';
const CategoryFilters = ({ categories = [], selectedCategory, onCategorySelect }) => {

  return (
    <ScrollableRow className="categories-container-wrapper">
      <div className="categories-container">
      {categories.map((category) => (
        <div
          key={category.name}
          className={`category-card ${selectedCategory === category.name ? 'active' : ''}`}
          onClick={() => onCategorySelect(category.name)}
        >
          <img src={category.image} alt={category.name} className="category-image" />
          <div className="category-info">
            <span className="category-name">{category.name}</span>
            <span className="category-places">{category.count} places</span>
          </div>
        </div>
      ))}
      </div>
    </ScrollableRow>
  );
};

export default CategoryFilters;
