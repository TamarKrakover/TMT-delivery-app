import { useState, useCallback } from 'react';

export const useModal = (initialMode = 'add') => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(initialMode);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const openModal = useCallback((modalData = null, modalMode = initialMode) => {
    setData(modalData);
    setMode(modalMode);
    setError('');
    setIsOpen(true);
  }, [initialMode]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    mode,
    data,
    error,
    setError,
    openModal,
    closeModal
  };
};
