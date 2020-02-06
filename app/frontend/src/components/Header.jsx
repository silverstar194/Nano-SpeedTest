import React, { Fragment } from 'react';
import HeaderItem from './HeaderItem';
import { Link } from 'react-router-dom';

/**
 * location: has pathname to current url which is used on the tab
 * to: url to navigate to
 * text: display name of the tab
 */
const Header = ({location}) => {
   const activeTab = location && location.pathname.substring(1);

   function toggleClassName(el, className) {
    if (el.classList.contains(className)) {
      el.classList.remove(className);
    } else {
      el.classList.add(className);
    }
  }

  function hideHeader(e){
      var x = document.getElementsByClassName("header")[0];
      var gc = document.getElementsByClassName("grid-container")[0];

      toggleClassName(x, "hidden");
      toggleClassName(gc, "grid-container");
      toggleClassName(gc, "hidden-grid-container-header");

  }
         
  function toggleMenu(e) {
     var sideBar = document.getElementsByClassName("sidenav")[0]
     toggleClassName(sideBar, 'active');
  }

	return (
	<Fragment>
         <header className="header">
            <div className="header__nanologo"></div>
            <div className="header__learnmoretext__desktop">Nano is a next-generation cryptocurrency created in 2015. It's unique block-lattice structure enables fast, fee-less transactions over a secure, decentralized network.</div>
            <Link className="header__learnmorebutton" to='Info'>Learn More</Link>
            <div className="header__exitbutton" onClick={(e) => hideHeader(e)}>
               <i className="fas fa-times header__exitbutton-close"></i>
            </div>
         </header>
         <aside className="sidenav">
            <div onClick={e => toggleMenu(e)} className="sidenav__close-icon">
               <i className="fas fa-times fa-2x sidenav__brand-close"></i>
            </div>
            <div className="sidebar__logo"></div>
            <ul className="sidenav__list">
               <HeaderItem activeTab={activeTab} to='' text='Test Nano' />
               <HeaderItem activeTab={activeTab} to='Stats' text='Global Statistics' />
               <HeaderItem activeTab={activeTab} to='Discover' text='Use Nano' />
               <HeaderItem activeTab={activeTab} to='Info' text='FAQ' />
               <HeaderItem activeTab={activeTab} to='BuildAd' text='Advertise' />
            </ul>
         </aside>
    </Fragment>
	);
};

export default Header;