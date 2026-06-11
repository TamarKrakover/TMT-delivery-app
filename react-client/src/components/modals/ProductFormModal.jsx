import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const ProductFormModal = ({ title, initialData, onSubmit, onClose, error }) => {
  const [form, setForm] = useState(initialData || {
    name: '',
    description: '',
    price: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        <h2 className="modal-title">{title || 'Menu Item'}</h2>

        <form onSubmit={handleSubmit}>
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

          {error && <div className="form-error">{error}</div>}

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
