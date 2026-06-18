import React from 'react';
import { FiInfo } from '../../components/common/Icons';
import MenuItem from './MenuItem';

const MenuList = ({ products, restaurant, canModify, onProductClick, onEditProduct, onDeleteProduct }) => {
  if (products.length === 0) {
    return (
      <div className="empty-menu">
        <FiInfo className="empty-menu-icon" />
        <p className="empty-menu-text">
          No dishes on the menu yet. {canModify ? "Click 'Add Dish' to create one!" : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="menu-grid">
      {products.map((product) => (
        <MenuItem
          key={product.id}
          product={product}
          restaurant={restaurant}
          canModify={canModify}
          onClick={onProductClick}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  );
};

export default MenuList;
