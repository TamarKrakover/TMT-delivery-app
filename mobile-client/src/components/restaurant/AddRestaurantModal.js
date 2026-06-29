import React, { useState, useEffect } from 'react';
import AddRestaurantModalView from '../../styles/AddRestaurantModal.styles';
import { restaurantService, categoryService } from '../../services/api';

export default function AddRestaurantModal({ visible, onClose, onRestaurantAdded }) {
  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    if (visible) {
      fetchCategories();
      // Reset form on open
      setName('');
      setDescription('');
      setCategory('');
      setImage('');
      setLat('');
      setLng('');
      setFormError(null);
    }
  }, [visible]);

  const fetchCategories = async () => {
    try {
      const cats = await categoryService.getAll();
      setAvailableCategories(cats || []);
    } catch (e) {
      console.log("Failed to load categories in modal:", e.message);
    }
  };

  const handleAddRestaurant = async () => {
    if (!name.trim()) {
      setFormError('Restaurant name is required.');
      return;
    }
    if (!category.trim()) {
      setFormError('Category is required.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      
      const payload = {
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        image: image.trim() || undefined,
      };

      if (lat.trim() || lng.trim()) {
        const parsedLat = parseFloat(lat);
        const parsedLng = parseFloat(lng);
        if (isNaN(parsedLat) || isNaN(parsedLng)) {
          setFormError('Latitude and Longitude must be valid numbers.');
          setSubmitting(false);
          return;
        }
        payload.location = { lat: parsedLat, lng: parsedLng };
      }

      await restaurantService.create(payload);
      
      if (onRestaurantAdded) {
        onRestaurantAdded();
      }
      onClose();
    } catch (err) {
      console.log("Failed to create restaurant:", err.message);
      setFormError(err.message || 'Failed to create restaurant. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AddRestaurantModalView
      visible={visible}
      onClose={onClose}
      formError={formError}
      setFormError={setFormError}
      name={name}
      setName={setName}
      category={category}
      setCategory={setCategory}
      availableCategories={availableCategories}
      description={description}
      setDescription={setDescription}
      image={image}
      setImage={setImage}
      lat={lat}
      setLat={setLat}
      lng={lng}
      setLng={setLng}
      submitting={submitting}
      handleAddRestaurant={handleAddRestaurant}
    />
  );
}
