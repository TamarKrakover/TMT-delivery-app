import React from 'react';
import './CategoryFilters.css';
import imgAll from '../../images/categories/all.jpg';
import imgBurgers from '../../images/categories/burgers.jpg';
import imgPizza from '../../images/categories/pizza.jpg';
import imgAsian from '../../images/categories/asian.jpg';
import imgDesserts from '../../images/categories/dessert.jpg';
import imgSushi from '../../images/categories/sushi.jpg';
import imgSalads from '../../images/categories/salad.jpg';

const CategoryFilters = ({ selectedCategory, onCategorySelect }) => {
  const categories = [
    { name: 'All', image: imgAll, count: 142 },
    { name: 'Burgers', image: imgBurgers, count: 28 },
    { name: 'Pizza', image: imgPizza, count: 35 },
    { name: 'Asian', image: imgAsian, count: 18 },
    { name: 'Desserts', image: imgDesserts, count: 22 },
    { name: 'Sushi', image: imgSushi, count: 14 },
    { name: 'Salads', image: imgSalads, count: 25 },
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
