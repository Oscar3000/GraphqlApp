import * as React from 'react';
import {NavLink} from 'react-router-dom';

import './MainNavigation.css';

function MainNavigation(props:any){
  return (
    <header className="main-navigation">
      <div className="main-navigation-logo">
        <h1>EasyEvent</h1>
      </div>
      <nav className="main-navigation-items">
        <ul>
          <li>
            <NavLink to="/auth">Authenticate</NavLink>
          </li>
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          <li>
            <NavLink to="/bookings">Bookings</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default MainNavigation;
