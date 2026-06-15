import React from 'react';
import './HeroBanner.css';
import { useTheme } from '../../contexts/ThemeContext';

const HeroBanner = () => {
  const { darkMode } = useTheme();
  // Helper function to select custom hero banner content based on the hour of the day
  const getGreetingSlide = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      // Morning (Use breakfast background image)
      return {
        title: <>Good morning! Ready for <span>breakfast</span>?</>,
        subtitle: "Explore local bakeries, fresh coffee, and breakfast spots near you.",
        backgroundImage: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=1200&auto=format&fit=crop&q=85"
      };
    } else if (hour >= 12 && hour < 18) {
      // Afternoon (Lunch)
      return {
        title: <>Lunch Time? We've got <span>you covered</span>.</>,
        subtitle: "Order from the best local restaurants and get your favorite meals delivered in minutes.",
        backgroundImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=85"
      };
    } else if (hour >= 18 && hour < 22) {
      // Evening (Dinner)
      return {
        title: <>Time for a <span>delicious dinner</span>!</>,
        subtitle: "Treat yourself tonight. Discover top dinner choices nearby.",
        backgroundImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=85"
      };
    } else {
      // Late Night - Munchies (22:00 - 04:59)
      return {
        title: <>Late night <span>munchies</span>?</>,
        subtitle: "Satisfy your midnight cravings with 24/7 delivery spots near you.",
        backgroundImage: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=1200&auto=format&fit=crop&q=85"
      };
    }
  };

  const greeting = getGreetingSlide();
  
  // Dynamic overlay for maximum text readability over background images
  const overlay = darkMode 
    ? 'linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65))' 
    : 'linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35))';

  const slideStyle = greeting.backgroundImage 
    ? { 
        backgroundImage: `${overlay}, url(${greeting.backgroundImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }
    : {};

  return (
    <section 
      className={`hero-section slim-hero ${greeting.backgroundImage ? 'has-bg-image' : ''}`} 
      style={slideStyle}
    >
      <div className="hero-content">
        <h1 className="hero-title">{greeting.title}</h1>
        <p className="hero-subtitle">{greeting.subtitle}</p>
      </div>
    </section>
  );
};

export default HeroBanner;
