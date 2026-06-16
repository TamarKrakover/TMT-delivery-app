const db = require('./InMemoryDB');

const CATEGORY_IMAGES = {
  'All': '/images/categories/all.webp',
  'Burgers': '/images/categories/burgers.webp',
  'Pizza': '/images/categories/pizza.webp',
  'Asian': '/images/categories/asian.webp',
  'Desserts': '/images/categories/dessert.webp',
  'Sushi': '/images/categories/sushi.webp',
  'Salads': '/images/categories/salad.webp',
  'Grill': '/images/categories/burgers.webp', // Using burgers as fallback for Grill
  'Default': '/images/categories/all.webp'
};

class CategoryModel {
  static getAll() {
    const restaurants = db.restaurants;
    const categoriesMap = {};

    // Count restaurants per category
    restaurants.forEach(restaurant => {
      const cat = restaurant.category || 'General';
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = 0;
      }
      categoriesMap[cat]++;
    });

    // Build the categories array
    const categoriesArray = Object.keys(categoriesMap).map(catName => {
      return {
        name: catName,
        count: categoriesMap[catName],
        image: CATEGORY_IMAGES[catName] || CATEGORY_IMAGES['Default']
      };
    });

    // Sort alphabetically
    categoriesArray.sort((a, b) => a.name.localeCompare(b.name));

    // Always prepend 'All' category
    categoriesArray.unshift({
      name: 'All',
      count: restaurants.length,
      image: CATEGORY_IMAGES['All']
    });

    return categoriesArray;
  }
}

module.exports = CategoryModel;
