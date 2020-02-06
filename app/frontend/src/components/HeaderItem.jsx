import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


const onSwitchTab = (e, to, activeTab) => {
    disableMenu(e);
	if (to === activeTab) {
		e.preventDefault();
	}
};

function disableMenu(e) {
     var x = document.getElementsByClassName("bars")[0];
     var sideBar = document.getElementsByClassName("sidenav")[0]
     removeClassName(x, 'active-burger');
     removeClassName(sideBar, 'active');
}

function removeClassName(el, className) {
      el.classList.remove(className);
}

const HeaderItem = ({activeTab, to, text}) => {
	const active = (activeTab === to ? ' active' : '');
	const styles = 'general-navbar-item' + active;
    return (
		 <Link className={styles} to={to} onClick={(e) => onSwitchTab(e, to, activeTab)}> {text} </Link>

    );
};

HeaderItem.propTypes = {
	activeTab: PropTypes.string,
	to: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired
};

export default HeaderItem;