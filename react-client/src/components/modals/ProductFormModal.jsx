import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const ProductFormModal = ({ title, initialData, onSubmit, onClose, error }) => {
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    image: initialData?.image || ''
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || form.price === '') {
      setFormError('Dish Name and Price are required.');
      return;
    }
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Price must be strictly positive (greater than 0).');
      return;
    }
    setFormError('');
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        <h2 className="modal-title">{title || 'Menu Item'}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Dish Name</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Crispy French Fries"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="e.g. 5.99"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="List ingredients or details about the dish..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Custom Image URL</label>
            <input
              type="text"
              className="form-input"
              value={form.image || ''}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="e.g. https://example.com/product.jpg"
            />
          </div>

          {(error || formError) && <div className="form-error">{error || formError}</div>}

          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
