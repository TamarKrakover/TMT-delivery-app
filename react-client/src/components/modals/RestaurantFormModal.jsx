import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const RestaurantFormModal = ({ title, initialData, onSubmit, onClose, error }) => {
  const [form, setForm] = useState(initialData || {
    name: '',
    description: '',
    category: 'Burgers',
    address: '',
    image: initialData?.image || '/images/restaurants/default.webp',
    location: initialData?.location || { lat: 32.0853, lng: 34.7818 }
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

          <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Latitude</label>
              <input
                type="number"
                step="any"
                className="form-input"
                value={form.location.lat}
                onChange={(e) => setForm({ ...form, location: { ...form.location, lat: parseFloat(e.target.value) } })}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Longitude</label>
              <input
                type="number"
                step="any"
                className="form-input"
                value={form.location.lng}
                onChange={(e) => setForm({ ...form, location: { ...form.location, lng: parseFloat(e.target.value) } })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Banner Image Theme</label>
            <select
              className="form-input"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            >
              <option value="/images/restaurants/default.webp">Default Restaurant</option>
              <option value="/images/restaurants/hamburger.webp">Burgers / Grill</option>
              <option value="/images/restaurants/pizza.webp">Pizza</option>
              <option value="/images/restaurants/sushi.webp">Sushi</option>
              <option value="/images/restaurants/wok.webp">Asian</option>
              <option value="/images/restaurants/sweet-dreams.webp">Desserts</option>
              <option value="/images/restaurants/salad.webp">Salads</option>
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
