import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import imgBreakfast from '../../images/banners/breakfast.jpg';
import imgLunch from '../../images/banners/lunch.jpg';
import imgDinner from '../../images/banners/dinner.jpg';
import imgLateNight from '../../images/banners/late-night2.jpg';
import './HeroBanner.css';

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
        backgroundImage: imgBreakfast
      };
    } else if (hour >= 12 && hour < 18) {
      // Afternoon (Lunch)
      return {
        title: <>Lunch Time? We've got <span>you covered</span>.</>,
        subtitle: "Order from the best local restaurants and get your favorite meals delivered in minutes.",
        backgroundImage: imgLunch
      };
    } else if (hour >= 18 && hour < 22) {
      // Evening (Dinner)
      return {
        title: <>Time for a <span>delicious dinner</span>!</>,
        subtitle: "Treat yourself tonight. Discover top dinner choices nearby.",
        backgroundImage: imgDinner
      };
    } else {
      // Late Night - Munchies (22:00 - 04:59)
      return {
        title: <>Late night <span>munchies</span>?</>,
        subtitle: "Satisfy your midnight cravings with 24/7 delivery spots near you.",
        backgroundImage: imgLateNight
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
