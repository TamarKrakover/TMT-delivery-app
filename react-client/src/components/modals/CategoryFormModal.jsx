import React, { useState } from 'react';
import { FiX, FiUploadCloud } from '../../components/common/Icons';
import uploadService from '../../services/uploadService';

const CategoryFormModal = ({ onSubmit, onClose, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: ''
  });
  const [formError, setFormError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setFormError('Category Name is required.');
      return;
    }
    setFormError('');
    setIsUploading(true);

    try {
      let imageUrl = formData.image;
      if (selectedFile) {
        imageUrl = await uploadService.uploadImage(selectedFile);
      }
      onSubmit({ ...formData, image: imageUrl });
    } catch (err) {
      setFormError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
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
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="image">Upload Image</label>
            <div className="file-upload-dropzone">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="file-upload-input"
              />
              <FiUploadCloud size={24} className="file-upload-icon" />
              <div className="file-upload-text">
                {selectedFile ? selectedFile.name : 'Click to upload image'}
              </div>
            </div>
          </div>
          
          {(error || formError) && <div className="form-error">{error || formError}</div>}
          
          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
