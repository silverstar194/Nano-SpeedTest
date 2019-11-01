import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router'; // provides access to the history and location

/**
 * location: has pathname to current url which is used on the tab
 * to: url to navigate to
 * text: display name of the tab
 */
const Header = () => {
	return (
	<Fragment>
         <header className="header">
            <div className="header__nanologo"></div>
            <div className="header__learnmoretext__mobile">Nano is a next-generation cryptocurrency.</div>
            <div className="header__learnmoretext__desktop">Nano is a next-generation cryptocurrency created in 2015. It's unique block-lattice structure enables fast, fee-less transactions over a secure, decentralized network.</div>
            <div className="header__learnmorebutton">Learn More</div>
            <div className="header__exitbutton">
               <i className="fas fa-times header__exitbutton-close"></i>
            </div>
         </header>
         <aside className="sidenav">
            <div className="sidenav__close-icon">
               <i className="fas fa-times fa-2x sidenav__brand-close"></i>
            </div>
            <div className="sidebar__logo"></div>
            <ul className="sidenav__list">
               <li className="sidenav__list-item">Global Statistics</li>
               <li className="sidenav__list-item">Use Nano</li>
               <li className="sidenav__list-item">FAQ</li>
               <li className="sidenav__list-item">Advertise</li>
            </ul>
         </aside>
    </Fragment>
	);
};

export default Header;