import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style.css';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="navigation">
    {location.pathname !== '/' && <Link to="/">Home</Link>}
    {location.pathname !== '/favorites' && <Link to="/favorites">Bookmarks</Link>}
  </nav>
  );
};

export default Navigation;