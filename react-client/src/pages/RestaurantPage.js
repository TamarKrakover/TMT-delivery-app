import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import './RestaurantPage.css';

import RestaurantHero from '../components/restaurant/RestaurantHero';
import MenuList from '../components/restaurant/MenuList';
import ProductDetailModal from '../components/modals/ProductDetailModal';
import RestaurantFormModal from '../components/modals/RestaurantFormModal';
import ProductFormModal from '../components/modals/ProductFormModal';

import { useAuth } from '../contexts/AuthContext';
import { useRestaurant } from '../hooks/useRestaurant';
import { useModal } from '../hooks/useModal';

const DEFAULT_RESTAURANT_IMAGE = "/images/restaurants/default.webp";

const RestaurantPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  
  const {
    restaurant,
    products,
    loading,
    error,
    canModify,
    updateRestaurant,
    deleteRestaurant,
    submitProduct,
    deleteProduct
  } = useRestaurant(id, currentUser);

  const productDetailModal = useModal();
  const editRestModal = useModal();
  const productFormModal = useModal('add');

  const handleEditRestaurantSubmit = async (form) => {
    try {
      await updateRestaurant(form);
      editRestModal.closeModal();
    } catch (err) {
      editRestModal.setError(err.message || 'Failed to update restaurant.');
    }
  };

  const handleProductFormSubmit = async (form) => {
    try {
      await submitProduct(productFormModal.mode, productFormModal.data?.id, form);
      productFormModal.closeModal();
    } catch (err) {
      productFormModal.setError(err.message || `Failed to ${productFormModal.mode} product.`);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '100px 20px', fontSize: '20px', fontWeight: 'bold' }}>
          Loading Restaurant details...
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="app-container">
        <Navbar />
        <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--danger)' }}>
          <h2>Error</h2>
          <p>{error || 'Restaurant not found.'}</p>
        </div>
        <Footer />
      </div>
    );
  }

  const bgImage = restaurant.image || DEFAULT_RESTAURANT_IMAGE;

  return (
    <div className="app-container restaurant-page-container">
      <Navbar />

      <RestaurantHero restaurant={restaurant} bgImage={bgImage} />

      <main className="restaurant-body">
        <div className="menu-header-section">
          <h2 className="menu-title">Menu</h2>

          {canModify && (
            <div className="admin-actions">
              <button className="btn-admin" onClick={() => editRestModal.openModal(restaurant)}>
                <FiEdit /> Edit Details
              </button>
              <button className="btn-admin" onClick={() => productFormModal.openModal(null, 'add')}>
                <FiPlus /> Add Dish
              </button>
              <button className="btn-admin btn-danger" onClick={deleteRestaurant}>
                <FiTrash2 /> Delete Restaurant
              </button>
            </div>
          )}
        </div>

        <MenuList
          products={products}
          restaurant={restaurant}
          canModify={canModify}
          onProductClick={(product) => productDetailModal.openModal(product)}
          onEditProduct={(product, e) => { e.stopPropagation(); productFormModal.openModal(product, 'edit'); }}
          onDeleteProduct={(productId, e) => { e.stopPropagation(); deleteProduct(productId); }}
        />
      </main>

      <Footer />

      {productDetailModal.isOpen && (
        <ProductDetailModal
          product={productDetailModal.data}
          restaurant={restaurant}
          onClose={productDetailModal.closeModal}
        />
      )}

      {editRestModal.isOpen && (
        <RestaurantFormModal
          title="Edit Restaurant Details"
          initialData={{
            name: restaurant.name || '',
            description: restaurant.description || '',
            category: restaurant.category || 'Burgers',
            address: restaurant.address || '',
            image: restaurant.image || DEFAULT_RESTAURANT_IMAGE
          }}
          onSubmit={handleEditRestaurantSubmit}
          onClose={editRestModal.closeModal}
          error={editRestModal.error}
        />
      )}

      {productFormModal.isOpen && (
        <ProductFormModal
          title={productFormModal.mode === 'add' ? 'Add Menu Item' : 'Edit Menu Item'}
          initialData={productFormModal.mode === 'edit' ? {
            name: productFormModal.data?.name || '',
            description: productFormModal.data?.description || '',
            price: productFormModal.data?.price || ''
          } : null}
          onSubmit={handleProductFormSubmit}
          onClose={productFormModal.closeModal}
          error={productFormModal.error}
        />
      )}
    </div>
  );
};

export default RestaurantPage;
