import React, { useState, useEffect } from 'react';
import AddProductModalView from '../../styles/AddProductModal.styles';
import { productService } from '../../services/api';

export default function AddProductModal({ visible, onClose, restaurant, onProductAdded }) {
  // Form states
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pImage, setPImage] = useState('');
  const [pSubmitting, setPSubmitting] = useState(false);
  const [pFormError, setPFormError] = useState(null);

  useEffect(() => {
    if (visible) {
      setPName('');
      setPPrice('');
      setPDescription('');
      setPImage('');
      setPFormError(null);
    }
  }, [visible]);

  const handleAddProduct = async () => {
    if (!pName.trim()) {
      setPFormError('Product name is required.');
      return;
    }
    if (!pPrice.trim() || isNaN(parseFloat(pPrice))) {
      setPFormError('Product price must be a valid number.');
      return;
    }

    try {
      setPSubmitting(true);
      setPFormError(null);

      const payload = {
        name: pName.trim(),
        price: parseFloat(pPrice),
        description: pDescription.trim(),
        image: pImage.trim() || undefined
      };

      const targetId = restaurant.id || restaurant._id;
      await productService.create(targetId, payload);

      if (onProductAdded) {
        onProductAdded();
      }
      onClose();
    } catch (err) {
      console.log("Failed to add product:", err.message);
      setPFormError(err.message || 'Failed to add product. Please try again.');
    } finally {
      setPSubmitting(false);
    }
  };

  return (
    <AddProductModalView
      visible={visible}
      onClose={onClose}
      pFormError={pFormError}
      setPFormError={setPFormError}
      pName={pName}
      setPName={setPName}
      pPrice={pPrice}
      setPPrice={setPPrice}
      pDescription={pDescription}
      setPDescription={setPDescription}
      pImage={pImage}
      setPImage={setPImage}
      pSubmitting={pSubmitting}
      handleAddProduct={handleAddProduct}
    />
  );
}
