import React from 'react';
import { Link } from 'react-router-dom';
import '../css/layout/Navbar.css';

const Navbar = () => {
  const handleTabChange = (event) => {
    $('.nav-tabs .nav-item .nav-link').each(function() { 
      if($(this).is(`#${event.target.id}`)) {
        if(!$(this).is('.active')) {
          $(this).toggleClass(' active');
        }
      } else {
        $(this).removeClass(' active');
      }
    });  
  }

  return (
    <div className="container navbar-links">
      <ul className="nav nav-tabs justify-content-center">
        <li className="nav-item"><Link to="/" className="nav-link active" id="home" onClick={(event) => handleTabChange(event)}>Home</Link></li>
        <li className="nav-item"><Link to="/mars" className="nav-link" id="mars" onClick={(event) => handleTabChange(event)}>Mars</Link></li>
        <li className="nav-item"><Link to="/rovers" className="nav-link" id="rovers" onClick={(event) => handleTabChange(event)}>Rovers</Link></li>
        <li className="nav-item"><Link to="/satellites" className="nav-link" id="satellites" onClick={(event) => handleTabChange(event)}>Satellites</Link></li>
        <li className="nav-item"><Link to="/nasa" className="nav-link" id="nasa" onClick={(event) => handleTabChange(event)}>NASA</Link></li>
        <li className="nav-item"><Link to="/techport" className="nav-link" id="techport" onClick={(event) => handleTabChange(event)}>TechPort</Link></li>
        <li className="nav-item"><Link to="/about" className="nav-link" id="about" onClick={(event) => handleTabChange(event)}>About</Link></li>
      </ul>
  </div>
  );
}

export default Navbar;
