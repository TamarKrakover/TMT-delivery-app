import React from 'react';
import './CategoryFilters.css';
const CategoryFilters = ({ selectedCategory, onCategorySelect }) => {
  const categories = [
    { name: 'All', image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80", count: 142 },
    { name: 'Burgers', image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=80", count: 28 },
    { name: 'Pizza', image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format&fit=crop&q=80", count: 35 },
    { name: 'Asian', image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=150&auto=format&fit=crop&q=80", count: 18 },
    { name: 'Desserts', image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=150&auto=format&fit=crop&q=80", count: 22 },
    { name: 'Sushi', image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=150&auto=format&fit=crop&q=80", count: 14 },
    { name: 'Salads', image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&auto=format&fit=crop&q=80", count: 25 },
  ];

  return (
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
  );
};

export default CategoryFilters;
