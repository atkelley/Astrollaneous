import React from 'react';
import { Link } from 'react-router-dom';
import '../css/layout/Navbar.css';

const Navbar = () => {
  return (
    <div className="container navbar-links">
      <ul className="nav nav-tabs justify-content-center">
        <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
        <li className="nav-item"><Link to="/mars" className="nav-link">Mars</Link></li>
        <li className="nav-item"><Link to="/rovers" className="nav-link">Rovers</Link></li>
        <li className="nav-item"><Link to="/satellites" className="nav-link">Satellites</Link></li>
        <li className="nav-item"><Link to="/nasa" className="nav-link">NASA</Link></li>
        <li className="nav-item"><Link to="/techport" className="nav-link">TechPort</Link></li>
        <li className="nav-item"><Link to="/about" className="nav-link">About</Link></li>
      </ul>
  </div>
  );
}

export default Navbar;