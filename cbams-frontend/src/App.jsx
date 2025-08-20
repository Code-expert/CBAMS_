import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './componenets/Layouts/Navbar.jsx';

function App() {
  const location = useLocation();
  
  // Don't show navbar on login page
  const showNavbar = location.pathname !== '/login';

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
