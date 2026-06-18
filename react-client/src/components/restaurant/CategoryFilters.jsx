import React from 'react';
import './CategoryFilters.css';
import ScrollableRow from '../common/ScrollableRow';

const CategoryCard = React.memo(({ name, image, count, active, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(name);
    }
  };

  return (
    <div
      className={`category-card ${active ? 'active' : ''}`}
      onClick={handleClick}
    >
      <img 
        src={image} 
        alt={name} 
        className="category-image" 
        loading="lazy" 
        decoding="async" 
      />
      <div className="category-info">
        <span className="category-name">{name}</span>
        <span className="category-places">{count} places</span>
      </div>
    </div>
  );
});

const CategoryFilters = React.memo(({ categories = [], selectedCategory, onCategorySelect }) => {
  return (
    <ScrollableRow className="categories-container-wrapper">
      <div className="categories-container">
      {categories.map((category) => (
        <CategoryCard
          key={category.name}
          name={category.name}
          image={category.image}
          count={category.count}
          active={selectedCategory === category.name}
          onClick={onCategorySelect}
        />
      ))}
      </div>
    </ScrollableRow>
  );
});

export default CategoryFilters;
