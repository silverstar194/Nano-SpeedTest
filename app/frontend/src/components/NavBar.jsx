import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router'; // provides access to the history and location
import HeaderItem from './HeaderItem';

/**
 * location: has pathname to current url which is used on the tab
 * to: url to navigate to
 * text: display name of the tab
 */
const NavBar = ({location}) => {
	const activeTab = location && location.pathname.substring(1);

  function toggleClassName(el, className) {
    if (el.classList.contains(className)) {
      el.classList.remove(className);
    } else {
      el.classList.add(className);
    }
  }
         
  function toggleMenu(e) {
     var x = document.getElementsByClassName("burger-menu");
     var sideBar = document.getElementsByClassName("sidenav")[0]
     toggleClassName(sideBar, 'active');
  }

	return (
      <Fragment>
      <div className="general-main-area-navbar">
        <div className="general-navbar center-horizontally max-width">
          <div className="general-navbar-logo"></div>
          <ul className="general-navbar-items">
            <HeaderItem activeTab={activeTab} to='Stats' text='Global Statistic' />
            <HeaderItem activeTab={activeTab} to='Use Nano' text='Use Nano' />
            <HeaderItem activeTab={activeTab} to='FAQ' text='FAQ' />
            <HeaderItem activeTab={activeTab} to='Adverise' text='Adverise' />
          </ul>
          <div className="burger-menu menu-icon" onClick={(e) => toggleMenu(e)}><i class="fas fa-bars bars"></i></div>
        </div>
      </div>
      </Fragment>
	);
};

NavBar.propTypes = {
	location: PropTypes.object.isRequired
};

export default withRouter(NavBar);