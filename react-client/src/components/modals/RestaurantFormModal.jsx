import React, { useState, useEffect } from 'react';
import { FiX, FiUploadCloud } from 'react-icons/fi';
import uploadService from '../../services/uploadService';

const RestaurantFormModal = ({ title, initialData, onSubmit, onClose, error }) => {
  const [formError, setFormError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [form, setForm] = useState(() => {
    const category = initialData?.category || 'General';
    return {
      name: initialData?.name || '',
      description: initialData?.description || '',
      category,
      image: initialData?.image || '',
      location: initialData?.location || { lat: '', lng: '' }
    };
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      setFormError('Restaurant Name is required.');
      return;
    }
    if (!form.location.lat || !form.location.lng || isNaN(parseFloat(form.location.lat)) || isNaN(parseFloat(form.location.lng))) {
      setFormError('Valid Latitude and Longitude are required.');
      return;
    }
    setFormError('');
    setIsUploading(true);

    try {
      let imageUrl = form.image;
      if (selectedFile) {
        imageUrl = await uploadService.uploadImage(selectedFile);
      }
      
      onSubmit({
        ...form,
        image: imageUrl,
        location: {
          lat: parseFloat(form.location.lat),
          lng: parseFloat(form.location.lng)
        }
      });
    } catch (err) {
      setFormError('Failed to upload image. Please try again.');
      setIsUploading(false);
    }
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
                  category: selectedCat
                });
              }}
            >
              <option value="General">General</option>
              <option value="Burgers">Burgers</option>
              <option value="Pizza">Pizza</option>
              <option value="Sushi">Sushi</option>
              <option value="Asian">Asian</option>
              <option value="Desserts">Desserts</option>
              <option value="Salads">Salads</option>
              <option value="Grill">Grill</option>
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
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Upload Image</label>
            <div className="file-upload-dropzone">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-upload-input"
              />
              <FiUploadCloud size={24} className="file-upload-icon" />
              <div className="file-upload-text">
                {selectedFile ? selectedFile.name : 'Click to upload image'}
              </div>
            </div>
            {form.image && !selectedFile && (
               <small className="file-upload-current">Current: {form.image}</small>
            )}
          </div>

          {(error || formError) && <div className="form-error">{error || formError}</div>}

          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantFormModal;
