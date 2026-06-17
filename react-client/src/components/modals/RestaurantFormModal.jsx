import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const RestaurantFormModal = ({ title, initialData, onSubmit, onClose, error }) => {
  const [formError, setFormError] = useState('');

  const categoryToImageKey = (category) => {
    const cat = category ? category.toLowerCase() : '';
    if (cat === 'burgers') return 'burger';
    if (cat === 'pizza') return 'pizza';
    if (cat === 'sushi') return 'sushi';
    if (cat === 'asian') return 'asian';
    if (cat === 'desserts') return 'dessert';
    if (cat === 'salads') return 'salad';
    if (cat === 'grill') return 'burger';
    return 'general';
  };

  const [form, setForm] = useState(() => {
    const category = initialData?.category || 'Burgers';
    return {
      name: initialData?.name || '',
      description: initialData?.description || '',
      category,
      imageKey: initialData?.imageKey || categoryToImageKey(category),
      image: initialData?.image || '',
      location: initialData?.location || { lat: '', lng: '' }
    };
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) {
      setFormError('Restaurant Name is required.');
      return;
    }
    if (form.location.lat === '' || form.location.lng === '' || isNaN(parseFloat(form.location.lat)) || isNaN(parseFloat(form.location.lng))) {
      setFormError('Valid Latitude and Longitude are required.');
      return;
    }
    setFormError('');
    onSubmit({
      ...form,
      location: {
        lat: parseFloat(form.location.lat),
        lng: parseFloat(form.location.lng)
      }
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        <h2 className="modal-title">{title || 'Restaurant Details'}</h2>

        <form onSubmit={handleSubmit} noValidate>
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
              onChange={(e) => {
                const selectedCat = e.target.value;
                setForm({
                  ...form,
                  category: selectedCat,
                  imageKey: categoryToImageKey(selectedCat)
                });
              }}
            >
              <option value="Burgers">Burgers</option>
              <option value="Pizza">Pizza</option>
              <option value="Sushi">Sushi</option>
              <option value="Asian">Asian</option>
              <option value="Desserts">Desserts</option>
              <option value="Salads">Salads</option>
              <option value="Grill">Grill</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Latitude</label>
              <input
                type="number"
                step="any"
                className="form-input"
                value={form.location.lat}
                onChange={(e) => setForm({ ...form, location: { ...form.location, lat: e.target.value } })}
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
                onChange={(e) => setForm({ ...form, location: { ...form.location, lng: e.target.value } })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Custom Image URL</label>
            <input
              type="text"
              className="form-input"
              value={form.image || ''}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="e.g. https://example.com/image.jpg"
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

export default RestaurantFormModal;
