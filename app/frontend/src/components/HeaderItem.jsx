import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const onSwitchTab = (e, to, activeTab) => {
	if (to === activeTab) {
		e.preventDefault();
	}
};

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