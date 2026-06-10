import React from 'react';
import logo from '../../logoTMT.svg';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <img src={logo} alt="Logo" className="logo" />
      <p>© {new Date().getFullYear()} TMT Delivery. Made with ❤️ for Advanced Programming.</p>
      <p>Images by Magnific: <a href="https://www.magnific.com">www.magnific.com</a></p>
    </footer>
  );
};

export default Footer;
