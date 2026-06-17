import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const CategoryFormModal = ({ onSubmit, onClose, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: ''
  });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      setFormError('Category Name is required.');
      return;
    }
    setFormError('');
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><FiX /></button>
        <h2 className="modal-title">Add New Category</h2>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Italian, Vegan..."
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="image">Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              className="form-input"
              value={formData.image}
              onChange={handleChange}
              placeholder="e.g. https://images.unsplash.com/photo-..."
            />
          </div>
          
          {(error || formError) && <div className="form-error">{error || formError}</div>}
          
          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
