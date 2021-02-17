import React from 'react';
import '../css/layout/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <button className="btn btn-link btn-link-footer-left"><a href="https://ak-47.biz" target="_blank" rel="noopener noreferrer">AK-47</a></button><span> &copy; 2020 - 2021</span>
      </div>
      <div className="footer-right">
        <button className="btn btn-link"><a href="https://code.nasa.gov" target="_blank" rel="noopener noreferrer">code.nasa.gov</a></button>
        <button className="btn btn-link"><a href="https://data.nasa.gov" target="_blank" rel="noopener noreferrer">data.nasa.gov</a></button>
        <button className="btn btn-link"><a href="https://api.nasa.gov" target="_blank" rel="noopener noreferrer">api.nasa.gov</a></button>
        <button className="btn btn-link"><a href="https://open.nasa.gov" target="_blank" rel="noopener noreferrer">open.nasa.gov</a></button>
      </div>
    </footer>
  );
}

export default Footer;