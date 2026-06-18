import React, { useRef, useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from './Icons';
import './ScrollableRow.css';

const ScrollableRow = ({ children, className = '' }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkArrows();
    window.addEventListener('resize', checkArrows);
    return () => window.removeEventListener('resize', checkArrows);
  }, [children]);

  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      // Update arrows after scrolling animation (roughly 300ms)
      setTimeout(checkArrows, 350);
    }
  };

  return (
    <div className={`scrollable-row-container ${className}`}>
      {showLeftArrow && (
        <button 
          className="scroll-arrow scroll-arrow-left" 
          onClick={() => scroll(-300)}
          aria-label="Scroll left"
        >
          <FiChevronLeft size={24} />
        </button>
      )}
      
      <div 
        className="scrollable-row-content" 
        ref={scrollRef} 
        onScroll={checkArrows}
      >
        {children}
      </div>

      {showRightArrow && (
        <button 
          className="scroll-arrow scroll-arrow-right" 
          onClick={() => scroll(300)}
          aria-label="Scroll right"
        >
          <FiChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default ScrollableRow;
