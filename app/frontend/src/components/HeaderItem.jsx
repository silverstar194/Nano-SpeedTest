import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import fetchAndUpdateAd from 'util/fetchAndUpdateAd';

const onSwitchTab = (e, to, activeTab) => {
	if (to === activeTab) {
		e.preventDefault();
	}
};

const HeaderItem = ({activeTab, to, text}) => {
	const active = (activeTab === to ? ' active' : '');
	const styles = 'general-navbar-item' + active;
    return (
		<div className={styles}>{text}</div>
    );
};

HeaderItem.propTypes = {
	activeTab: PropTypes.string.isRequired,
	to: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired
};

export default HeaderItem;