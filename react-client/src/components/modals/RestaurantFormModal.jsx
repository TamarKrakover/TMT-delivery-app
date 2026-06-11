import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const RestaurantFormModal = ({ title, initialData, onSubmit, onClose, error }) => {
  const [form, setForm] = useState(initialData || {
    name: '',
    description: '',
    category: 'Burgers',
    address: '',
    imageKey: 'burger'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        <h2 className="modal-title">{title || 'Restaurant Details'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Restaurant Name</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Burger Palace"
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
              placeholder="Brief description about the restaurant..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="Burgers">Burgers</option>
              <option value="Pizza">Pizza</option>
              <option value="Sushi">Sushi</option>
              <option value="Asian">Asian</option>
              <option value="Desserts">Desserts</option>
              <option value="Salads">Salads</option>
              <option value="Grill">Grill</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-input"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="e.g. 128 Main St"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Banner Image Theme</label>
            <select
              className="form-input"
              value={form.imageKey}
              onChange={(e) => setForm({ ...form, imageKey: e.target.value })}
            >
              <option value="burger">Burgers / Grill</option>
              <option value="pizza">Pizza</option>
              <option value="sushi">Sushi</option>
              <option value="asian">Asian</option>
              <option value="dessert">Desserts</option>
              <option value="salad">Salads</option>
            </select>
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

export default RestaurantFormModal;
