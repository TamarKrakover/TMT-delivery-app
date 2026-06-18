import React, { useRef, useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from './Icons';
import './ScrollableRow.css';

const ScrollableRow = ({ children, className = '' }) => {
  const scrollRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      cancelAnimationFrame(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = requestAnimationFrame(() => {
      checkArrows();
    });
  };

  const childrenCount = React.Children.count(children);

  useEffect(() => {
    checkArrows();
    window.addEventListener('resize', checkArrows);

    const element = scrollRef.current;
    let resizeObserver;
    if (element) {
      resizeObserver = new ResizeObserver(() => {
        window.requestAnimationFrame(() => {
          checkArrows();
        });
      });
      resizeObserver.observe(element);
      if (element.firstElementChild) {
        resizeObserver.observe(element.firstElementChild);
      }
    }

    return () => {
      window.removeEventListener('resize', checkArrows);
      if (scrollTimeoutRef.current) {
        cancelAnimationFrame(scrollTimeoutRef.current);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [childrenCount]);

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
        onScroll={handleScroll}
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
